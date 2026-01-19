<template>
  <div class="container">
    <div class="title-container">
        <span class="title">申请管理</span>
    </div>
    <searchFilter
      :filter="filter"
      @search="search"
      @reset="reset"
    ></searchFilter>

    <el-table class="table" max-height="630px" :data="tableData" v-loading="loading">

      <el-table-column
        label="序号"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{(filterSubmit.pageNum-1)*filterSubmit.pageSize+scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="type"
        label="申请类型"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span>{{applicationTypeEnum[scope.row.type]}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="submitTime"
        label="提交时间"
        align="center"
        width="160">
      </el-table-column>

      <el-table-column
        prop="submitName"
        label="提交人"
        align="center"
        min-width="120">
        <template slot-scope="scope">
          {{scope.row.submitUserName+' '+scope.row.submitAccount}}
        </template>
      </el-table-column>

      <el-table-column
        prop="checkTime"
        label="审核时间"
        align="center"
        width="160">
        <template slot-scope="scope">
          {{scope.row.checkTime || "-"}}
        </template>
      </el-table-column>

      <el-table-column
        prop="checkAccount"
        label="审核人"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.checkAccount">{{(scope.row.checkName || '管理员')+' '+scope.row.checkAccount}}</span>
          <span v-if="!scope.row.checkAccount">-</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="checkReason"
        label="审核理由"
        align="center"
        min-width="200"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.checkReason<60?'#FF0000':'#00cc00'}`" v-if="scope.row.checkResult===1">{{scope.row.checkReason}}</span>
          <span v-else>{{scope.row.checkReason || "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="checkResult"
        label="审核结果"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.checkResult===0?'#FF0000':'#00cc00'}`" v-if="scope.row.checkResult===0 || scope.row.checkResult===1">{{applicationResultEnum[scope.row.checkResult]}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column 
        label="操作"
        align="center"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-s-check"
            v-if="!scope.row.checkResult && scope.row.checkResult!==0"
            @click="operationOnClick(scope.row,'check')">审核
          </el-button>
          <el-button
            size="mini"
            type="info"
            icon="el-icon-info"
            v-if="scope.row.checkResult || scope.row.checkResult===0"
            @click="operationOnClick(scope.row,'show-detail')">查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="filterSubmit.pageNum"
      :page-size="filterSubmit.pageSize"
      background
      layout="prev, pager, next,jumper,total"
      :total="totalCount">
    </el-pagination>
    <checkExperimentResultDialog
      v-if="checkExperimentResultDialogVisible" 
      :operationShow="checkExperimentResultDialogVisible" 
			:operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="handleCurrentChange"
    ></checkExperimentResultDialog>
    <detailExperimentResultDialog
      v-if="detailExperimentResultDialogVisible" 
      :operationShow="detailExperimentResultDialogVisible" 
			:operationForm="operationForm"
      @closeDialog="closeDialog"
    ></detailExperimentResultDialog>
  </div>
</template>

<script>
import searchFilter from './components/filter.vue'
import checkExperimentResultDialog from './components/check-experiment-result-dialog.vue'
import detailExperimentResultDialog from './components/experiment-result-detail.vue'
import { 
  api_getApplicationListByPageSort,
} from "@/api/common"
import {
  applicationTypeEnum,
  applicationResultEnum,
} from "@/utils/share"
export default {
  components: { 
    searchFilter,
    checkExperimentResultDialog,
    detailExperimentResultDialog,
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:50,
        type:"",
        recordId:"",
        submitStartTime:"",
        submitEndTime:"",
        submitAccount:"",
        checkStartTime:"",
        checkEndTime:"",
        checkAccount:"",
        checkResult:"",
        sortArray:[
          {
            field:"check_result",
            sort:"ASC"
          },
          {
            field:"submit_time",
            sort:"ASC"
          },
        ],
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:50,
        type:"",
        recordId:"",
        submitStartTime:"",
        submitEndTime:"",
        submitAccount:"",
        checkStartTime:"",
        checkEndTime:"",
        checkAccount:"",
        checkResult:"",
        sortArray:[
          {
            field:"check_result",
            sort:"ASC"
          },
          {
            field:"submit_time",
            sort:"ASC"
          },
        ],
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      applicationTypeEnum,
      applicationResultEnum,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      checkExperimentResultDialogVisible:false,  //审核实验成绩弹窗显示，默认为false
      detailExperimentResultDialogVisible:false,  //实验成绩审核详情弹窗显示，默认为false
    }
  },
  created(){
    if(this.$route.query.experimentId){
      this.filter.rId=this.$route.query.experimentId
      this.filterSubmit.rId=this.$route.query.experimentId
    }
    this.getData(this.filterSubmit)
  },
  methods:{
    //获取数据
    getData(filter){
      this.loading=true
      api_getApplicationListByPageSort(filter)
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
      this.filter.sortArray=[
        {
          field:"check_result",
          sort:"ASC"
        },
        {
          field:"submit_time",
          sort:"ASC"
        },
      ],
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
    //关闭窗口
    closeDialog(bool){
      this.checkExperimentResultDialogVisible=bool
      this.detailExperimentResultDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='check'){
        this.operationForm={
          id:row.id,
        }
        //分项成绩截图审核
        if(row.type===1){
          this.checkExperimentResultDialogVisible=true
        }
      }else if(operation==="show-detail"){
        this.operationForm={
          id:row.id,
        }
        //实验成绩截图审核
        if(row.type===1){
          this.detailExperimentResultDialogVisible=true
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.container{
  width: 100%;
  padding: 20px;

  .title-container{
    margin-bottom: 20px;

    .title{
      font-size: 26px;
      font-weight: bold;
    }
  }

  .table{
    text-align: center;
    margin-bottom: 20px;
    border-left: 1px solid #ebeef5;
  }

  .el-pagination{
      margin-top: 30px;
      text-align: right;
  }
}
</style>
<style scoped>
.container /deep/ .el-pagination__jump{
  margin-right: 20px;
}
</style>
