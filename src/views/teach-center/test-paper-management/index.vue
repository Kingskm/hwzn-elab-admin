<template>
  <div class="container">
    <p class="title">试卷管理</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <el-button slot="add" type="primary" icon="el-icon-plus" @click="operationOnClick({},'add')" v-if="operation!=='select'">人工组卷</el-button>
      <el-button slot="add" type="primary" icon="el-icon-coordinate" @click="operationOnClick({},'ai-create')" v-if="operation!=='select'">AI组卷</el-button>
    </searchFilter>

    <el-table ref="table" class="table" max-height="618" :data="tableData" v-loading="loading" @sort-change="sortChange">
      <el-table-column
        label="序号"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{(filterSubmit.pageNum-1)*filterSubmit.pageSize+scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        align="center"
        sortable="custom"
        min-width="200">
      </el-table-column>

      <el-table-column
        prop="method"
        label="组卷方式"
        align="center"
        sortable="custom"
        width="100">
        <template slot-scope="scope">
          {{testPaperMethodEnum[scope.row.method]}}
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        sortable="custom"
        width="160">
      </el-table-column>

      <el-table-column
        prop="createrAccount"
        label="创建人"
        align="center"
        sortable="custom"
        min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.createrName">{{scope.row.createrName + " " + scope.row.createrAccount}}</span>
          <span v-else style="color:#F56C6C">用户不存在</span>
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
            @click="operationOnClick(scope.row,'edit')"
            v-if="operation!=='select'">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="operationOnClick(scope.row,'delete')"
            v-if="operation!=='select'">删除
          </el-button>
          <el-button
            size="mini"
            type="info"
            icon="el-icon-tickets"
            @click="operationOnClick(scope.row,'show-opRecord')"
            v-if="operation!=='select'">操作记录
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-finished"
            @click="operationOnClick(scope.row,'select')"
            v-if="operation==='select'">选取
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
    <AICreateTestPaperDialog
      v-if="aiCreateTestPaperDialogVisible" 
      :operationShow="aiCreateTestPaperDialogVisible" 
      :operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="handleCurrentChange"
    ></AICreateTestPaperDialog>
    <ConfirmDialog
      v-if="confirmDialogVisible"
      :operationShow="confirmDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="confirm"
    ></ConfirmDialog>
    <OpRecordDialog
      v-if="opRecordDialogVisible"
      :operationShow="opRecordDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
    ></OpRecordDialog>
  </div>
</template>

<script>
import AICreateTestPaperDialog from '@/dialogs/AICreateTestPaperDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import searchFilter from './components/filter.vue'
import { 
  api_getTestPaperList,
  api_deleteTestPaper,
} from "@/api/teach-center"
import {
  testPaperMethodEnum,
} from "@/utils/share"
export default {
  components: {
    AICreateTestPaperDialog,
    ConfirmDialog,
    OpRecordDialog,
    searchFilter
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        name:"",
        method:"",
        startTime:"",
        endTime:"",
        createrAccount:"",
        type:1,
        relId:null,
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        name:"",
        method:"",
        startTime:"",
        endTime:"",
        createrAccount:"",
        type:1,
        relId:null,
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      testPaperMethodEnum,

      operation:this.$route.query.operation || "",  //操作
      operationForm:{},  //操作表单，默认为空
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      aiCreateTestPaperDialogVisible:false,
      opRecordDialogVisible:false,  //操作日志弹窗显示，默认为false
    }
  },
  created(){
    if(localStorage.getItem('filterRecord')){
      let filterRecord = JSON.parse(localStorage.getItem('filterRecord'))
      this.filter=filterRecord.page==='test-paper-management'?filterRecord.filter:this.filter
      localStorage.removeItem('filterRecord')
    }
    this.search()
  },
  methods:{

    //获取数据
    getData(filter){
      this.loading=true
      api_getTestPaperList(filter)
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
    //关闭窗口
    closeDialog(bool){
      this.aiCreateTestPaperDialogVisible=bool
      this.confirmDialogVisible=bool
      this.opRecordDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='add'){
        this.$router.push({
          name:'test-paper-op',
          query:{
            operation,
          }
        })
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'test-paper-management'}))
      }else if(operation==='ai-create'){
        this.operationForm={
          type:1,
        }
        this.aiCreateTestPaperDialogVisible=true
      }else if(operation==='edit'){
        this.$router.push({
          name:'test-paper-op',
          query:{
            operation,
            id:row.id
          }
        })
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'test-paper-management'}))
      }else if(operation==='delete'){
        this.operationForm={
          id:row.id,
          title:"您确认删除这条记录吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='show-opRecord'){
        this.operationForm={
          pageNum:1,
          pageSize:10,
          tableName:'test_papers',
          dataId:row.id,
          type:1,
          content:'',
          createrAccount:'',
          startTime:"",
          endTime:"",
          sortArray:[
            {
              field:"create_time",
              sort:"DESC"
            }
          ]
        }
        this.opRecordDialogVisible=true
      }else if(operation==='select'){
        if(this.$store.state.user.examOpInfo || localStorage.getItem('examOpInfo')){
          let obj=this.$store.state.user.examOpInfo || JSON.parse(localStorage.getItem('examOpInfo')) || null
          if(obj){
            obj.testPaperId=row.id
          }
          this.$store.commit('user/setExamOpInfo',obj)
        }
      }
    },
    //确认
    confirm(){
      if(this.operation==='delete'){
        api_deleteTestPaper(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.handleCurrentChange()
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
