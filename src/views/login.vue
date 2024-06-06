<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <template #prepend>
                            <el-button :icon="User"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter="submitForm(login)"
                    >
                        <template #prepend>
                            <el-button :icon="Lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm(login)">登录</el-button>
                </div>
                <el-checkbox class="login-tips" v-model="checked" label="记住密码" size="large" />
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import axios from 'axios';
interface LoginInfo {
    username: string;
    password: string;
}

const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
    username: defParam ? defParam.username : '',
    password: defParam ? defParam.password : '',
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const permiss = usePermissStore();
const login = ref<FormInstance>();  // 响应式引用
const submitForm = (formEl: FormInstance | undefined) => {
    // router.push('/export');
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            if (valid) {
            const apiUrl = 'http://101.200.79.152:8080/user/loginMaster';
            const formData = new FormData();
    
            console.log('1111');
            
            formData.append('username', param.username);
            formData.append('password', param.password);
    
            console.log(55);
            // router.push('/import');
            axios.post(apiUrl, formData)
            .then(response => {
                console.log(111);
                
                console.log('后端响应:', response.data);
                if(response.data.code==200){
                    ElMessage.success('登录成功');
                    localStorage.setItem('ms_username', param.username);
                    const keys = permiss.defaultList[param.username == 'admin' ? 'admin' : 'user'];
                    permiss.handleSet(keys);
                    localStorage.setItem('token', response.data.msg)
                    console.log(response.data.msg);
                    
                    localStorage.setItem('ms_keys', JSON.stringify(keys));
                    router.push('/');
                    if (checked.value) {
                        localStorage.setItem('login-param', JSON.stringify(param));
                    } else {
                        localStorage.removeItem('login-param');
                    }
        
                    router.push('/');
                }
                else{
                    ElMessage.error('账号或密码错误');
                }
                // 这里可以进行其他操作，比如跳转到首页
                
            
            })
            .catch(error => {
                console.log(2222);
                
                console.error('请求错误:', error);
                ElMessage.error('登录失败');
            });
           
        } else {
            ElMessage.error('登录失败');
            return false;
        }
    }});
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #333;
    font-weight: bold;
    padding-top: 10px;
}
.ms-login {
    width: 350px;
    border-radius: 5px;
    background: #fff;
}
.ms-content {
    padding: 10px 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #333;
}
</style>
