import request from './request'
export const service = window.globalUrl.service

/***********登录日志***********/

//获取登录日志列表
export const api_getLoginLogList = (data) => {
  return request({
    url: `${service}/log/getLoginLogList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/***********用户日志***********/

//获取用户日志列表
export const api_getUserLogList = (data) => {
  return request({
    url: `${service}/log/getUserLogList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/***********数据日志***********/

//获取数据日志列表
export const api_getDataLogList = (data) => {
  return request({
    url: `${service}/log/getDataLogList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}