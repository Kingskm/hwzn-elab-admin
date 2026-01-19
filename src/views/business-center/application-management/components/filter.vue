<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="申请类型">
				<el-select v-model="formInline.type" placeholder="请选择申请类型" clearable>
          <el-option 
            v-for="item in applicationTypeOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="submitTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="submitTimeRangeChange">
        </el-date-picker>
      </el-form-item>
			<el-form-item label="提交账户">
				<el-input v-model="formInline.submitAccount" placeholder="请输入提交账户" clearable></el-input>
			</el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="checkTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="checkTimeRangeChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核账户">
				<el-input v-model="formInline.checkAccount" placeholder="请输入审核账户" clearable></el-input>
			</el-form-item>
      <el-form-item label="审核结果">
				<el-select v-model="formInline.checkResult" placeholder="请选择审核结果" clearable>
          <el-option 
            v-for="item in applicationResultOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="search">查询</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="reset">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  applicationTypeOptions,
  applicationResultOptions,
} from "@/utils/share"
export default {
  props: {
    filter: {
      type: Object
    },
  },
  data() {
    return {
      formInline:this.filter,
      applicationTypeOptions,
      applicationResultOptions,
      submitTimeRange:[],
      checkTimeRange:[],
    }
  },
  methods: {

    //查询
    search(){
      this.$emit('search', this.formInline)
    },

    submitTimeRangeChange(){
      if(this.submitTimeRange){
        this.formInline.submitStartTime=this.submitTimeRange[0]
        this.formInline.submitEndTime=this.submitTimeRange[1]
      }else{
        this.formInline.submitStartTime=""
        this.formInline.submitEndTime=""
      }
    },

    checkTimeRangeChange(){
      if(this.checkTimeRange){
        this.formInline.checkStartTime=this.checkTimeRange[0]
        this.formInline.checkEndTime=this.checkTimeRange[1]
      }else{
        this.formInline.checkStartTime=""
        this.formInline.checkEndTime=""
      }
    },

    //清空
    reset () {
      this.formInline.type=""
      this.formInline.recordId=""
      this.formInline.submitStartTime=""
      this.formInline.submitEndTime=""
      this.formInline.submitAccount=""
      this.formInline.checkStartTime=""
      this.formInline.checkEndTime=""
      this.formInline.checkAccount=""
      this.formInline.checkResult=""
      this.submitTimeRange=[]
      this.checkTimeRange=[]
      this.$emit('search', this.formInline)
    },
  }
}
</script>
