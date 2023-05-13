import axios from 'axios';
import useUserStore from '@/store/user'

export interface Request<T>{
  code: number | string;
  data: T;
  message: string;
  msg?: string;
  desc?: string
}

axios.defaults.baseURL = '';
// 10秒超时
axios.defaults.timeout = 1000 * 30;

axios.defaults.headers.post['Content-Type'] = 'application/json'

// 特定接口只使用token1，其余接口使用token2
const token1ApiList = ['/fifa/', '/sbt/']
axios.interceptors.request.use(config => {
  console.log('%c [ config ]-20', 'font-size:13px; background:pink; color:#bf2c9f;', config)
  const user = useUserStore()
  const url = config.url
  const noAuth = url?.endsWith('.json')
  // const useToken1 = token1ApiList.some(e => url?.includes(e))
  // const token1 = user.token || '';
  const token2 = user.relationAuthorization || '';
  // if (!token1) {
  //   store.setLoginAction(false)
  // }
  config.headers = config.headers || {};
  // if(token1 && useToken1) {
  // config.headers['I-Authorization'] = `Bearer ${token1}`;
  // }
  if(token2 && !noAuth) {
    config.headers['Authorization'] = `Bearer ${token2}`;
  }
  // config.headers['X-source'] = 'web';
  
  // config.headers['X-Token'] = _token;
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  if (response.status === 200) {
    const code = +(response.data.code)
    return Promise.resolve(response);
  } else {
    const _data = {
      eventName: 'post request reject',
      message: `response.status:${response?.status}, response.data:${response?.data}`,
      source: response?.config?.url
    }
    console.error(_data);
    return Promise.reject(response);
  }
}, error => {
  const _data = {
    eventName: 'post request error',
    message: error?.toString(),
    source: error?.config?.url
  }
  console.error(_data, error);
  throw new Error(error?.toString())
});

/**
 * get方法，对应get请求
 * @param {String} url 请求的url地址
 * @param {Object} params 请求时携带的参数
 */
export function get(url: string, params?: {[key:string]: string | number | boolean}, config = {}) {
  return new Promise<Request<any>>((resolve) => {
    axios.get(url, {
      params,
      ...config,
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      resolve({
        code: -1,
        data: err.toString(),
        message: err.toString(),
      });
    });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url 请求的url地址
 * @param {Object} params 请求时携带的参数
 */
export function post(url: string, params?: {}, config = {}) {
  return new Promise<Request<any>>((resolve) => {
    axios.post(url, params, {
      ...config,
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        resolve({
          code: -1,
          data: err.toString(),
          message: err.toString(),
        });
      });
  });
}

export function file(url: string, file: any, imageUsage:string,  config = {}) {
  return new Promise<Request<any>>((resolve) => {
    const formData = new FormData()
    formData.append('file', file)
    !!imageUsage && formData.append('imageUsage', imageUsage);
    axios.post(url, formData, {
      headers: {
        'Content-Type': "multipart/form-data"
      },
      transformRequest: [function() {
        return formData
      }],
      ...config,
    }).then(res => {
      resolve(res.data);
    })
    .catch(err => {
      resolve({
        code: -1,
        data: err.toString(),
        message: err.toString(),
      });
    });
  })
}

// 合并方法
export const http = {
  get,
  post/* ,
  config */
};