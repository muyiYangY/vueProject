<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<!-- <el-form-item label="Id" prop="categoryId">
			<el-input v-model="form.categoryId"></el-input>
		</el-form-item> -->
		<el-form-item label="类别" prop="categoryName">
			<el-input v-model="form.categoryName"></el-input>
		</el-form-item>
		<el-form-item label="分类等级" prop="categoryLevel">
			<el-input v-model="form.categoryLevel"></el-input>
		</el-form-item>
		<el-form-item label="父级分类" prop="categoryParent">
			<el-input v-model="form.categoryParent"></el-input>
		</el-form-item>
		<el-form-item label="Root" prop="categoryRoot">
			<el-input v-model="form.categoryRoot"></el-input>
		</el-form-item>
		<el-form-item label="描述" prop="categoryDesc">
			<el-input v-model="form.categoryDesc"></el-input>
		</el-form-item>
		<!-- <el-form-item label="注册日期" prop="date">
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
import { ref } from 'vue';
import axios from 'axios';
import { tableEditSave, tableEditUpdate } from '../api/ymushapi';

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
	categoryId: '',
	categoryName: '',
	categoryLevel: '',
	categoryParent: '',
	categoryRoot: '',
	categoryDesc: '',
};

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
			console.log(form.value);
			let dede = [
				{
					"categoryId": 0,
					"categoryName": form.value.categoryName,
					"categoryLevel": form.value.categoryLevel,
					"categoryParent": form.value.categoryParent,
					"categoryRoot": form.value.categoryRoot,
					"categoryDesc": form.value.categoryDesc
				},
			]
			const res = await tableEditSave(dede)
			console.log(res);
			if(res.data.code == 200) {
				props.update(form.value)
				ElMessage.success('保存成功!')
			} else {
				ElMessage.error('保存失败!')
			}
		
		} else {
			let dede =
				{
					"categoryId": form.value.categoryId,
					"categoryName": form.value.categoryName,
					"categoryLevel": form.value.categoryLevel,
					"categoryParent": form.value.categoryParent,
					"categoryRoot": form.value.categoryRoot,
					"categoryDesc": form.value.categoryDesc
				}
			const res = await tableEditUpdate(dede);
			console.log(res);
			if(res.data.code == 200) {
				props.update(form.value)
				ElMessage.success('修改成功!');
			} else {
				ElMessage.error('修改失败!');
			}
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
