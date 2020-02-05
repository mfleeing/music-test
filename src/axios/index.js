// import axios from "axios";
// import qs from "qs";
// import { Message } from "element-ui";
// import router from "../router";


// const Axios = axios.create({
//     baseURL: "/api", // 因为我本地做了反向代理
//     timeout: 10000,
//     responseType: "json",
//     withCredentials: true, // 是否允许带cookie这些
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
//     }
// });

// //POST传参序列化(添加请求拦截器)
// Axios.interceptors.request.use(
//     config => {
//         // 在发送请求之前做某件事
//         if (
//             config.method === "post"
//         ) {
//             // 序列化
//             config.data = qs.stringify(config.data);
//             // 温馨提示,若是贵公司的提交能直接接受json 格式,可以不用 qs 来序列化的
//         }

//         // 若是有做鉴权token , 就给头部带上token
//         // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
//         // 这里localStorage一般是请求成功后我们自行写入到本地的,因为你放在vuex刷新就没了
//         // 一些必要的数据写入本地,优先从本地读取
//         if (localStorage.token) {
//             config.headers.Authorization = localStorage.token;
//         }
//         return config;
//     },
//     error => {
//         // error 的回调信息,看贵公司的定义
//         Message({
//             //  饿了么的消息弹窗组件,类似toast
//             showClose: true,
//             message: error && error.data.error.message,
//             type: 'error'
//         });
//         return Promise.reject(error.data.error.message);
//     }
// );
// export default Axios