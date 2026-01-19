<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
			<el-form-item label="名称">
				<el-input v-model="formInline.name" placeholder="请输入名称" clearable></el-input>
			</el-form-item>
      <el-form-item label="举办单位">
				<el-input v-model="formInline.organization" placeholder="请输入举办单位" clearable></el-input>
			</el-form-item>
      <el-form-item label="负责人">
        <el-select
          v-model="formInline.chargerAccount"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入负责人名称"
          :remote-method="getTeacherList"
          :loading="loading"
          style="width:300px">
          <el-option
            v-for="item in teacherList"
            :key="item.account"
            :label="`${item.name +' '+item.account}`" 
            :value="item.account">
            <span style="float: left">{{ item.name+" "+item.account }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.departmentName }}</span>
          </el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="状态">
				<el-select v-model="formInline.status" placeholder="请选择状态" filterable clearable>
          <el-option 
            v-for="item in processOptions" 
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
  api_getUserList 
} from '@/api/user-center'
import {
  processOptions,
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
      processOptions,
      loading:false,
      teacherList:[],
    }
  },
  methods: {

    //获取教师列表
    getTeacherList(query){
      if(query==null || query==""){
        return false;
      }
      this.loading = true;
      let params={
        pageNum:1,
        pageSize:9999,
        departmentId:"",
        classId:"",
        account:"",
        name:query,
        role:2,
        status:"",
        sortArray:[
          {
            field:"name",
            sort:"ASC"
          }
        ]
      }
      api_getUserList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.teacherList=res.data.records
          }
        })
        .finally(()=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },5000)
    },

    //查询
    search(){
      this.$emit('search', this.formInline)
    },
    //清空
    reset () {
      this.formInline.name=""
      this.formInline.organization=""
      this.formInline.chargerAccount=""
      this.formInline.status=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
