import request from './request'
export const service = window.globalUrl.service

/***********上传*******************/

//base64上传
export const api_uploadByBase64 = (data) => {
  return request({
    url: `${service}/upload/uploadByBase64`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************类别*******************/

//获取类别列表
export const api_getTypeList = (data) => {
  return request({
    url: `${service}/type/getTypeList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建类别
export const api_createType = (data) => {
  return request({
    url: `${service}/type/createType`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新类别
export const api_updateType = (data) => {
  return request({
    url: `${service}/type/updateType`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新类别状态
export const api_updateTypeStatus = (data) => {
  return request({
    url: `${service}/type/updateTypeStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除类别
export const api_deleteType = (data) => {
  return request({
    url: `${service}/type/deleteType`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/***********文件**************/

//拉取文件列表
export const api_getFileList = (data) => {
  return request({
    url: `${service}/file/getFileList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建文件夹
export const api_createFolder = (data) => {
  return request({
    url: `${service}/file/createFolder`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新文件
export const api_updateFile = (data) => {
  return request({
    url: `${service}/file/updateFile`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除文件
export const api_deleteFile = (data) => {
  return request({
    url: `${service}/file/deleteFile`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除文件(批量)
export const api_deleteFileByBatch = (data) => {
  return request({
    url: `${service}/file/deleteFileByBatch`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/***********申请**************/

//获取申请列表（分页排序）
export const api_getApplicationListByPageSort = (data) => {
  return request({
    url: `${service}/application/getApplicationListByPageSort`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取申请信息（id）
export const api_getApplicationInfoById = (data) => {
  return request({
    url: `${service}/application/getApplicationInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//审核申请
export const api_checkApplication = (data) => {
  return request({
    url: `${service}/application/checkApplication`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/***********数据**************/

//获取平台数据
export const api_getPlatFormData = (data) => {
  return request({
    url: `${service}/data/getPlatFormData`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取实验数据
export const api_getExperimentData = (data) => {
  return request({
    url: `${service}/data/getExperimentData`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}