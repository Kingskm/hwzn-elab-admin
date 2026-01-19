import request from './request'
export const service = window.globalUrl.service

/*****************课程*******************/

//获取课程列表
export const api_getCourseList = (data) => {
  return request({
    url: `${service}/course/getCourseList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取课程信息（id）
export const api_getCourseInfoById = (data) => {
  return request({
    url: `${service}/course/getCourseInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建课程
export const api_createCourse = (data) => {
  return request({
    url: `${service}/course/createCourse`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新课程
export const api_updateCourse = (data) => {
  return request({
    url: `${service}/course/updateCourse`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新课程状态
export const api_updateCourseStatus = (data) => {
  return request({
    url: `${service}/course/updateCourseStatus`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除课程
export const api_deleteCourse = (data) => {
  return request({
    url: `${service}/course/deleteCourse`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************题目*******************/

//获取题目列表
export const api_getQuestionList= (data) => {
  return request({
    url: `${service}/question/getQuestionList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取题目信息（id）
export const api_getQuestionInfoById= (data) => {
  return request({
    url: `${service}/question/getQuestionInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建题目
export const api_createQuestion= (data) => {
  return request({
    url: `${service}/question/createQuestion`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新题目
export const api_updateQuestion= (data) => {
  return request({
    url: `${service}/question/updateQuestion`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除题目
export const api_deleteQuestion= (data) => {
  return request({
    url: `${service}/question/deleteQuestion`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************试卷*******************/

//获取试卷列表
export const api_getTestPaperList = (data) => {
  return request({
    url: `${service}/testPaper/getTestPaperList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取试卷信息（id）
export const api_getTestPaperInfoById = (data) => {
  return request({
    url: `${service}/testPaper/getTestPaperInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建试卷
export const api_createTestPaper = (data) => {
  return request({
    url: `${service}/testPaper/createTestPaper`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建试卷(AI)
export const api_createTestPaperByAI = (data) => {
  return request({
    url: `${service}/testPaper/createTestPaperByAI`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建试卷(Copy)
export const api_createTestPaperByCopy = (data) => {
  return request({
    url: `${service}/testPaper/createTestPaperByCopy`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新试卷
export const api_updateTestPaper = (data) => {
  return request({
    url: `${service}/testPaper/updateTestPaper`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除试卷
export const api_deleteTestPaper = (data) => {
  return request({
    url: `${service}/testPaper/deleteTestPaper`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************资源*******************/

//获取资源列表
export const api_getResourceList = (data) => {
  return request({
    url: `${service}/resource/getResourceList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取资源信息（id）
export const api_getResourceInfoById = (data) => {
  return request({
    url: `${service}/resource/getResourceInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建资源
export const api_createResource = (data) => {
  return request({
    url: `${service}/resource/createResource`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新资源
export const api_updateResource = (data) => {
  return request({
    url: `${service}/resource/updateResource`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除资源
export const api_deleteResource = (data) => {
  return request({
    url: `${service}/resource/deleteResource`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************考试*******************/

//获取考试列表
export const api_getExamList = (data) => {
  return request({
    url: `${service}/exam/getExamList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取考试信息（id）
export const api_getExamInfoById = (data) => {
  return request({
    url: `${service}/exam/getExamInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//创建考试
export const api_createExam = (data) => {
  return request({
    url: `${service}/exam/createExam`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//更新考试
export const api_updateExam = (data) => {
  return request({
    url: `${service}/exam/updateExam`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//发布考试
export const api_submitExam = (data) => {
  return request({
    url: `${service}/exam/submitExam`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//撤回考试
export const api_recallExam = (data) => {
  return request({
    url: `${service}/exam/recallExam`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//删除考试
export const api_deleteExam = (data) => {
  return request({
    url: `${service}/exam/deleteExam`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

/*****************考试*******************/

//获取考试成绩列表
export const api_getExamResultList = (data) => {
  return request({
    url: `${service}/examResult/getExamResultList`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}

//获取考试成绩信息(id)
export const api_getExamResultInfoById = (data) => {
  return request({
    url: `${service}/examResult/getExamResultInfoById`,
    method: 'POST',
    data,
  }, {
    ERROR_ACTION: 'message',
    TOKEN_REQUIRED:true,
  })
}