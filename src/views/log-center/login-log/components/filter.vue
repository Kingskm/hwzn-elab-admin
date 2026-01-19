<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="timeRangeChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="账户">
				<el-input v-model="formInline.createrAccount" placeholder="请输入账户（精确查询）" clearable></el-input>
			</el-form-item>
      <el-form-item label="设备">
				<el-input v-model="formInline.device" placeholder="请输入设备" clearable></el-input>
			</el-form-item>
      <el-form-item label="IP">
				<el-input v-model="formInline.ip" placeholder="请输入IP" clearable></el-input>
			</el-form-item>
      <el-form-item label="操作系统">
				<el-input v-model="formInline.os" placeholder="请输入操作系统" clearable></el-input>
			</el-form-item>
      <el-form-item label="浏览器">
				<el-input v-model="formInline.browser" placeholder="请输入浏览器" clearable></el-input>
			</el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="search">查询</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="reset">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    filter: {
      type: Object
    },
  },
  data() {
    return {
      formInline:this.filter,
      timeRange:[],
    }
  },
  methods: {

    //时间范围改变
    timeRangeChange(){
      if(this.timeRange){
        this.formInline.startTime=this.timeRange[0]
        this.formInline.endTime=this.timeRange[1]
      }else{
        this.formInline.startTime=""
        this.formInline.endTime=""
      }
    },

    //查询
    search(){
      this.$emit('search', this.formInline)
    },
    //清空
    reset () {
      this.formInline.startTime=""
      this.formInline.endTime=""
      this.timeRange=[]
      this.formInline.createrAccount=""
      this.formInline.device=""
      this.formInline.ip=""
      this.formInline.os=""
      this.formInline.browser=""
      this.$emit('search', this.formInline)
    },
  }
}
</script>
