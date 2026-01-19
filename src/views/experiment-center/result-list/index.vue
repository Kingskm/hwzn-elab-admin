<template>
  <div class="container">
    <p class="title">成绩列表</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <el-button slot="add" type="primary" icon="el-icon-share" @click="operationOnClick({},'export')">导出成绩</el-button>
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
        prop="typeName"
        label="实验类别"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="experimentName"
        label="实验"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="itemName"
        label="分项"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="source"
        label="来源"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{experimentSourceEnum[scope.row.source]}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="account"
        label="实验人员"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.userName">{{scope.row.userName + " " + scope.row.account}}</span>
          <span v-else style="color:#F56C6C">用户不存在</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="score"
        label="得分"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.score<60?'#FF0000':''}`">{{scope.row.score}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="endTime"
        label="实验时间"
        align="center"
        width="160">
      </el-table-column>

      <el-table-column
        prop="timeLong"
        label="实验时长"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span v-if="$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).hours()">{{$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).hours()+"时"}}</span>
          <span v-if="$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).minutes()">{{$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).minutes()+"分"}}</span>
          <span v-if="$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).seconds()">{{$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).seconds()+"秒"}}</span>
          <span v-if="scope.row.endTime===scope.row.startTime">-</span>
        </template>
      </el-table-column>

      <el-table-column 
        label="操作"
        align="center"
        min-width="200">
        <template slot-scope="scope">
          <el-button 
            size="mini"
            type="info"
            icon="el-icon-info"
           @click="operationOnClick(scope.row,'show-detail')">查看详情
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-download"
            @click="operationOnClick(scope.row,'download-report')">下载报告
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
    <detailDialog
      v-if="detailDialogVisible" 
      :operationShow="detailDialogVisible" 
			:operationForm="operationForm"
      @closeDialog="closeDialog"
    ></detailDialog>
    <ExportDialog
      v-if="exportDialogVisible"
      :operationShow="exportDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="confirm"
    ></ExportDialog>
  </div>
</template>

<script>
import searchFilter from './components/filter.vue'
import detailDialog from './components/detail-dialog.vue'
import ExportDialog from '@/components/ExportDialog'
import { 
  api_getItemResultList,
  api_exportItemResultList,
} from "@/api/experiment-center"
import {
  experimentSourceEnum
} from "@/utils/share"
import {
  downLoadFile,
} from "@/utils/common"
export default {
  components: { 
    searchFilter,
    detailDialog,
    ExportDialog,
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:10,
        typeId:"",
        experimentId:"",
        itemId:"",
        source:"",
        departmentId:"",
        classId:"",
        account:"",
        startTime:"",
        endTime:"",
        sortArray:[
          {
            field:"endTime",
            sort:"DESC"
          },
        ]
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        typeId:"",
        experimentId:"",
        itemId:"",
        source:"",
        departmentId:"",
        classId:"",
        account:"",
        startTime:"",
        endTime:"",
        sortArray:[
          {
            field:"endTime",
            sort:"DESC"
          },
        ]
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      experimentSourceEnum,
      filePath:"",
      videoIndex:0,
      stepIndex:0,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      detailDialogVisible:false,  //详情弹窗显示，默认false
      exportDialogVisible:false,  //导出弹窗显示，默认为false
    }
  },
  created(){
    this.getData(this.filterSubmit)
  },
  methods:{
    //获取数据
    getData(filter){
      this.loading=true
      api_getItemResultList(filter)
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
            field:"endTime",
            sort:"DESC"
          },
        ]
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
      this.exportDialogVisible=bool
      this.detailDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='show-detail'){
        this.operationForm={
          id:row.id,
        }
        this.detailDialogVisible=true
      }else if(operation==='export'){
        this.operationForm={
          total:this.totalCount,
          maxPageNum:Math.floor(this.totalCount/this.filterSubmit.pageSize)+1,
          startPageNum:1,
          endPageNum:Math.floor(this.totalCount/this.filterSubmit.pageSize)+1,
          sortArray:[
            {
              field:"endTime",
              sort:"DESC"
            },
          ]
        }
        this.exportDialogVisible=true
      }else if(operation==='download-report'){
        downLoadFile(row.path,row.userName+row.account+"有关"+row.experimentName+"的实验报告（"+row.endTime+"）")
      }
    },
    
    //确认
    confirm(form){
      if(this.operation==='export'){
        let params={
          ...form,
          ...this.filterSubmit,
          fileType:'xlsx',
        }
        delete params.pageNum
        delete params.maxPageNum
        delete params.total
        const loading = this.$loading({
          lock: true,
          text: '生成文件中，请勿操作',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        api_exportItemResultList(params)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("导出成功")
              downLoadFile(res.data.filePath,(this.filterSubmit.account?"账号为"+this.filterSubmit.account+"的":"")+"成绩列表（导出时间："+this.$dayjs().format("YYYY-MM-DD HH:mm:ss")+")")
            }
          })
          .finally(()=>{
            loading.close()
          })
          setTimeout(()=>{
            loading.close()
          },10000)
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
