<template>
  <div class="container">
    <p class="title">竞赛管理</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <el-button slot="add" type="primary" icon="el-icon-plus"  @click="operationOnClick({},'add')">新增</el-button>
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
        width="140">
        <template slot-scope="scope">
          <ImageUpload :mode="'watch'" v-model="scope.row.cover" v-if="scope.row.cover"></ImageUpload>
          <span v-if="!scope.row.cover">-</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        align="center"
        sortable="custom"
        min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
          <el-tag size="mini" effect="dark" v-if="scope.row.tag">{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="organization"
        label="举办单位"
        align="center"
        sortable="custom"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="chargerAccount"
        label="负责人"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.chargerName+' '+scope.row.chargerAccount}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="startTime"
        label="竞赛时间"
        align="center"
        width="310">
        <template slot-scope="scope">
          <span>{{scope.row.startTime + ' 至 ' + scope.row.endTime}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        align="center"
        sortable="custom"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.status===1?'#909399':scope.row.status===2?'#67C23A':'#E6A23C'}`">{{processEnum[scope.row.status]}}</span>
        </template>
      </el-table-column>

      <el-table-column 
        label="操作"
        align="center"
        min-width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            v-if="scope.row.status===2"
            @click="operationOnClick(scope.row,'edit')">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            v-if="scope.row.status===2"
            @click="operationOnClick(scope.row,'delete')">删除
          </el-button>
          <!-- <el-button
            size="mini"
            type="primary"
            icon="el-icon-info"
            v-if="scope.row.status!==2"
            @click="operationOnClick(scope.row,'show-detail')">详情
          </el-button> -->
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-user"
            @click="operationOnClick(scope.row,'competition-student')">参赛学员
          </el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-s-data"
            v-if="scope.row.status!==2"
            @click="operationOnClick(scope.row,'competition-result')">查看成绩
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-medal-1"
            v-if="scope.row.status!==2"
            @click="operationOnClick(scope.row,'competition-rank')">查看排名
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
    <studentListDialog
      v-if="studentListDialogVisible"
      :operationShow="studentListDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
    ></studentListDialog>
    <resultListDialog
      v-if="resultListDialogVisible"
      :operationShow="resultListDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
    ></resultListDialog>
    <rankListDialog
      v-if="rankListDialogVisible"
      :operationShow="rankListDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
    ></rankListDialog>
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
import ConfirmDialog from '@/components/ConfirmDialog'
import searchFilter from './components/filter.vue'
import studentListDialog from './components/student-list.vue'
import resultListDialog from './components/result-list.vue'
import rankListDialog from './components/rank-list.vue'
import OpRecordDialog from '@/components/OpRecordDialog'
import { 
  api_getCompetitionList,
  api_deleteCompetition,
} from "@/api/competition-center"
import {
  processEnum,
} from "@/utils/share"
export default {
  components: { 
    ImageUpload,
    ConfirmDialog,
    searchFilter,
    studentListDialog,
    resultListDialog,
    rankListDialog,
    OpRecordDialog,
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:10,
        name:"",
        organization:"",
        chargerAccount:"",
        status:"",
        sortArray:null
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        name:"",
        organization:"",
        chargerAccount:"",
        status:"",
        sortArray:null
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      processEnum,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      studentListDialogVisible:false,  //参赛学员列表弹窗显示，默认为false
      resultListDialogVisible:false,
      rankListDialogVisible:false,
      opRecordDialogVisible:false, //操作记录弹窗显示，默认为false
    }
  },
  created(){
    if(localStorage.getItem('filterRecord')){
      let filterRecord = JSON.parse(localStorage.getItem('filterRecord'))
      this.filter=filterRecord.page==='competition-management'?filterRecord.filter:this.filter
      localStorage.removeItem('filterRecord')
    }
    this.search()
  },
  methods:{
    //获取数据
    getData(filter){
      this.loading=true
      api_getCompetitionList(filter)
        .then((res)=>{
          if(res && res.code===0){
            this.tableData=res.data.records
            this.totalCount=res.data.total
          }
        })
        .finally((e)=>{
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
      this.studentListDialogVisible=bool
      this.resultListDialogVisible=bool
      this.rankListDialogVisible=bool
      this.opRecordDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='add'){
        this.$router.push({
          name:'competition-op',
          query:{
            operation,
          }
        })
      }else if(operation==='edit'){
        this.$router.push({
          name:'competition-op',
          query:{
            operation,
            id:row.id
          }
        })
      }else if(operation==='show-detail'){
        this.$router.push({
          name:'competition-detail',
          query:{
            id:row.id
          }
        })
      }else if(operation==='delete'){
        this.operationForm={
          id:row.id,
          title:"您确认删除这条记录吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='competition-student'){
        this.operationForm={
          id:row.id,
        }
        this.studentListDialogVisible=true
      }else if(operation==='competition-result'){
        this.operationForm={
          competitionId:row.id,
          sortArray:[
            {
              field:'end_time',
              sort:"DESC"
            }
          ],
        }
        this.resultListDialogVisible=true
      }else if(operation==='competition-rank'){
        this.operationForm={
          pageNum:1,
          pageSize:9999,
          sortArray:[
            {
              field:'total',
              sort:"DESC"
            }
          ],
          competitionId:row.id,
          account:"",
        }
        this.rankListDialogVisible=true
      }else if(operation==='show-opRecord'){
        this.operationForm={
          pageNum:1,
          pageSize:10,
          tableName:'competitions',
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
        let params={
          id:this.operationForm.id
        }
        api_deleteCompetition(params)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.search()
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
