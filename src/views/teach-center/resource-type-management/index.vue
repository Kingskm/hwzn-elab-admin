<template>
  <div class="container">
    <p class="title">资源类别管理</p>
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
        sortable="custom"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="seq"
        label="排序"
        align="center"
        sortable="custom"
        width="100">
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        align="center"
        sortable="custom"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.status===0?'#FF0000':'#00cc00'}`">{{statusEnum[scope.row.status]}}</span>
        </template>
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
            :type="`${scope.row.status===0?'success':'danger'}`"
            :icon="`${scope.row.status===0?'el-icon-video-play':'el-icon-video-pause'}`"
            @click="operationOnClick(scope.row,'update-status')">
            {{scope.row.status===0?'启用':'停用'}}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="operationOnClick(scope.row,'delete')"
            v-show="scope.row.status===0">删除
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
import searchFilter from './components/filter.vue'
import operationDialog from './components/operation-dialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import { 
  api_getTypeList,
  api_updateTypeStatus,
  api_deleteType,
} from "@/api/common.js"
import {
  statusEnum,
} from "@/utils/share"
export default {
  components: { 
    searchFilter,
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
        module:4,
        name:"",
        status:"",
        sortArray:null
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        module:4,
        name:"",
        status:"",
        sortArray:null
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
      api_getTypeList(filter)
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
        this.operationForm={
          module:4,
          seq:1,
        }
        this.operationDialogVisible=true
      }else if(operation==='edit'){
        this.operationForm={
          id:row.id,
          module:row.module,
          name:row.name,
          seq:row.seq,
        }
        this.operationDialogVisible=true
      }else if(operation==='update-status'){
        this.updateStatus(row.id,row.status===1?0:1)
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
          tableName:'types',
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
    //改变状态
    updateStatus(id,status){
      let params={
        id,
        status,
      }
      api_updateTypeStatus(params)
        .then((res)=>{
          if(res && res.code===0){
            this.$message.success("更新成功")
            this.handleCurrentChange()
          }
        })
    },
    //确认
    confirm(){
      if(this.operation==='delete'){
        api_deleteType(this.operationForm)
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
