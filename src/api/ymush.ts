import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://101.200.79.152:8080',
    timeout: 3000,
  });
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // console.log(config);
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

export default instance