import request from './request'
export const service = window.globalUrl.service

/*****************实验*******************/

//获取实验列表
export const api_getExperimentList = (data) => {
  return request({
    url: `${service}/experiment/getExperimentList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取实验信息详情（id）
export const api_getExperimentInfoById = (data) => {
  return request({
    url: `${service}/experiment/getExperimentInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建实验
export const api_createExperiment = (data) => {
  return request({
    url: `${service}/experiment/createExperiment`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新实验
export const api_updateExperiment = (data) => {
  return request({
    url: `${service}/experiment/updateExperiment`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新实验状态
export const api_updateExperimentStatus = (data) => {
  return request({
    url: `${service}/experiment/updateExperimentStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除实验
export const api_deleteExperiment = (data) => {
  return request({
    url: `${service}/experiment/deleteExperiment`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新实验条件状态
export const api_updateExperimentConditionStatus = (data) => {
  return request({
    url: `${service}/experiment/updateExperimentConditionStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新实验条件内容
export const api_updateExperimentConditionContent = (data) => {
  return request({
    url: `${service}/experiment/updateExperimentConditionContent`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//清空实验学习考核记录
export const api_clearExperimentRecord = (data) => {
  return request({
    url: `${service}/experiment/clearExperimentRecord`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************分项*******************/

//获取分项列表
export const api_getItemList = (data) => {
  return request({
    url: `${service}/item/getItemList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取分项信息（id）
export const api_getItemInfoById = (data) => {
  return request({
    url: `${service}/item/getItemInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建分项
export const api_createItem = (data) => {
  return request({
    url: `${service}/item/createItem`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新分项
export const api_updateItem = (data) => {
  return request({
    url: `${service}/item/updateItem`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新分项状态
export const api_updateItemStatus = (data) => {
  return request({
    url: `${service}/item/updateItemStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除分项
export const api_deleteItem = (data) => {
  return request({
    url: `${service}/item/deleteItem`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************分项成绩*******************/

//获取分项成绩列表
export const api_getItemResultList = (data) => {
  return request({
    url: `${service}/itemResult/getItemResultList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取分项成绩信息（id）
export const api_getItemResultInfoById = (data) => {
  return request({
    url: `${service}/itemResult/getItemResultInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:false,
  })
}

//导出分项成绩
export const api_exportItemResultList = (data) => {
  return request({
    url: `${service}/itemResult/exportItemResultList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//拉取分项成绩列表（竞赛）
export const api_fetchItemResultListByCompetition = (data) => {
  return request({
    url: `${service}/itemResult/fetchItemResultListByCompetition`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}
