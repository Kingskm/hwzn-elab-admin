import request from './request'
export const service = window.globalUrl.service

/*****************竞赛*******************/

//获取竞赛列表（分页排序）
export const api_getCompetitionList = (data) => {
  return request({
    url: `${service}/competition/getCompetitionList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取竞赛信息（id）
export const api_getCompetitionInfoById = (data) => {
  return request({
    url: `${service}/competition/getCompetitionInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建竞赛
export const api_createCompetition = (data) => {
  return request({
    url: `${service}/competition/createCompetition`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新竞赛
export const api_updateCompetition = (data) => {
  return request({
    url: `${service}/competition/updateCompetition`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除竞赛
export const api_deleteCompetition = (data) => {
  return request({
    url: `${service}/competition/deleteCompetition`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取竞赛选手列表（id）
export const api_getCompetitionPlayerListById = (data) => {
  return request({
    url: `${service}/competition/getCompetitionPlayerListById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************排名*******************/

//获取排名列表
export const api_getRankList = (data) => {
  return request({
    url: `${service}/rank/getRankList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}