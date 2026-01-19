<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="实验类别">
				<el-select v-model="formInline.typeId" placeholder="请选择实验类别" filterable clearable @change="typeChange">
          <el-option 
            v-for="item in typeList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="实验">
				<el-select v-model="formInline.experimentId" placeholder="请选择实验" clearable filterable>
          <el-option 
            v-for="item in experimentList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="formInline.name" placeholder="请输入名称" clearable></el-input>
			</el-form-item>
      <el-form-item label="是否开启教学">
				<el-select v-model="formInline.isTeach" placeholder="请选择是否开启教学" clearable>
          <el-option 
            v-for="item in isOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="是否开启训练">
				<el-select v-model="formInline.isTrain" placeholder="请选择是否开启训练" clearable>
          <el-option 
            v-for="item in isOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="是否开启考核">
				<el-select v-model="formInline.isCheck" placeholder="请选择是否开启考核" clearable>
          <el-option 
            v-for="item in isOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="是否开启编辑器">
				<el-select v-model="formInline.isSet" placeholder="请选择开启编辑器" clearable>
          <el-option 
            v-for="item in isOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="状态">
				<el-select v-model="formInline.status" placeholder="请选择状态" clearable>
          <el-option 
            v-for="item in statusOptions" 
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
  api_getTypeList 
} from '@/api/common'
import {
  api_getExperimentList
} from '@/api/experiment-center'
import {
  statusOptions,
  isOptions,
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
      typeList:[],
      experimentList:[],
      isOptions,
      statusOptions,
    }
  },
  created(){
    this.getTypeList()
    if(this.formInline.typeId){
      this.getExperimentList()
    }
  },
  methods: {

    //获取类别列表
    getTypeList(){
      let params={
        pageNum:1,
        pageSize:999999,
        module:1,
        name:"",
        status:"",
        sortArray:[
          {
            field:"seq",
            sort:"ASC"
          }
        ]
      }
      api_getTypeList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.typeList=res.data.records
          }
        })
    },

    //获取实验列表
    getExperimentList(){
      let params={
        pageNum:1,
        pageSize:999999,
        typeId:this.formInline.typeId,
        name:"",
        org:"",
        author:"",
        isInner:"",
        status:"",
      }
      api_getExperimentList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.experimentList=res.data.records
          }
        })
    },

    //类型改变
    typeChange(){
      if(this.formInline.typeId){
        this.getExperimentList()
      }else{
        this.experimentList=[]
      }
      this.formInline.experimentId=""
    },

    //查询
    search(){
      this.$emit('search', this.formInline)
    },
    //清空
    reset () {
      this.formInline.typeId=""
      this.formInline.experimentId=""
      this.experimentList=[]
      this.formInline.name=""
      this.formInline.isTeach=""
      this.formInline.isTrain=""
      this.formInline.isCheck=""
      this.formInline.isSet=""
      this.formInline.status=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
