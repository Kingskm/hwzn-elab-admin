<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="url"
      :headers="headers"
      :limit="1"
      :file-list="fileList"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :accept="`${accept}`"
      drag>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">{{tip}}</div>
    </el-upload>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {
  service,
} from "@/api/common"
const toFileItem = path => ({
  name: '上传文件',
  path
})
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: { // 地址
      required: true,
      default: ''
    },
    // 单文件大小上限（MB）
    maxFileSize: {
      default: null,
      type: Number
    },
    //接受上传的文件类型
    accept:{
      default:null,
      type:String
    },
    //上传提示文本
    tip:{
      default:null,
      type:String,
    }
  },
  computed: {
    fileList: {
      get: function () { // 不能使用箭头函数
        if (!this.value) {
          return []
        }else if (typeof this.value === 'string') {
          return [toFileItem(this.value)]
        }
        return []
      },
      set: function (val) {
        let filePath
        if (this.max === 1) {
          filePath = (val[0] && val[0].path) || ''
        } else if (this.max > 1) {
          filePath = val.map(v => ({ path: v.path }))
        }
        this.$emit('change', filePath)
      }
    },
  },
  data(){
    return{
      url:service+"/upload/uploadByFile",
      headers:{
        token:Cookies.get("token"),
      },
    }
  },
  methods:{

    //上传文件前处理
    handleBeforeUpload(file){
      if(this.accept){
        if(this.accept.indexOf("/*")>0){
          let typeLimit = this.accept.substring(0,this.accept.lastIndexOf('/'))
          let type = file.type.substring(0,file.type.lastIndexOf('/'))
          if(typeLimit!==type){
            this.$message.warning(`上传文件格式有误！`)
            return false
          }
        }else{
          if(this.accept!==file.type && !this.accept.includes(file.type)){
            this.$message.warning(`上传文件格式有误！`)
            return false
          }
        }
      }
      if(this.maxFileSize && file.size / (1024*1024) > this.maxFileSize){
        this.$message.warning(`上传文档大小不能超过 ${this.maxFileSize}MB!`)
        return false
      }
    },

    handlePreview(file){
      window.open(file.path,"_blank")
    },

    handleRemove(file, fileList){
      this.fileList=[]
      this.$emit('change',"")
    },

    handleSuccess(res, file, fileList){
      if(res && res.code===0){
        this.$message.success("上传成功");
        this.$emit('change',res.data.path)
        this.$forceUpdate();
      }
    },

    handleError(err, file, fileList){
      this.$message.error("上传失败");
    },

    handleExceed(files, fileList) {
      this.$message.warning("最多支持上传1个文件");
    },

  }
}
</script>