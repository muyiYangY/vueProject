<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<!-- <el-form-item label="Id" prop="categoryId">
			<el-input v-model="form.categoryId"></el-input>
		</el-form-item> -->
		<el-form-item label="菌菇名" prop="mushroomName">
			<el-input v-model="form.mushroomName"></el-input>
		</el-form-item>
		<el-form-item label="父级分类" prop="categoryId">
			<!-- <el-input v-model="form.categoryId"></el-input> -->
			<el-autocomplete
				v-model="state"
				:fetch-suggestions="querySearchAsync"
				placeholder="请输入分类等级"
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
		
		<el-form-item label="分布地点" prop="mushroomLocation">
			<el-input v-model="form.mushroomLocation"></el-input>
		</el-form-item>
		<el-form-item label="描述" prop="mushroomDesc">
			<el-input v-model="form.mushroomDesc"></el-input>
		</el-form-item>
		<!-- <el-form-item label="用户名" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="账户余额" prop="money">
			<el-input v-model.number="form.money"></el-input>
		</el-form-item>
		<el-form-item label="地址" prop="address">
			<el-input v-model="form.address"></el-input>
		</el-form-item>
		<el-form-item label="账户状态" prop="state">
			<el-switch
				v-model="form.state"
				:active-value="1"
				:inactive-value="0"
				active-text="正常"
				inactive-text="异常"
			></el-switch>
		</el-form-item>
		<el-form-item label="注册日期" prop="date">
			<el-date-picker type="date" v-model="form.date" value-format="YYYY-MM-DD"></el-date-picker>
		</el-form-item>
		<el-form-item label="上传头像" prop="thumb">
			<el-upload
				class="avatar-uploader"
				action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload"
			>
				<img v-if="form.thumb" :src="form.thumb" class="avatar" />
				<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
			</el-upload>
		</el-form-item> -->
		<el-form-item>
			<el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';
import { ref, onMounted, vModelCheckbox } from 'vue';
import axios from 'axios';

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
  
  if(queryString&&queryString.length > 0) {
	const apiUrl = 'http://182.92.65.28:8080/category/' + queryString
	number = Number(queryString)
	await axios.get(apiUrl)
	.then(res => {
		if(res.data.data.length > 0){
			list = res.data.data.map(item => {
				return {
					value: `${item.categoryName}`
				}
			})
			
		}
		cb(list)
		
	})
	
  }
}

const handleSelect = (item) => {
	state.value = item.value
}



// ----------------------------------
const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	name: [{ required: true, message: '用户名', trigger: 'blur' }]
};
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (!valid) return false;
		if(!props.edit){
			const apiUrl = 'http://182.92.65.28:8080/mushrooms' 
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
			console.log(dede);
			
			axios.post(apiUrl, dede)
				.then(res => {
					console.log(res);
					props.update(form.value);
					ElMessage.success('保存成功！');
				})
				.catch(error => {
					if (error.response) {
						// 请求已发出，但服务器响应的状态码不在 2xx 范围内
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					} else if (error.request) {
						// 请求已发出，但没有收到响应
						console.log(error.request);
					} else {
						// 发生了一些问题，导致了请求的发送
						console.log('Error', error.message);
					}
					console.log(error.config);
				});
		} else {
			const updataUrl = 'http://182.92.65.28:8080/mushrooms/'+form.value.mushroomId; 
			let dede = 
				{
					mushroomName: form.value.mushroomName,
					categoryId: form.value.categoryId,
					isEat: yesno.value == 1? 1 : 0,
					isPoison: poison.value == 1? 1 : 0,
					mushroomLocation: form.value.mushroomLocation,
					mushroomDesc: form.value.mushroomDesc,
				}
				console.log(dede);
				
			axios.put(updataUrl, dede)
				.then(res => {
					console.log(res);
					props.update(form.value);
					ElMessage.success('修改成功！');
				})
				.catch(error => {
					console.log(error);
					
				})
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
