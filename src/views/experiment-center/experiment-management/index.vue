<template>
  <div class="container">
    <p class="title">实验管理</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <el-button slot="add" type="primary" icon="el-icon-plus" @click="operationOnClick({},'add')">新增</el-button>
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
        prop="cover"
        label="封面"
        align="center"
        width="120">
        <template slot-scope="scope">
          <ImageUpload :mode="'watch'" v-model="scope.row.cover" v-if="scope.row.cover"></ImageUpload>
          <span v-if="!scope.row.cover">-</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="typeName"
        label="实验类别"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        align="center"
        sortable="custom"
        min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
          <el-tag size="mini" effect="dark" v-if="scope.row.tag">{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="organization"
        label="单位"
        align="center"
        sortable="custom"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="author"
        label="作者"
        align="center"
        sortable="custom"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="chargerName"
        label="负责人"
        align="center"
        sortable="custom"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="readCount"
        label="浏览量"
        align="center"
        sortable="custom"
        width="100">
      </el-table-column>

      <el-table-column
        prop="isInner"
        label="是否校内实验"
        align="center"
        sortable="custom"
        width="130">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.isInner===0?'#FF0000':'#00cc00'}`">{{isEnum[scope.row.isInner]}}</span>
        </template>
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
        width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="operationOnClick(scope.row,'edit')">编辑
          </el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="operationOnClick(scope.row,'experiment-pre')"
            v-if="scope.row.isInner">前置条件
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
            type="warning"
            icon="el-icon-refresh"
            @click="operationOnClick(scope.row,'clear-record')"
            v-if="scope.row.isInner">清空学习考核记录
          </el-button>
          <el-button
            size="mini"
            type="info"
            icon="el-icon-tickets"
            @click="operationOnClick(scope.row,'show-opRecord')">操作记录
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-pie-chart"
            @click="operationOnClick(scope.row,'data-analysis')">实验数据分析
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
    <dataAnalysisDialog
      v-if="dataAnalysisDialogVisible" 
      :operationShow="dataAnalysisDialogVisible" 
			:operationForm="operationForm"
      @closeDialog="closeDialog"
    ></dataAnalysisDialog>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue'
import searchFilter from './components/filter.vue'
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import dataAnalysisDialog from './components/data-analysis-dialog.vue'
import { 
  api_getExperimentList,
  api_updateExperimentStatus,
  api_deleteExperiment,
  api_clearExperimentRecord,
} from "@/api/experiment-center"
import {
  statusEnum,
  isEnum,
} from "@/utils/share"
export default {
  components: { 
    searchFilter,
    ImageUpload,
    ConfirmDialog,
    OpRecordDialog,
    dataAnalysisDialog
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        typeId:"",
        name:"",
        organization:"",
        author:"",
        chargerAccount:"",
        tag:"",
        isInner:"",
        status:"",
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        typeId:"",
        name:"",
        organization:"",
        author:"",
        chargerAccount:"",
        tag:"",
        isInner:"",
        status:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      statusEnum,
      isEnum,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      opRecordDialogVisible:false, //操作记录弹窗显示，默认为false
      dataAnalysisDialogVisible:false
    }
  },
  created(){
    if(localStorage.getItem('filterRecord')){
      let filterRecord = JSON.parse(localStorage.getItem('filterRecord'))
      this.filter=filterRecord.page==='experiment-management'?filterRecord.filter:this.filter
      localStorage.removeItem('filterRecord')
    }
    this.search()
  },
  methods:{
    //获取数据
    getData(filter){
      this.loading=true
      api_getExperimentList(filter)
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
      this.confirmDialogVisible=bool
      this.opRecordDialogVisible=bool
      this.dataAnalysisDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='add'){
        this.$router.push({
          name:'experiment-op',
          query:{
            operation,
          }
        })
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'experiment-management'}))
      }else if(operation==='edit'){
        this.$router.push({
          name:'experiment-op',
          query:{
            operation,
            id:row.id
          }
        })
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'experiment-management'}))
      }else if(operation==='experiment-pre'){
        this.$router.push({
          name:'experiment-pre',
          query:{
            id:row.id
          }
        })
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'experiment-management'}))
      }else if(operation==='update-status'){
        this.updateStatus(row.id,row.status===1?0:1)
      }else if(operation==='delete'){
        this.operationForm={
          id:row.id,
          title:"您确认删除这条记录吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='clear-record'){
        this.operationForm={
          id:row.id,
          title:"您确认清空这条实验的所有学习考核记录吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='show-opRecord'){
        this.operationForm={
          pageNum:1,
          pageSize:10,
          tableName:'experiments',
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
      }else if(operation==='data-analysis'){
        this.operationForm={
          ...row
        }
        this.dataAnalysisDialogVisible=true
      }
    },
    //改变状态
    updateStatus(id,status){
      let params={
        id,
        status,
      }
      api_updateExperimentStatus(params)
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
        api_deleteExperiment(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.handleCurrentChange()
            }
          })
      }else if(this.operation==='clear-record'){
        api_clearExperimentRecord(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("清空成功")
              this.handleCurrentChange()
            }
          })
      }
    },

    //排序改变
    sortChange(obj){
      if(obj.prop && obj.prop==='chargerName'){
        obj.prop="chargerAccount"
      }
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
<style scoped>
.container /deep/ .el-tag{
  margin-left: 5px;
}
</style>
