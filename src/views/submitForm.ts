import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import axios from 'axios';
import { LoginInfo, router } from './login.vue';

export const submitForm = (formEl: FormInstance | undefined) => {
if (!formEl) return;
formEl.validate((valid: boolean) => {
if (valid) {
const apiUrl = 'https://your-java-spring-boot-api-url'; // 替换为你的Java Spring Boot API的实际URL


// 构建发送给后端的数据
const requestData: LoginInfo = {
username: formEl.getFieldValue('username'),
password: formEl.getFieldValue('password'),
};

// 发送POST请求到Java Spring Boot后端
axios.post(apiUrl, requestData)
.then(response => {
// 处理后端响应，可以根据需要执行相应的操作
console.log('后端响应:', response.data);

// 示例：显示成功消息
ElMessage.success('登录成功');

// 示例：跳转到首页
router.push('/');
})
.catch(error => {
// 处理请求错误，例如显示错误消息
console.error('请求错误:', error);
ElMessage.error('登录失败');
});

// 其他操作，例如保存用户名到本地存储、处理权限相关的操作等
} else {
// 表单验证不通过时的处理
ElMessage.error('登录失败');
}
});
};
