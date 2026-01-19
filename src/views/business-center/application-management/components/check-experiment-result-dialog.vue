<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="700px"
    title="实验成绩截图审核"
    :close-on-click-modal="false"
    :show-close="true">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
      <el-form-item label="实验分类" prop="typeName">
        <span>{{dataInfo.typeName}}</span>
      </el-form-item>
      <el-form-item label="实验" prop="experimentName">
        <span>{{dataInfo.experimentName}}</span>
      </el-form-item>
      <el-form-item label="分项" prop="itemName">
        <span>{{dataInfo.name}}</span>
      </el-form-item>
      <el-form-item label="成绩截图" prop="content">
        <ImageUpload :mode="'watch'" v-model="dataInfo.content"></ImageUpload>
      </el-form-item>
      <el-form-item label="审核结果" prop="checkResult">
        <el-radio-group v-model="form.checkResult">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="得分" prop="score" v-if="form.checkResult===1">
        <el-input-number v-model="form.score" :step="1" :precision="1" :min="0" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="驳回理由" prop="errorReason" v-if="form.checkResult===0">
        <el-input 
          v-model.trim="form.errorReason" 
          placeholder="请输入驳回理由（200字以内）" 
          maxlength="200"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue'
import {
  api_getApplicationInfoById,
  api_checkApplication,
} from "@/api/common"
import {
  api_getItemInfoById
} from "@/api/experiment-center"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type: Object,
    },
  },
  components:{
    ImageUpload,
  },
  data() {
    return {
      show:this.operationShow,
      dataInfo:this.operationForm,
      form:{
        checkResult:1,
        score:0,
      },
      rules:{
        checkResult:[
          { required: true, message: '审核结果不能为空', trigger: 'change' },
        ],
        score:[
          { required: true, message: '得分不能为空', trigger: 'change' },
        ],
        errorReason:[
          { required: true, message: '驳回理由不能为空', trigger: 'change' },
        ],
      },
    }
  },
  created(){
    this.getData()
  },
  methods:{

    //获取数据
    getData(){
      api_getApplicationInfoById(this.dataInfo)
        .then((res)=>{
          if(res && res.code===0){
            this.dataInfo=res.data
            this.getItemInfo()
          }
        })
    },

    //获取分项信息
    getItemInfo(){
      let params={
        id:this.dataInfo.recordId,
      }
      api_getItemInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.dataInfo={
              ...res.data,
              ...this.dataInfo,
            }
          }
        })
    },

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },

    //提交
    submit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.id=this.dataInfo.id
            if(this.form.checkResult===0){
              this.form.checkReason=this.form.errorReason
            }else{
              this.form.checkReason=this.form.score
            }
            api_checkApplication(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('审核成功')
                  this.handleClose()
                  this.$emit('confirm')
                }
              })
          } else {
            return false;
          }
        });
    },
  },
}
</script>

<style scoped>
.uploader-example {
  width: 100%;
  padding: 15px;
  margin: 50px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
 
.uploader-example .uploader-btn {
  margin-right: 4px;
}
 
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
