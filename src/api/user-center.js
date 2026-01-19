import request from './request'
export const service = window.globalUrl.service

/*****************院系*******************/

//获取院系列表
export const api_getDepartmentList = (data) => {
  return request({
    url: `${service}/department/getDepartmentList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建院系
export const api_createDepartment = (data) => {
  return request({
    url: `${service}/department/createDepartment`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新院系
export const api_updateDepartment = (data) => {
  return request({
    url: `${service}/department/updateDepartment`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除院系
export const api_deleteDepartment = (data) => {
  return request({
    url: `${service}/department/deleteDepartment`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************班级*******************/

//获取班级列表
export const api_getClassList = (data) => {
  return request({
    url: `${service}/class/getClassList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建班级
export const api_createClass = (data) => {
  return request({
    url: `${service}/class/createClass`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新班级
export const api_updateClass = (data) => {
  return request({
    url: `${service}/class/updateClass`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除班级
export const api_deleteClass = (data) => {
  return request({
    url: `${service}/class/deleteClass`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************用户*******************/

//获取用户列表
export const api_getUserList = (data) => {
  return request({
    url: `${service}/user/getUserList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建用户
export const api_createUser = (data) => {
  return request({
    url: `${service}/user/createUser`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建用户（批量）
export const api_createUserByBatch = (data) => {
  return request({
    url: `${service}/user/createUserByBatch`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新用户
export const api_updateUser = (data) => {
  return request({
    url: `${service}/user/updateUser`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新用户密码
export const api_updateMyPassword = (data) => {
  return request({
    url: `${service}/user/updateMyPassword`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//还原用户密码
export const api_restoreUserPassword = (data) => {
  return request({
    url: `${service}/user/restoreUserPassword`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新用户状态
export const api_updateUserStatus = (data) => {
  return request({
    url: `${service}/user/updateUserStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除用户
export const api_deleteUser = (data) => {
  return request({
    url: `${service}/user/deleteUser`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取用户信息（token）
export const api_getUserInfoByToken = (data) => {
  return request({
    url: `${service}/user/getUserInfoByToken`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}