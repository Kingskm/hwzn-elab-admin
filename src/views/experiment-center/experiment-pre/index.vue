<template>
  <div class="container">
    <p class="title">前置条件</p>
    <div class="base-container">
      <el-row>
        <el-col :span="3">理论学习材料</el-col>
        <el-col :span="21">
          <FileUpload v-model="dataInfo.learnContent" :maxFileSize="500" accept="video/mp4,application/pdf" tip="仅支持MP4、pdf格式上传,且不超过500M" @change="change('learnContent')"></FileUpload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">是否开启理论学习校验</el-col>
        <el-col :span="21">
          <el-switch
            v-model="dataInfo.isLearn"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="change('isLearn')">
          </el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">实验考核试卷：</el-col>
        <el-col :span="20">
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
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-finished"
                  @click="operationOnClick(scope.row,'select')"
                  v-if="!dataInfo.checkContent || !dataInfo.checkContent.split(',').includes(String(scope.row.id))">指定
                </el-button>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-close"
                  @click="operationOnClick(scope.row,'cancel-select')"
                  v-if="dataInfo.checkContent && dataInfo.checkContent.split(',').includes(String(scope.row.id))">取消指定
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">是否开启试卷考核校验</el-col>
        <el-col :span="1">
          <el-switch
            v-model="dataInfo.isCheck"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="change('isCheck')">
          </el-switch>
        </el-col>
        <el-col :span="20">提示：无指定试卷则默认随机抽卷，有指定试卷且指定试卷数量大于1，则从指定的试卷中随机抽卷</el-col>
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
import {
  api_getExperimentInfoById,
  api_updateExperimentConditionStatus,
  api_updateExperimentConditionContent,
} from "@/api/experiment-center"
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
      operation:this.$route.query.operation || "add",
      dataInfo:{},
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
    this.getDataInfo()
    this.getTestPaperList()
  },
  methods:{

    //获取实验信息
    getDataInfo(){
      let params={
        id:this.$route.query.id,
      }
      api_getExperimentInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.dataInfo=res.data
          }
        })
    },

    //获取试卷列表
    getTestPaperList(){
      let params={
        type:2,
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

    change(module){
      if(module==='learnContent' && this.dataInfo.learnContent!=undefined){
        let params={
          id:this.dataInfo.id,
          content:this.dataInfo.learnContent,
          condition:1,
        }
        api_updateExperimentConditionContent(params)
          .then((res)=>{
            if(res && res.code === 0){
              this.$message.success(params.content?'您已上传理论学习材料':'您已移除理论学习材料')
            }
          })
      }else if(module==='isLearn'){
        let params={
          id:this.dataInfo.id,
          status:this.dataInfo.isLearn,
          condition:1,
        }
        api_updateExperimentConditionStatus(params)
          .then((res)=>{
            if(res && res.code === 0){
              this.$message.success(params.status?'您已开启理论学习校验':'您已关闭理论学习校验')
            }else if(res && res.code===2){
              this.dataInfo.isLearn=0
            }
          })
      }else if(module==='isCheck'){
        let params={
          id:this.dataInfo.id,
          status:this.dataInfo.isCheck,
          condition:2,
        }
        api_updateExperimentConditionStatus(params)
          .then((res)=>{
            if(res && res.code === 0){
              this.$message.success(params.status?'您已开启试卷考核校验':'您已关闭试卷考核校验')
            }else if(res && res.code===2){
              this.dataInfo.isCheck=0
            }
          })
      }
    },

    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='add'){
        this.$router.push({
          name:'test-paper-op',
          query:{
            operation,
            type:2,
            relId:this.$route.query.id,
          }
        })
      }else if(operation==='ai-create'){
        this.operationForm={
          relId:this.$route.query.id,
          type:2,
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
      }else if(operation==='select'){
        let params={
          id:this.dataInfo.id,
          condition:2,
          content:null,
        }
        if(this.dataInfo.checkContent){
          params.content=this.dataInfo.checkContent+','+row.id
        }else{
          params.content=row.id
        }
        api_updateExperimentConditionContent(params)
          .then((res)=>{
            if(res && res.code === 0){
              this.$message.success("您已成功指定考核试卷")
              this.getDataInfo()
            }
          })
      }else if(operation==='cancel-select'){
        let params={
          id:this.dataInfo.id,
          condition:2,
          content:this.dataInfo.checkContent.split(',').filter(item=>item!=String(row.id)).sort().join(','),
        }
        api_updateExperimentConditionContent(params)
          .then((res)=>{
            if(res && res.code === 0){
              this.$message.success("您已成功取消指定考核试卷")
              this.getDataInfo()
            }
          })
      }
    },

    //确认
    confirm(form){
      if(this.operation==='select-testPaper'){
        let params={
          sourceId:form.id,
          type:2,
          relId:this.dataInfo.id
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