<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="名称">
				<el-input v-model="formInline.name" placeholder="请输入名称" clearable></el-input>
			</el-form-item>
      <el-form-item label="组卷方式">
				<el-select v-model="formInline.method" placeholder="请选择组卷方式" filterable clearable>
          <el-option 
            v-for="item in testPaperMethodOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="创建时间">
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
      <el-form-item label="创建人">
        <el-select
          v-model="formInline.createrAccount"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入创建人名称"
          :remote-method="getUserList"
          :loading="loading"
          style="width:300px">
          <el-option
            v-for="item in userList"
            :key="item.account"
            :label="`${item.name +' '+item.account}`" 
            :value="item.account">
            <span style="float: left">{{ item.name+" "+item.account }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.departmentName }}</span>
          </el-option>
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
   api_getUserList
} from '@/api/user-center'
import {
  testPaperMethodOptions,
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
      userList:[],
      loading:false,
      timeRange:[],
      testPaperMethodOptions,
    }
  },
  methods: {

    //获取用户列表
    getUserList(query){
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
        role:"",
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
            this.userList=[]
            res.data.records.forEach((item)=>{
              if(item.role!==3){
                this.userList.push(item)
              }
            })
          }
        })
        .finally(()=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },5000)
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
      this.formInline.name=""
      this.formInline.method=""
      this.formInline.startTime=""
      this.formInline.endTime=""
      this.timeRange=[]
      this.formInline.createrAccount=""
      this.userList=[]
      this.formInline.status=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
