<template>
  <div class="container">
    <p class="title">登录日志</p>
    <searchFilter :filter="filter" @search="search"></searchFilter>

    <el-table class="table" max-height="630" :data="tableData" v-loading="loading">
      <el-table-column
        label="序号"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{(filterSubmit.pageNum-1)*filterSubmit.pageSize+scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="登录时间"
        align="center"
        width="160">
      </el-table-column>

      <el-table-column
        prop="createrAccount"
        label="账户"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.createrName">{{scope.row.createrName + " " + scope.row.createrAccount}}</span>
          <span v-else style="color:#F56C6C">用户不存在</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="device"
        label="设备"
        align="center"
        width="100">
      </el-table-column>

      <el-table-column
        prop="ip"
        label="IP"
        align="center"
        width="150">
      </el-table-column>

      <el-table-column
        prop="os"
        label="操作系统"
        align="center"
        width="400">
        <template slot-scope="scope">
          <span>{{scope.row.os+"("+scope.row.osVersion+")"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="browser"
        label="浏览器"
        align="center"
        width="200">
        <template slot-scope="scope">
          <span>{{scope.row.browser+"("+scope.row.browserVersion+")"}}</span>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="filterSubmit.pageNum"
      :page-size="filterSubmit.pageSize"
      background
      layout="prev, pager, next,jumper,total,sizes"
      :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
import searchFilter from './components/filter.vue'
import { api_getLoginLogList } from "@/api/log-center"
export default {
  components: { 
    searchFilter,
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:100,
        sortArray:[
          {
            field:"create_time",
            sort:"DESC"
          }
        ],
        startTime:"",
        endTime:"",
        ip:"",
        device:"",
        os:"",
        browser:"",
        createrAccount:"",
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:100,
        sortArray:[
          {
            field:"create_time",
            sort:"DESC"
          }
        ],
        startTime:"",
        endTime:"",
        ip:"",
        device:"",
        os:"",
        browser:"",
        createrAccount:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
    }
  },
  created(){
    this.getData(this.filterSubmit)
  },
  methods:{
    //获取数据
    getData(filter){
      this.loading=true
      api_getLoginLogList(filter)
        .then((res)=>{
          if(res && res.code===0){
            this.tableData=res.data.records
            this.totalCount=res.data.total
          }
        })
        .finally(()=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },5000)
    },
    //搜索
    search(){
      //深浅拷贝，赋值不影响原来对象
      this.filterSubmit=JSON.parse(JSON.stringify(this.filter))
      this.getData(this.filterSubmit)
    },
    //换页
    handleCurrentChange(){
      this.getData(this.filterSubmit)
    },
    //换页码
    handleSizeChange(val){
      this.filterSubmit.pageSize=val
      this.getData(this.filterSubmit)
    },
  }
}
</script>