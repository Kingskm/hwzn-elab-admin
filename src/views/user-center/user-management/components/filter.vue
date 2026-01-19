<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="院系">
				<el-select v-model="formInline.departmentId" placeholder="请选择院系" filterable clearable @change="departmentChange">
          <el-option 
            v-for="item in departmentList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="班级">
				<el-select v-model="formInline.classId" placeholder="请选择班级" filterable clearable>
          <el-option 
            v-for="item in classList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="账户">
				<el-input v-model="formInline.account" placeholder="请输入账户" clearable></el-input>
			</el-form-item>
      <el-form-item label="名称">
				<el-input v-model="formInline.name" placeholder="请输入名称" clearable></el-input>
			</el-form-item>
      <el-form-item label="角色">
				<el-select v-model="formInline.role" placeholder="请选择角色" filterable clearable>
          <el-option 
            v-for="item in roleOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="状态">
				<el-select v-model="formInline.status" placeholder="请选择状态" filterable clearable>
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
  api_getDepartmentList,
  api_getClassList
} from '@/api/user-center'
import {
  statusOptions,
  roleOptions,
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
      departmentList:[],
      classList:[],
      roleOptions,
      statusOptions,
    }
  },
  created(){
    this.getDepartmentList()
  },
  methods: {

    //获取院系列表
    getDepartmentList(){
      api_getDepartmentList()
        .then((res)=>{
          if(res && res.code===0){
            this.departmentList=res.data.records
          }
        })
    },

    //获取班级列表
    getClassList(){
      let params={
        departmentId:this.formInline.departmentId,
      }
      api_getClassList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.classList=res.data.records
          }
        })
    },

    //院系改变
    departmentChange(){
      this.formInline.classId=""
      if(this.formInline.departmentId){
        this.getClassList()
      }else{
        this.classList=[]
      }
    },


    //查询
    search(){
      this.$emit('search', this.formInline)
    },
    //清空
    reset () {
      this.formInline.departmentId=""
      this.formInline.classId=""
      this.classList=[]
      this.formInline.account=""
			this.formInline.name=""
      this.formInline.role=""
      this.formInline.status=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
