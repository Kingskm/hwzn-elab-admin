<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="1200px"
    title="实验成绩截图审核详情"
    :close-on-click-modal="true"
    :show-close="true">
    <el-form :model="form"  label-width="120px" >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实验类别">
            <span>{{dataInfo.typeName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实验">
            <span>{{dataInfo.experimentName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分项">
            <span>{{dataInfo.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实验成绩截图">
            <ImageUpload :mode="'watch'" v-model="dataInfo.content"></ImageUpload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="提交时间">
            {{dataInfo.submitTime}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提交人">
            {{dataInfo.submitUserName + " " + dataInfo.submitAccount}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="审核时间">
            {{dataInfo.checkTime}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核人">
            {{dataInfo.checkUserName + " " + dataInfo.checkAccount}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="得分" v-if="dataInfo.checkResult===1">
            <span :style="`color:${dataInfo.checkReason<60?'#FF0000':'#00cc00'}`">{{dataInfo.checkReason}}</span>
          </el-form-item>
          <el-form-item label="不通过理由" v-else>
            <span>{{dataInfo.checkReason}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核结果">
            <span :style="`color:${dataInfo.checkResult===0?'#FF0000':'#00cc00'}`">{{applicationResultEnum[dataInfo.checkResult]}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue'
import { 
  api_getApplicationInfoById,
} from "@/api/common"
import {
  api_getItemInfoById
} from "@/api/experiment-center"
import {
  applicationTypeEnum,
  applicationResultEnum,
} from "@/utils/share"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type:Object,
    },
  },
  components: {
    ImageUpload,
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      dataInfo:{},
      applicationTypeEnum,
      applicationResultEnum,
    }
  },
  created(){
    this.getData()
  },
  methods:{

    //获取数据
    getData(){
      api_getApplicationInfoById(this.form)
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
  },
}
</script>
