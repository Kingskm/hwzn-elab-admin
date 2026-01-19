import { Message } from 'element-ui'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
	goLoginPage
} from "@/utils/common.js"
/**
 * @param {*} msgType 接口名称
 * @param {*} requestBody 请求体参数
 * @param {*} responseType 返回值
 */
async function request(options = {}, config = {}) {
  const errAction = config.ERROR_ACTION // 异常处理
  const tokenRequired = config.TOKEN_REQUIRED //是否需要token
  const errorMessage = (message) => errAction === 'message' && Message.error(message)
  const { url,data={} } = options
  //如果接口需要token，则在请求头上面加token
  axios.interceptors.request.use(
    config => {
      if(tokenRequired){
        config.headers.token =Cookies.get('token') || null;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  console.log("req",url+"\n",data)
  return new Promise((resolve, reject) => {
    axios
    .post(url,data)
    .then(res => {
      console.log("res",url+"\n",res.data)
      if(res.headers.newtoken){
        Cookies.set("token",res.headers.newtoken)
      }
      if (res.data.code === 0) {
        resolve(res.data)
      } else {
        errorMessage( res.data.msg || '接口异常，请稍后重试~~')
        resolve(res.data)
      }
    }, err => {
      const { status: httpStatus } = err.response
      if (httpStatus === 401) {
        errorMessage('用户未登录或者已过期')
        goLoginPage(location.href)
        return undefined
      } else if (httpStatus === 402) {
        errorMessage('无操作权限，请启用相关操作员~~')
        return undefined
      } else {
        errorMessage('服务异常，请稍后重试~~')
        return undefined
      }
    })
  })
}
export default request