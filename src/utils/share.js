/***************** 公用模块 ****************/
export const statusEnum = {
  1:"启用",
  0:"停用",
}

export const statusOptions = [
  { value:1, label:"启用" },
  { value:0, label:"停用" },
]

export const isEnum = {
  1:"是",
  0:"否",
}

export const isOptions = [
  { value:1, label:"是" },
  { value:0, label:"否" },
]

export const roleEnum = {
  1:"管理员",
  2:"教师",
  3:"学生",
}

export const roleOptions = [
  { value:1, label:"管理员" },
  { value:2, label:"教师" },
  { value:3, label:"学生" },
]

export const submitStatusEnum = {
  1:"已发布",
  0:"未发布",
}

export const submitStatusOptions = [
  { value:1, label:"已发布" },
  { value:0, label:"未发布" },
]

export const experimentSourceEnum = {
  1:"Web",
  2:"VR",
  3:"PC",
}

export const experimentSourceOptions = [
  { value:1, label:"Web" },
  { value:2, label:"VR" },
  { value:3, label:"PC" },
]

export const applicationTypeEnum = {
  1:"实验成绩截图",
}

export const applicationTypeOptions = [
  { value:1, label:"实验成绩截图" },
]

export const applicationResultEnum = {
  1:"通过",
  0:"驳回",
}

export const applicationResultOptions = [
  { value:1, label:"通过" },
  { value:0, label:"驳回" },
]

export const questionTypeEnum = {
  1:"判断题",
  2:"单选题",
  3:"多选题",
}

export const questionTypeOptions = [
  { value:1, label:"判断题" },
  { value:2, label:"单选题" },
  { value:3, label:"多选题" },
]

export const resourceTypeEnum = {
  1:"文档",
  2:"图片",
  3:"音频",
  4:"视频",
  5:"文本",
  6:"其他",
}

export const resourceTypeOptions = [
  { value:1, label:"文档" },
  { value:2, label:"图片" },
  { value:3, label:"音频" },
  { value:4, label:"视频" },
  { value:5, label:"文本" },
  { value:6, label:"其他" },
]

export const testPaperMethodEnum = {
  1:"人工",
  2:"AI",
}

export const testPaperMethodOptions = [
  { value:1, label:"人工" },
  { value:2, label:"AI" },
]

export const examMethodEnum = {
  1:"立即发布",
  2:"定时发布",
}

export const examMethodOptions = [
  { value:1, label:"立即发布" },
  { value:2, label:"定时发布" },
]

export const processEnum = {
  0:"未发布",
  1:"已结束",
  2:"未开始",
  3:"进行中"
}

export const processOptions = [
  { value:0, label:"未发布" },
  { value:1, label:"已结束" },
  { value:2, label:"未开始" },
  { value:3, label:"进行中" },
]

export const examResultEnum = {
  0:"未开始",
  1:"已完成",
  2:"进行中",
  3:"已过期",
}

export const examResultOptions = [
  { value:0, label:"未开始" },
  { value:1, label:"已完成" },
  { value:2, label:"进行中" },
  { value:3, label:"已过期" },
]