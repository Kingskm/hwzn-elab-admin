import request from './request'
export const service = window.globalUrl.service

/*****************横幅*******************/

//获取横幅列表
export const api_getBannerList = (data) => {
  return request({
    url: `${service}/banner/getBannerList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建横幅
export const api_createBanner = (data) => {
  return request({
    url: `${service}/banner/createBanner`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新横幅
export const api_updateBanner = (data) => {
  return request({
    url: `${service}/banner/updateBanner`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新横幅状态
export const api_updateBannerStatus = (data) => {
  return request({
    url: `${service}/banner/updateBannerStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除横幅
export const api_deleteBanner = (data) => {
  return request({
    url: `${service}/banner/deleteBanner`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************新闻*******************/

//获取新闻列表
export const api_getNewsList = (data) => {
  return request({
    url: `${service}/news/getNewsList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取新闻详情（id）
export const api_getNewsInfoById = (data) => {
  return request({
    url: `${service}/news/getNewsInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建新闻
export const api_createNews = (data) => {
  return request({
    url: `${service}/news/createNews`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新新闻
export const api_updateNews = (data) => {
  return request({
    url: `${service}/news/updateNews`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新新闻状态
export const api_updateNewsStatus = (data) => {
  return request({
    url: `${service}/news/updateNewsStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除新闻
export const api_deleteNews = (data) => {
  return request({
    url: `${service}/news/deleteNews`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}