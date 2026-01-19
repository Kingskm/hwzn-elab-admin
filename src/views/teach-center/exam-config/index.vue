<template>
  <div class="container">
    <p class="title">考试配置</p>
    <div class="base-container">
      <el-row>
        <el-col :span="2">考试试卷：</el-col>
        <el-col :span="22">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="operationOnClick({},'add')">人工组卷</el-button>
          <el-button size="mini" type="success" icon="el-icon-coordinate" @click="operationOnClick({},'ai-create')">AI组卷</el-button>
          <el-button size="mini" type="warning" icon="el-icon-paperclip" @click="operationOnClick({},'select-testPaper')">从试卷库中选取</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="table" class="table" max-height="360" :data="tableData" v-loading="loading">
            <el-table-column
              label="序号"
              align="center"
              width="100">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>

            <el-table-column
              prop="name"
              label="名称"
              align="center"
              min-width="200">
            </el-table-column>

            <el-table-column
              prop="method"
              label="组卷方式"
              align="center"
              width="100">
              <template slot-scope="scope">
                {{testPaperMethodEnum[scope.row.method]}}
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
              min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.createrName">{{scope.row.createrName + " " + scope.row.createrAccount}}</span>
                <span v-else style="color:#F56C6C">用户不存在</span>
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
        </el-col>
      </el-row>
    </div>
    <AICreateTestPaperDialog
      v-if="aiCreateTestPaperDialogVisible" 
      :operationShow="aiCreateTestPaperDialogVisible" 
      :operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="getTestPaperList"
    ></AICreateTestPaperDialog>
    <SelectTestPaperDialog
			v-if="selectTestPaperDialogVisible" 
      :operationShow="selectTestPaperDialogVisible" 
			@confirm="confirm"
      @closeDialog="closeDialog"
		></SelectTestPaperDialog>
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
import SelectTestPaperDialog from '@/dialogs/SelectTestPaperDialog'
import FileUpload from '@/components/FileUpload/index.vue'
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import{
  api_getTestPaperList,
  api_createTestPaperByCopy,
  api_deleteTestPaper
} from "@/api/teach-center"
import {
  testPaperMethodEnum,
} from "@/utils/share"
export default {
  components: {
    FileUpload,
    AICreateTestPaperDialog,
    SelectTestPaperDialog,
    ConfirmDialog,
    OpRecordDialog,
  },
  data(){
    return{
      tableData:[],
      loading:false,
      testPaperMethodEnum,
      operation:"",
      operationForm:{},  //操作表单，默认为空
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      aiCreateTestPaperDialogVisible:false,
      selectTestPaperDialogVisible:false,
      opRecordDialogVisible:false,  //操作日志弹窗显示，默认为false
    }
  },
  created(){
    this.getTestPaperList()
  },
  methods:{

    //获取试卷列表
    getTestPaperList(){
      let params={
        type:3,
        relId:this.$route.query.id,
      }
      api_getTestPaperList(params)
        .then((res)=>{
            if(res && res.code === 0){
              this.tableData=res.data.records
            }
          })
    },

    //关闭窗口
    closeDialog(bool){
      this.aiCreateTestPaperDialogVisible=bool
      this.selectTestPaperDialogVisible=bool
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
            type:3,
            relId:this.$route.query.id,
          }
        })
      }else if(operation==='ai-create'){
        this.operationForm={
          relId:this.$route.query.id,
          type:3,
        }
        this.aiCreateTestPaperDialogVisible=true
      }else if(operation==='select-testPaper'){
        this.selectTestPaperDialogVisible=true
      }else if(operation==='edit'){
        this.$router.push({
          name:'test-paper-op',
          query:{
            operation,
            id:row.id
          }
        })
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
      }
    },

    //确认
    confirm(form){
      if(this.operation==='select-testPaper'){
        let params={
          sourceId:form.id,
          type:3,
          relId:this.$route.query.id,
        }
        api_createTestPaperByCopy(params)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("创建成功")
              this.getTestPaperList()
            }
          })
      }else if(this.operation==='delete'){
        api_deleteTestPaper(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.getTestPaperList()
            }
          })
      }
    },

  }
}
</script>