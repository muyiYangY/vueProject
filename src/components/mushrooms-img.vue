<template>
	<el-upload
        v-model:file-list="fileList"
        action
        :http-request="uploadImgg"

        list-type="picture-card"
        :before-upload="beforeAvatarUpload"
		    :on-error="handleAvatarError"
        :on-remove="rmImg">
        <el-icon><Plus /></el-icon>
    </el-upload>
</template>

<script lang="ts" setup>
// import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus'
import axios from 'axios';
import { mushImg, mushImgGet, mushImgDel } from '../api/ymushapi';

// 通过defineProps定义props对象，包含了三个属性
const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	update: {
		type: Function,
		required: true
	}
});
const setupP = () => {
	console.log(props.data.mushroomId);
	
}
setupP()
const uploadImgg = async () => {
  let fomedata = new FormData();
  fomedata.append('id', props.data.mushroomId)
  fomedata.append('imageFile', selectedImage);
  const res = await mushImg(fomedata);
  if(res.data.code == 200) {
    console.log(res);
    ElMessage.success('上传成功!')
  }
}
const headers = {
  'Content-Type': 'multipart/form-data'
  }
const fileList = ref<UploadUserFile[]>([])
const getImg = async () => {
  const res = await mushImgGet(props.data.mushroomId)
    console.log(res.data.data)
    fileList.value = res.data.data.map((item) => {
      return {
        name: item.imgId,
        url: item.imgUrl
      }
    })
}
getImg()

const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile, scope) => {

  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  console.log(response);
  scope = response;
}
let selectedImage: File | null = null;
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('上传的图片必须为jpg格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片大小不得大于2MB!')
    return false
  }
  selectedImage = rawFile;
  console.log(selectedImage);
  
  return true
}
const handleAvatarError: UploadProps['onError'] = (error, uploadFile) => {
  ElMessage.error('图片上传失败!')
  console.log(error);
}
// rmImg
const rmImg: UploadProps['onRemove'] = async (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
  
  const res = await mushImgDel(uploadFile.name)
  if( res.data.code = 200){
    ElMessage.success('删除成功!')
  } else {
    ElMessage.error('删除失败,联系管理员')
  }
  /* await axios.delete('http://182.92.65.28:8080/mushrooms/deleteMushroomImg', {
    params: {
      id: uploadFile.name
    }
  })
  .then(res => {
    console.log(res);
    ElMessage.success('删除成功!')
  }) */
}







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
