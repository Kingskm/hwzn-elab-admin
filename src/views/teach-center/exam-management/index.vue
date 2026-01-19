<template>
  <div class="container">
    <p class="title">考试管理</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <el-button slot="add" type="primary" icon="el-icon-plus" @click="operationOnClick({},'add')">新增</el-button>
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
        prop="name"
        label="名称"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="code"
        label="验证码"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.code || "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="method"
        label="发布方式"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{examMethodEnum[scope.row.method] || "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="startTime"
        label="开始时间"
        align="center"
        width="160">
        <template slot-scope="scope">
          <span>{{scope.row.startTime || "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="endTime"
        label="结束时间"
        align="center"
        width="160">
        <template slot-scope="scope">
          <span>{{scope.row.endTime || "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="160">
      </el-table-column>

      <el-table-column
        prop="createrAccount"
        label="创建人"
        align="center"
        min-width="50">
        <template slot-scope="scope">
          {{scope.row.createrAccount+" "+ (scope.row.createrName || "用户已删除")}}
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.status===0?'#F56C6C':scope.row.status===3?'#E6A23C':scope.row.status===2?'#67C23A':'#909399'}`">{{processEnum[scope.row.status]}}</span>
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
            v-if="scope.row.status===0">编辑
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-setting"
            @click="operationOnClick(scope.row,'config')"
            v-if="scope.row.status===0">配置
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-position"
            @click="operationOnClick(scope.row,'submit')"
            v-if="scope.row.status===0">发布
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-refresh-left"
            @click="operationOnClick(scope.row,'recall')"
            v-if="scope.row.status===2">撤回
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="operationOnClick(scope.row,'delete')"
            v-if="scope.row.status===0">删除
          </el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-s-data"
            @click="operationOnClick(scope.row,'exam-result-list')"
            v-if="scope.row.status===1 || scope.row.status===3">成绩单
          </el-button>
          <el-button
            size="mini"
            type="info"
            icon="el-icon-tickets"
            @click="operationOnClick(scope.row,'show-opRecord')">操作记录
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
    <operationDialog
      v-if="operationDialogVisible" 
      :operationShow="operationDialogVisible" 
			:operationForm="operationForm"
      :operation="operation"
      @closeDialog="closeDialog"
      @confirm="handleCurrentChange"
    ></operationDialog>
    <submitDialog
      v-if="submitDialogVisible" 
      :operationShow="submitDialogVisible" 
			:operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="handleCurrentChange"
    ></submitDialog>
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
import searchFilter from './components/filter.vue'
import operationDialog from './components/operation-dialog.vue'
import submitDialog from './components/submit-dialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import { 
  api_getExamList,
  api_recallExam,
  api_deleteExam,
} from "@/api/teach-center"
import {
  examMethodEnum,
  processEnum,
} from "@/utils/share"
export default {
  components: {
    searchFilter,
    operationDialog,
    submitDialog,
    ConfirmDialog,
    OpRecordDialog
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
        createrAccount:"",
        statsu:"",
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        name:"",
        method:"",
        createrAccount:"",
        statsu:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      examMethodEnum,
      processEnum,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      operationDialogVisible:false,  //操作弹窗显示，默认为false
      submitDialogVisible:false,
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      opRecordDialogVisible:false,  //操作日志弹窗显示，默认为false
    }
  },
  created(){
    this.getData(this.filterSubmit)
  },
  methods:{

    //获取数据
    getData(filter){
      this.loading=true
      api_getExamList(filter)
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
      this.operationDialogVisible=bool
      this.submitDialogVisible=bool
      this.confirmDialogVisible=bool
      this.opRecordDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='add'){
        this.operationForm={}
        this.operationDialogVisible=true
      }else if(operation==='edit'){
        this.operationForm={
          id:row.id,
          name:row.name,
        }
        this.operationDialogVisible=true
      }else if(operation==='config'){
        this.$router.push({
          name:'exam-config',
          query:{
            id:row.id
          }
        })
      }else if(operation==='submit'){
        this.operationForm={
          id:row.id,
          duration:10,
        }
        this.submitDialogVisible=true
      }else if(operation==='recall'){
        this.operationForm={
          id:row.id,
          title:"您确认撤回这场考试吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='delete'){
        this.operationForm={
          id:row.id,
          title:"您确认删除这条记录吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='exam-result-list'){
        this.$router.push({
          name:'exam-result-list',
          query:{
            examId:row.id
          }
        })
      }else if(operation==='show-opRecord'){
        this.operationForm={
          pageNum:1,
          pageSize:10,
          tableName:'exams',
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
      }
    },
    //确认
    confirm(){
      if(this.operation==='delete'){
        api_deleteExam(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.handleCurrentChange()
            }
          })
      }else if(this.operation==='recall'){
        api_recallExam(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("撤回成功")
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
