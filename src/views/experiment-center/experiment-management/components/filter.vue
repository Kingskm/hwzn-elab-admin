<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="实验类别">
				<el-select v-model="formInline.typeId" placeholder="请选择实验类别" clearable filterable>
          <el-option 
            v-for="item in typeList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="formInline.name" placeholder="请输入名称" clearable></el-input>
			</el-form-item>
      <el-form-item label="标签">
				<el-input v-model="formInline.tag" placeholder="请输入标签" clearable></el-input>
			</el-form-item>
      <el-form-item label="单位">
				<el-input v-model="formInline.organization" placeholder="请输入单位" clearable></el-input>
			</el-form-item>
      <el-form-item label="作者">
				<el-input v-model="formInline.author" placeholder="请输入作者" clearable></el-input>
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
      <el-form-item label="是否校内实验">
				<el-select v-model="formInline.isInner" placeholder="请选择是否校内实验" filterable clearable>
          <el-option 
            v-for="item in isOptions" 
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
  api_getTypeList 
} from '@/api/common'
import { 
  api_getUserList
} from '@/api/user-center'
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
      teacherList:[],
      loading:false,
      isOptions,
      statusOptions,
    }
  },
  created(){
    this.getTypeList()
  },
  methods: {

    //获取类别列表
    getTypeList(){
      let params={
        pageNum:1,
        pageSize:9999,
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
      this.formInline.typeId=""
      this.formInline.name=""
      this.formInline.tag=""
      this.formInline.author=""
      this.formInline.organization=""
      this.formInline.chargerAccount=""
      this.teacherList=[]
      this.formInline.isInner=""
      this.formInline.status=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
