import axios from 'axios'
import Vue from 'vue'
import router from '@/router'
import { Message  } from 'element-ui';
import qs from 'qs';

//设置全局的请求次数，请求的间隙
axios.defaults.retry = 3;
axios.defaults.retryDelay = 5000;

axios.interceptors.request.use(function (config) {
  let token = Vue.$cookies.get('token')
    if (token) {
        config.headers.common['Authorization'] = token;
        if(config.method == "get") {
          config.paramsSerializer = function(params) {
              return qs.stringify(params, {arrayFormat: 'repeat'})
          }
        }
    }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) { //
  if (response.data.code === 401) {
    Vue.$cookies.remove('token')
    let refreshToken = Vue.$cookies.get('refreshToken')
    let clientId = localStorage.getItem('client_id');
    let clientSecret = localStorage.getItem('client_secret');
    postAction(
      'http://192.168.10.48:9001/api-auth/oauth/token?grant_type=refresh-token&refresh_token='+refreshToken+'&client_id='+clientId+'&client_secret='+clientSecret)
    .then((res)=> {
      let token = res.data.data.token_type+' '+ res.data.data.access_token
      Vue.$cookies.set("token",token,"1d","/");
      Vue.$cookies.set("refreshToken",res.data.data.refresh_token,"30d","/");
    })
  } else if (response.data.token) { // 判断token是否存在，如果存在说明需要更新token
    Vue.$cookies.set("token",response.data.token,"1d","/");
  } else if(response.data.code === 400) {
    Vue.$cookies.remove("token");
    Vue.$cookies.remove("refreshToken");
    router.replace('/login')
  }
  return response
  }, function (err) {
    const { response } = err
    // If config does not exist or the retry option is not set, reject
    if(!response || !response.retry) return Promise.reject(err);
    // Set the variable for keeping track of the retry count
    response.__retryCount = response.__retryCount || 0;
    // Check if we've maxed out the total number of retries
    if(response.__retryCount >= response.retry) {
      // Reject with the error
      return Promise.reject(err);
    }
    // Increase the retry count
    response.__retryCount += 1;
        // Create new promise to handle exponential backoff
        var backoff = new Promise(function(resolve) {
          setTimeout(function() {
              resolve();
          }, response.retryDelay || 1);
      });
      
    if (response) {
      errorHandle(response.status)
      return Promise.reject(response)
    } else {
      // 处理断网
      if (!window.navigator.onLine){
        Message.error("断网了");
      } // else {
      //   Message.error('请求失败，请刷新页面');
      // }
    }
      // Return the promise in which recalls axios to retry the request
      return backoff.then(function() {
          return axios(response);
      });
  })
  const errorHandle = (status) => {
    if (status === 404){
      router.push('/404')
    }
  }
  
  
export function getAction(url,parameter) {
  return axios({
    url: url,
    method: 'get',
    params: parameter
  })
}


export function postAction(url,parameter) {
  return axios({
    url: url,
    method:'post' ,
    data: parameter,
  })
}
export function postFileAction(url,parameter) {
  return axios({
    url: url,
    method:'post' ,
    headers: {
      'Content-Type':'multipart/form-data'
    },
    data: parameter,
  })
}


/**
 * 下载文件
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downloadFileUrl(url,parameter){
  return axios({
    url: url,
    params: parameter,
    method:'get',
    responseType: 'blob'
  })
}