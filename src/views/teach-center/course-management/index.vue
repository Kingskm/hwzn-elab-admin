<template>
  <div class="container">
    <p class="title">课程管理</p>
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
        label="课程类别"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        align="center"
        sortable="custom"
        min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
          <span v-if="scope.row.tag">
            <el-tag v-for="(item,index) in scope.row.tag.split(',')" :key="index" size="mini" effect="dark">{{item}}</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="chargerAccount"
        label="负责人"
        align="center"
        sortable="custom"
        min-width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.chargerName">{{scope.row.chargerName + " " + scope.row.chargerAccount}}</span>
          <span v-else style="color:#F56C6C">用户不存在</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="readCount"
        label="浏览量"
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
        min-width="100">
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
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import { 
  api_getCourseList,
  api_updateCourseStatus,
  api_deleteCourse,
} from "@/api/teach-center"
import {
  statusEnum,
} from "@/utils/share"
export default {
  components: { 
    searchFilter,
    ImageUpload,
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
        typeId:"",
        name:"",
        tag:"",
        chargerAccount:"",
        status:"",
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        typeId:"",
        name:"",
        tag:"",
        chargerAccount:"",
        status:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      statusEnum,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      opRecordDialogVisible:false, //操作记录弹窗显示，默认为false
      teacherListDialogVisible:false,  //教师列表弹窗显示，默认为false
      experimentListDialogVisible:false,  //实验列表弹窗显示，默认为false
    }
  },
  created(){
    if(localStorage.getItem('filterRecord')){
      let filterRecord = JSON.parse(localStorage.getItem('filterRecord'))
      this.filter=filterRecord.page==='course-management'?filterRecord.filter:this.filter
      localStorage.removeItem('filterRecord')
    }
    this.search()
  },
  methods:{

    //获取数据
    getData(filter){
      this.loading=true
      api_getCourseList(filter)
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
      this.teacherListDialogVisible=bool
      this.experimentListDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='add'){
        this.$router.push({
          name:'course-op',
          query:{
            operation,
          }
        })
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'course-management'}))
      }else if(operation==='edit'){
        this.$router.push({
          name:'course-op',
          query:{
            operation,
            id:row.id
          }
        })
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'course-management'}))
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
          tableName:'courses',
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
      api_updateCourseStatus(params)
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
        let params={
          id:this.operationForm.id
        }
        api_deleteCourse(params)
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
<style scoped>
.container /deep/ .el-tag{
  margin-left: 5px;
}
</style>

