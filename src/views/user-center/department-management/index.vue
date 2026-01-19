<template>
  <div class="container">
    <p class="title">院系管理</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <el-button slot="add" type="primary" icon="el-icon-plus"  @click="operationOnClick({},'add')">新增</el-button>
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
        sortable="custom"
        min-width="100">
      </el-table-column>

      <el-table-column 
        label="操作"
        align="center"
        min-width="50">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="operationOnClick(scope.row,'edit')">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="operationOnClick(scope.row,'delete')">删除
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
import ImageUpload from '@/components/ImageUpload/index.vue'
import searchFilter from './components/filter.vue'
import operationDialog from './components/operation-dialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import {
  api_getDepartmentList,
  api_deleteDepartment
} from "@/api/user-center"
import {
  statusEnum,
} from "@/utils/share"
export default {
  components: { 
    searchFilter,
    ImageUpload,
    operationDialog,
    ConfirmDialog,
    OpRecordDialog,
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        name:"",
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        name:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      statusEnum,
      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      operationDialogVisible:false,  //操作弹窗显示，默认为false
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
      api_getDepartmentList(filter)
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
      this.operationDialogVisible=bool;
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
          tableName:'departments',
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
        api_deleteDepartment(this.operationForm)
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
