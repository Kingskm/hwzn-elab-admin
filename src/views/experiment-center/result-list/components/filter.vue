<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="实验类别">
				<el-select v-model="formInline.typeId" placeholder="请选择实验类别" clearable filterable @change="experimentTypeChange">
          <el-option 
            v-for="item in experimentTypeList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="实验">
				<el-select v-model="formInline.experimentId" placeholder="请选择实验" clearable filterable @change="experimentChange">
          <el-option 
            v-for="item in experimentList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="分项">
				<el-select v-model="formInline.itemId" placeholder="请选择分项" clearable filterable>
          <el-option 
            v-for="item in itemList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="来源">
				<el-select v-model="formInline.source" placeholder="请选择来源" clearable>
          <el-option 
            v-for="item in experimentSourceOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="院系">
				<el-select v-model="formInline.departmentId" placeholder="请选择院系" clearable filterable @change="departmentChange">
          <el-option 
            v-for="item in departmentList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="班级">
				<el-select v-model="formInline.classId" placeholder="请选择班级" clearable filterable @change="classChange">
          <el-option 
            v-for="item in classList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="实验人员">
        <el-select
          v-model="formInline.account"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入实验人员账号"
          :remote-method="getUserList"
          :loading="loading"
          style="width:300px">
          <el-option
            v-for="item in userList"
            :key="item.account"
            :label="`${item.name +' '+item.account}`" 
            :value="item.account">
            <span style="float: left">{{ item.name+" "+item.account }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.role===2?item.departmentName:item.className }}</span>
          </el-option>
        </el-select>
			</el-form-item>
			<!-- <el-form-item label="账户" prop="account">
				<el-select v-model="formInline.account" placeholder="请选择账户" clearable filterable style="width:300px">
          <el-option 
            v-for="item in userList" 
            :key="item.account" 
            :label="`${item.name +' '+item.account}`" 
            :value="item.account">
            <span style="float: left">{{ item.name+" "+item.account}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.role===2?item.departmentName:item.className }}</span>
          </el-option>
        </el-select>
			</el-form-item> -->
      <el-form-item label="时间">
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
  api_getExperimentList,
  api_getItemList,
} from "@/api/experiment-center"
import {
  api_getDepartmentList,
  api_getClassList,
  api_getUserList
} from "@/api/user-center"
import {
  experimentSourceOptions,
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
      experimentTypeList:[],
      experimentList:[],
      itemList:[],
      departmentList:[],
      classList:[],
      userList:[],
      timeRange:[],
      loading:false,
      experimentSourceOptions,
    }
  },
  created(){
    this.filterTypeList()
    this.getDepartmentList()
    // this.getUserList()
  },
  methods: {

    //筛选类别列表
    filterTypeList(){
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
            this.experimentTypeList=res.data.records
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
        author:"",
        org:"",
        isInner:"",
        isCheck:"",
        status:"",
        startTime:"",
        endTime:"",
        sortArray:null,
      }
      api_getExperimentList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.experimentList=res.data.records
          }
        })
    },

    //获取分项列表
    getItemList(){
      let params={
        pageNum:1,
        pageSize:999999,
        typeId:this.formInline.typeId,
        experimentId:this.formInline.experimentId,
        name:"",
        isTeach:"",
        isTrain:"",
        isCheck:"",
        status:"",
        sortArray:null,
      }
      api_getItemList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.itemList=res.data.records
          }
        })
    },

    //实验类别改变
    experimentTypeChange(){
      if(this.formInline.typeId){
        this.getExperimentList()
      }else{
        this.experimentList=[]
      }
      this.formInline.experimentId=""
      this.formInline.itemId=""
      this.itemList=[]
    },

    //实验改变
    experimentChange(){
      if(this.formInline.experimentId){
        this.getItemList()
      }else{
        this.itemList=[]
      }
      this.formInline.itemId=""
    },

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

    //获取用户列表
    getUserList(query){
      if(query==null || query==""){
        return false;
      }
      this.loading = true;
      let params={
        departmentId:this.formInline.departmentId,
        classId:this.formInline.classId,
        account:query,
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
            this.userList=res.data.records
          }
        })
        .finally(()=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },5000)
    },

    // //获取用户列表
    // getUserList(){
    //   let params={
    //     pageNum:1,
    //     pageSize:99999,
    //     departmentId:this.formInline.departmentId,
    //     classId:this.formInline.classId,
    //     account:"",
    //     name:"",
    //     role:"",
    //     status:"",
    //     sortArray:[
    //       {
    //         field:"status",
    //         sort:"DESC"
    //       },
    //       {
    //         field:"role",
    //         sort:"ASC"
    //       }
    //     ],
    //   }
    //   api_getUserList(params)
    //     .then((res)=>{
    //       if(res && res.code===0){
    //         this.userList=res.data.records
    //       }
    //     })
    // },

    //院系改变
    departmentChange(){
      if(this.formInline.departmentId){
        this.getClassList()
      }else{
        this.classList=[]
      }
      this.formInline.classId=""
    },

    //班级改变
    classChange(){
      this.formInline.account=""
      this.getUserList()
    },

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
      this.formInline.typeId=""
      this.formInline.experimentId=""
      this.formInline.itemId=""
      this.formInline.departmentId=""
      this.formInline.classId=""
      this.formInline.account=""
      this.getUserList()
      this.formInline.source=""
      this.formInline.startTime=""
      this.formInline.endTime=""
      this.experimentList=[]
      this.itemList=[]
      this.classList=[]
      this.timeRange=[]
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
