<template>
  <div class="container">
    <p class="title">账户日志</p>
    <searchFilter :filter="filter" @search="search"></searchFilter>

    <el-table class="table" max-height="670" :data="tableData" v-loading="loading">

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
        label="操作时间"
        align="center"
        width="160">
      </el-table-column>
      
      <el-table-column
        prop="content"
        label="内容"
        align="center"
        min-width="500"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
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
import { api_getUserLogList } from "@/api/log-center"
export default {
  components: { 
    searchFilter,
  },
  data(){
    return{
      userInfo:JSON.parse(localStorage.getItem("userInfo")),
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
        content:"",
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
        content:"",
        createrAccount:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
    }
  },
  created(){
    this.filter.createrAccount=this.userInfo.account
    this.search()
  },
  methods:{
    //获取数据
    getData(filter){
      this.loading=true
      api_getUserLogList(filter)
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
