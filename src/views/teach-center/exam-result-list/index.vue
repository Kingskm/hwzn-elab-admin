<template>
  <div class="container">
    <p class="title">考试成绩列表</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <!-- <el-button slot="add" type="primary" icon="el-icon-plus" @click="operationOnClick({},'add')">新增</el-button> -->
    </searchFilter>

    <el-table ref="table" class="table" max-height="680" :data="tableData" v-loading="loading" @sort-change="sortChange">
      <el-table-column
        label="序号"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{(filterSubmit.pageNum-1)*filterSubmit.pageSize+scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="createrDepartmentName"
        label="院系"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="createrClassName"
        label="班级"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="createrName"
        label="用户"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.createrName + " " + scope.row.createrAccount}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="score"
        label="得分"
        align="center"
        sortable="custom"
        min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.score || "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="开始时间"
        align="center"
        sortable="custom"
        width="160">
      </el-table-column>

      <el-table-column
        prop="finishTime"
        label="完成时间"
        align="center"
        sortable="custom"
        width="160">
        <template slot-scope="scope">
          <span>{{scope.row.finishTime || "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        align="center"
        sortable="custom"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.status===0?'#F56C6C':scope.row.status===3?'#E6A23C':scope.row.status===2?'#67C23A':'#909399'}`">{{examResultEnum[scope.row.status]}}</span>
        </template>
      </el-table-column>

      <el-table-column 
        label="操作"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="operationOnClick(scope.row,'show-detail')"
            v-if="scope.row.status===1">查看答卷
          </el-button>
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
import { 
  api_getExamResultList,
} from "@/api/teach-center"
import {
  examResultEnum,
} from "@/utils/share"
export default {
  components: {
    searchFilter,
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        examId:Number(this.$route.query.examId),
        paperId:"",
        createrAccount:"",
        statsu:"",
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        examId:Number(this.$route.query.examId),
        paperId:"",
        createrAccount:"",
        statsu:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      examResultEnum,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
    }
  },
  created(){
    this.getData(this.filterSubmit)
  },
  methods:{

    //获取数据
    getData(filter){
      this.loading=true
      api_getExamResultList(filter)
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
    //清空
    reset(){
      this.$refs.table.clearSort()
      this.filter.sortArray=null
      this.search()
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
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='show-detail'){
        this.$router.push({
          name:'exam-result-detail',
          query:{
            id:row.id
          }
        })
      }
    },

    //排序改变
    sortChange(obj){
      if(obj.order){
        this.filter.sortArray=[
          {
            field:obj.prop,
            sort:obj.order==='descending'?'DESC':'ASC',
          }
        ]
      }else{
        this.filter.sortArray=null
      }
      this.search()
    },
  }
}
</script>
