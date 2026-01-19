<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :top="`${topHeight}vh`"
    width="1000px"
    title="实验数据分析"
    :close-on-click-modal="true"
    :show-close="true">
    <el-form :model="form"  label-width="auto" >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实验分类">
            {{operationForm.typeName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实验">
            {{operationForm.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="浏览量">
            {{operationForm.readCount}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="分项个数">
            {{dataInfo.itemCount}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实验次数">
            {{dataInfo.itemResultCount}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实验合格率">
            {{dataInfo.experimentPassRate || "-"}}
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
  api_getExperimentData,
} from "@/api/common"
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
      videoIndex:0,
      stepIndex:0,
      filePath:"",
      topHeight:20
    }
  },
  created(){
    this.getData()
  },
  methods:{

    //获取数据
    getData(){
      api_getExperimentData(this.form)
        .then((res)=>{
          if(res && res.code===0){
            this.dataInfo=res.data
            if(this.dataInfo.steps && this.dataInfo.steps.indexOf('title')>0){
              this.topHeight-=5
            }
            if(this.dataInfo.imgs || this.dataInfo.videos){
              this.topHeight-=14
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

<style scoped>
.el-form-item{
  margin-bottom: 0;
}
</style>
