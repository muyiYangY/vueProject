<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="菌菇名" prop="mushroomName">
			<el-input v-model="form.mushroomName"></el-input>
		</el-form-item>
		<el-form-item label="父级分类" prop="categoryId">
			<el-autocomplete
				v-model="state"
				:fetch-suggestions="querySearchAsync"
				placeholder="请输入分类名"
				@select="handleSelect"
				:trigger-on-focus="false"
			/>
		</el-form-item>
		<el-form-item label="是否能食用" prop="isEat">
            <el-select v-model="yesno" placeholder="是" @change="eat">
				<el-option 
					v-for="item in options" 
					:key="item.value" 
					:label="item.label" 
					:value="item.value" />
			</el-select>
		</el-form-item>
		<el-form-item label="是否有毒" prop="isPoison">
            <el-select v-model="poison" placeholder="否">
				<el-option 
					v-for="item in options" 
					:key="item.value" 
					:label="item.label" 
					:value="item.value" />
			</el-select>
		</el-form-item>
		
		<!-- <el-form-item label="分布地点" prop="mushroomLocation">
			<el-input v-model="form.mushroomLocation"></el-input>
		</el-form-item> -->
		<el-form-item label="描述" prop="mushroomDesc">
			<el-input type="textarea" :rows="4" v-model="form.mushroomDesc"></el-input>
			<!-- <el-input v-model="form.mushroomDesc"></el-input> -->
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';
import { ref, onMounted, vModelCheckbox } from 'vue';
import axios from 'axios';
import { mushEidtSave, mushEditUpdate, mushEditSearch } from '../api/ymushapi';

let poison = ref(0)
let yesno = ref(1)

const options = [
	{ value: 1, label: '是' },
	{ value: 0, label: '否' }
]
const eat = () => {
	console.log(yesno.value);
}
// 通过defineProps定义props对象，包含了三个属性
const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	edit: {
		type: Boolean,
		required: false
	},
	update: {
		type: Function,
		required: true
	}
});

const defaultData = {
	mushroomId: 0,
	mushroomName: '',
	categoryId: 6,
	isEat: yesno.value,
	isPoison: poison.value,
	mushroomLocation: '',
	mushroomDesc: '',
};
// 父级分类
const state = ref('')

let number = 1
let list = []
let filterData = []
const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  
  if(queryString&&queryString.length >= 0) {
	const res = await mushEditSearch()
	console.log(res);
	try {
		list = res.data.data.map(item => {
			return {
				id: item.categoryId,
				value: item.categoryName
			}
		})
		list = list.filter(item => item.value.startsWith(queryString));
		filterData = list
		cb(list)
		console.log(queryString);
		
	} catch (error) {
		console.log(error);
		
	}
  }
}


const handleSelect = (item) => {
	state.value = item.value
	console.log(state.value);
	console.log(filterData);
	form.value.categoryId = filterData == null ? form.value.categoryId : filterData[0].id;
}



// ----------------------------------
const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	name: [{ required: true, message: '用户名', trigger: 'blur' }]
};
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return false;
		if(!props.edit){
			let dede = 
				{
					mushroomId: 0,
					mushroomName: form.value.mushroomName,
					categoryId: number,
					isEat: yesno.value,
					isPoison: poison.value,
					mushroomLocation: form.value.mushroomLocation,
					mushroomDesc: form.value.mushroomDesc,
					module3d: ''
				}	
			const res = await mushEidtSave(dede)
			console.log(res);
			if(res.data.code == 200) {
				props.update(form.value);
				ElMessage.success('保存成功!!')
			} else {
				ElMessage.error('保存失败!!')
			}
		} else {
			
			// const updataUrl = 'http://182.92.65.28:8080/mushrooms/'+form.value.mushroomId; 
			let dede = 
				{
					mushroomId: form.value.mushroomId,
					mushroomName: form.value.mushroomName,
					categoryId: form.value.categoryId,
					isEat: yesno.value == 1? 1 : 0,
					isPoison: poison.value == 1? 1 : 0,
					mushroomLocation: form.value.mushroomLocation,
					mushroomDesc: form.value.mushroomDesc
				}
			console.log(dede);
			const res = await mushEditUpdate(dede)
			if(res.data.code == 200) {
				props.update(form.value);
				ElMessage.success('修改成功！');
			} else {
				ElMessage.error('修改失败！请联系管理员');
			}
			/* axios.put(updataUrl, dede)
				.then(res => {
					console.log(res);
					props.update(form.value);
					ElMessage.success('修改成功！');
				})
				.catch(error => {
					console.log(error);
					
				}) */
		}
		
		
		
	});
};

/* const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	form.value.thumb = URL.createObjectURL(uploadFile.raw!);
}; */

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('Avatar picture must be JPG format!');
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('Avatar picture size can not exceed 2MB!');
		return false;
	}
	return true;
};

</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
