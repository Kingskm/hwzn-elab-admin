<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
			<el-form-item label="标题">
				<el-input v-model="formInline.name" placeholder="请输入标题" clearable></el-input>
			</el-form-item>
      <el-form-item label="作者">
				<el-input v-model="formInline.author" placeholder="请输入作者" clearable></el-input>
			</el-form-item>
      <el-form-item label="描述">
				<el-input v-model="formInline.des" placeholder="请输入描述" clearable></el-input>
			</el-form-item>
      <el-form-item label="发布时间">
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
      <el-form-item label="状态">
				<el-select v-model="formInline.status" placeholder="请选择状态" filterable clearable>
          <el-option 
            v-for="item in submitStatusOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="search">查询</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="reset">清空</el-button>
        <slot name="add"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  submitStatusOptions,
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
      timeRange:[],
      submitStatusOptions,
    }
  },
  methods: {

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
      this.formInline.name=""
      this.formInline.author=""
      this.formInline.des=""
      this.formInline.startTime=""
      this.formInline.endTime=""
      this.timeRange=[]
      this.formInline.status=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
