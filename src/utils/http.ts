// axios实例
import axios from "axios";

const server = axios.create({ timeout: 5000 });

// 请求拦截
server.interceptors.request.use(
  (config) => {
    // if(config.method.toLowerCase() === 'post'){
    //   return Promise.reject('wrong')
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
server.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response) {
      return error.response.data;
    } else {
      console.log("==?",error)
      return Promise.reject(error);
    }
  }
);

// axios实例
export default server;
