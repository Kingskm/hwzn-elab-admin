<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="用户">
        <el-select
          v-model="formInline.createrAccount"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入用户名称"
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
      <el-form-item label="状态">
				<el-select v-model="formInline.status" placeholder="请选择状态" clearable>
          <el-option 
            v-for="item in examResultOptions" 
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
  examResultOptions,
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
      examResultOptions,
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
        name:query,
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

    //查询
    search(){
      this.$emit('search', this.formInline)
    },
    //清空
    reset () {
      this.formInline.createrAccount=""
      this.formInline.status=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
