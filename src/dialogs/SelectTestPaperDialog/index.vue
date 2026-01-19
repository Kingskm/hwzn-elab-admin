<template>
  <div class="container">
    <el-dialog :visible.sync="show" :before-close="handleClose" :close-on-click-modal="true" :show-close="true" title="从试卷模板库中选取" width="1400px">
      <searchFilter :filter="filter" @search="search" @reset="reset"></searchFilter>
      <el-table ref="table" class="table" max-height="432" :data="tableData" v-loading="loading" @sort-change="sortChange">
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
              icon="el-icon-view"
              @click="operationOnClick(scope.row,'show')">查看
            </el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-finished"
              @click="operationOnClick(scope.row,'select')">选取
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
    </el-dialog>
    <ShowTestPaperDialog
      v-if="showTestPaperDialogVisible"
      :operationShow="showTestPaperDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
    ></ShowTestPaperDialog>
  </div>
</template>

<script>
import ShowTestPaperDialog from '@/dialogs/ShowTestPaperDialog/index.vue'
import searchFilter from './components/filter.vue'
import { 
  api_getTestPaperList,
} from "@/api/teach-center"
import {
  testPaperMethodEnum,
} from "@/utils/share"
export default {
  components: {
    ShowTestPaperDialog,
    searchFilter,
  },
  props:{
    operationShow:{
      type: Boolean,
    },
  },
  data() {
    return {
      show:this.operationShow,
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
      totalCount:0,
      testPaperMethodEnum,
      operationForm:{},
      showTestPaperDialogVisible:false,
    }
  },
  created(){
    this.search()
  },
  methods:{

    //获取数据
    getData(filter){
      api_getTestPaperList(filter)
        .then((res)=>{
          if(res && res.code===0){
            this.tableData=res.data.records
            this.totalCount=res.data.total
          }
        })
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

    //点击操作
    operationOnClick(row,operation){
      if(operation==='show'){
        this.operationForm={
          id:row.id,
        }
        this.showTestPaperDialogVisible=true
      }else if(operation==='select'){
        this.handleClose()
        this.$emit('confirm',{id:row.id})
      }
    },

    //关闭窗口
    closeDialog(bool){
      this.showTestPaperDialogVisible=bool
    },

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },
  },
}
</script>
