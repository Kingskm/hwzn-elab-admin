<template>
  <el-dialog
    :visible.sync="show"
    :before-close="close"
    width="700px"
    title="上传"
    :close-on-click-modal="false"
    :show-close="true">
    <uploader
      :options="options"
      :file-status-text="statusText"
      class="uploader-example"
      ref="uploader"
      @file-success="fileSuccess"
      @file-error="fileError"
      style="width: 100%;">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn single style="margin-right:20px">单文件上传</uploader-btn>
        <uploader-btn style="margin-right:20px">多文件上传</uploader-btn>
        <uploader-btn :directory="true">上传文件夹</uploader-btn>
      </uploader-drop>
      <uploader-list style="margin-top:20px;max-height:400px;overflow-y:scroll"></uploader-list>
    </uploader>
    <div class="btn-list" slot="footer">
      <el-button type="text" @click="clear">清除文件列表</el-button>
      <el-button type="primary" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
import {
  service
} from "@/api/common"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type:Object,
    },
    operation:{
			type:String,
		}
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      options: {
        target: service+'/upload/uploadByChunk', //后台上传文件地址
        testChunks: false, //不校验
        chunkSize: 100*1024*1024, //每片大小
        simultaneousUploads:1,
        headers:{
          token:Cookies.get('token') || null,
        },
        query:{
          path:this.operationForm.path,
        },
        panelShow: true,
      },
      statusText: {
        success: '上传成功',
        error: '上传失败',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader
    })
  },
  methods:{

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },

    //上传成功的回调事件
    fileSuccess(rootFile, file, path, chunk) {
      console.log("上传回调",path)
    },
    fileError(e) {
      console.log("e",e)
    },

    clear(){
      this.$refs.uploader.files=[]
      this.$refs.uploader.fileList=[]
    },

    //提交
    close(){
      this.handleClose()
      this.$emit('confirm');
    },
  },
}
</script>

<style scoped lang="scss">
.uploader-drop{
  padding: 0;
  border: none;
  background-color: #fff;

  .uploader-btn{
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    padding: 7px 15px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    height: 1;
  }
}
.btn-list{
  display: flex;
  justify-content: space-between;
}
</style>
