<template>
  <div class="container">
    <p class="title">{{operation==='add'?'新增':'编辑'}}</p>
    <div class="base-container">
      <el-form class="form" :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input 
            v-model.trim="form.name" 
            placeholder="请输入名称（20字符以内）" 
            maxlength="20"
            style="width:400px">
          </el-input>
        </el-form-item>
        <el-form-item label="判断题" prop="judgeScore">
          <el-input-number v-model="form.judgeScore" :min="0" :max="100" style="margin-right:10px"></el-input-number>分/题
          <span style="margin-left:20px">共计{{judgeList.length}}题</span>
        </el-form-item>
        <el-form-item label="单选题" prop="radioScore">
          <el-input-number v-model="form.radioScore" :min="0" :max="100" style="margin-right:10px"></el-input-number>分/题
          <span style="margin-left:20px">共计{{radioList.length}}题</span>
        </el-form-item>
        <el-form-item label="多选题" prop="multiScore">
          <el-input-number v-model="form.multiScore" :min="0" :max="100" style="margin-right:10px"></el-input-number>分/题
          <span style="margin-left:20px">共计{{multiList.length}}题</span>
        </el-form-item>
        <el-form-item label="总分">
          <span style="margin-left:20px">{{form.judgeScore*judgeList.length+form.radioScore*radioList.length+form.multiScore*multiList.length}}分</span>
        </el-form-item>
        <el-form-item label="试卷内容" prop="content">
          <div class="button-list">
            <div class="left">
              <el-button type="primary" @click="operationOnClick({},'select-question')" round>选题</el-button>
            </div>
            <div class="right">
              <el-button @click="operationOnClick({},'cancel')">取消</el-button>
              <el-button type="primary" @click="submit('form')">确定</el-button>
            </div>
          </div>
          <el-card class="testpaper-card" shadow="always">
            <div class="question-list" v-if="judgeList.length">
              <p class="question-type">一、判断题，共计{{judgeList.length}}题。</p>
              <div class="question-item" v-for="(item,index) in judgeList" :key="index">
                <span class="index">{{index+1}}、</span>
                <span class="content">{{item.content}}</span>
                <p :class="`answer-item ${item.answer==='对'?'is-correct':''}`">A. 对</p>
                <p :class="`answer-item ${item.answer==='错'?'is-correct':''}`">B. 错</p>
                <div v-if="item.type===2 || item.type===3">
                  <p :class="`answer-item ${item.answer.indexOf('A')>-1?'is-correct':''}`">A. {{item.selectA}}</p>
                  <p :class="`answer-item ${item.answer.indexOf('B')>-1?'is-correct':''}`">B. {{item.selectB}}</p>
                  <p :class="`answer-item ${item.answer.indexOf('C')>-1?'is-correct':''}`">C. {{item.selectC}}</p>
                  <p :class="`answer-item ${item.answer.indexOf('D')>-1?'is-correct':''}`">D. {{item.selectD}}</p>
                </div>
                <el-button type="danger" size="mini" class="button" @click="operationOnClick(item,'removeJudge')" round>移除</el-button>
              </div>
            </div>
            <div class="question-list" v-if="radioList.length">
              <p class="question-type">二、单选题，共计{{radioList.length}}题。</p>
              <div class="question-item" v-for="(item,index) in radioList" :key="index">
                <span class="index">{{index+1}}、</span>
                <span class="content">{{item.content}}</span>
                <p :class="`answer-item ${item.answer.indexOf('A')>-1?'is-correct':''}`">A. {{item.selectA}}</p>
                <p :class="`answer-item ${item.answer.indexOf('B')>-1?'is-correct':''}`">B. {{item.selectB}}</p>
                <p :class="`answer-item ${item.answer.indexOf('C')>-1?'is-correct':''}`">C. {{item.selectC}}</p>
                <p :class="`answer-item ${item.answer.indexOf('D')>-1?'is-correct':''}`">D. {{item.selectD}}</p>
                <el-button type="danger" size="mini" class="button" @click="operationOnClick(item,'removeRadio')" round>移除</el-button>
              </div>
            </div>
            <div class="question-list" v-if="multiList.length">
              <p class="question-type">三、多选题，共计{{multiList.length}}题。</p>
              <div class="question-item" v-for="(item,index) in multiList" :key="index">
                <span class="index">{{index+1}}、</span>
                <span class="content">{{item.content}}</span>
                <p :class="`answer-item ${item.answer.indexOf('A')>-1?'is-correct':''}`">A. {{item.selectA}}</p>
                <p :class="`answer-item ${item.answer.indexOf('B')>-1?'is-correct':''}`">B. {{item.selectB}}</p>
                <p :class="`answer-item ${item.answer.indexOf('C')>-1?'is-correct':''}`">C. {{item.selectC}}</p>
                <p :class="`answer-item ${item.answer.indexOf('D')>-1?'is-correct':''}`">D. {{item.selectD}}</p>
                <el-button type="danger" size="mini" class="button" @click="operationOnClick(item,'removeMulti')" round>移除</el-button>
              </div>
            </div>
          </el-card>
        </el-form-item>
      </el-form>
    </div>
    <SelectQuestionDialog
			v-if="selectQuestionDialogVisible" 
      :operationShow="selectQuestionDialogVisible" 
			@confirm="getQuestionList"
      @closeDialog="closeDialog"
		></SelectQuestionDialog>
  </div>
</template>

<script>
import SelectQuestionDialog from "@/dialogs/SelectQuestionDialog"
import {
  api_getTestPaperInfoById,
  api_getQuestionInfoById,
  api_createTestPaper,
  api_updateTestPaper,
} from "@/api/teach-center"
export default {
  components:{
    SelectQuestionDialog,
  },
  data(){
    var judgeScoreChange = (rule, value, callback) => {
      if (this.judgeList.length>0 && this.form.judgeScore==0) {
        callback(new Error('判断题得分不能为0'));
      } else {
        callback();
      }
    };
    var radioScoreChange = (rule, value, callback) => {
      if (this.radioList.length>0 && this.form.radioScore==0) {
        callback(new Error('单选题得分不能为0'));
      } else {
        callback();
      }
    };
    var multiScoreChange = (rule, value, callback) => {
      if (this.multiList.length>0 && this.form.multiScore==0) {
        callback(new Error('多选题得分不能为0'));
      } else {
        callback();
      }
    };
    return{
      operation:this.$route.query.operation || "add",
      form:{
        judgeScore:0,
        judgeContent:null,
        radioScore:0,
        radioContent:null,
        multiScore:0,
        multiContent:null,
        type:this.$route.query.type || 1,
        relId:this.$route.query.relId || null,
      },
      rules:{
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        judgeScore:[
          { required: true, message: '判断题分值不能为空', trigger: 'change' },
          { validator: judgeScoreChange, trigger: 'change' },
        ],
        radioScore:[
          { required: true, message: '单选题分值不能为空', trigger: 'change' },
          { validator: radioScoreChange, trigger: 'change' },
        ],
        multiScore:[
          { required: true, message: '多选题分值不能为空', trigger: 'change' },
          { validator: multiScoreChange, trigger: 'change' },
        ],
      },
      judgeList:[],
      radioList:[],
      multiList:[],
      selectQuestionDialogVisible:false,
    }
  },
  created(){
    if(this.operation==='edit'){
      this.getTestPaperInfo()
    }
  },
  methods:{

    //获得试卷信息
    getTestPaperInfo(){
      let params={
        id:this.$route.query.id
      }
      api_getTestPaperInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form=res.data
            if(res.data.judgeContent){
              this.judgeList=JSON.parse(res.data.judgeContent)
            }
            if(res.data.radioContent){
              this.radioList=JSON.parse(res.data.radioContent)
            }
            if(res.data.multiContent){
              this.multiList=JSON.parse(res.data.multiContent)
            }
          }
        })
    },

    //获取题目信息
    getQuestionInfoById(id){
      return new Promise((resolve,reject)=>{
        let params={
          id,
        }
        api_getQuestionInfoById(params)
          .then((res)=>{
            if(res && res.code===0){
              resolve(res.data)
            }
          })
      })
    },

    //关闭弹窗
    closeDialog(bool){
      this.selectQuestionDialogVisible=bool
    },

    //点击操作
    operationOnClick(item,operation){
      if(operation==='cancel'){
        this.$router.back()
      }else if(operation==='select-question'){
        this.selectQuestionDialogVisible=true
      }else if(operation==='removeJudge'){
        for(let i=0;i<this.judgeList.length;i++){
          if(this.judgeList[i].id===item.id){
            this.judgeList.splice(i,1)
            break
          }
        }
      }else if(operation==='removeRadio'){
        for(let i=0;i<this.radioList.length;i++){
          if(this.radioList[i].id===item.id){
            this.radioList.splice(i,1)
            break
          }
        }
      }else if(operation==='removeMulti'){
        for(let i=0;i<this.multiList.length;i++){
          if(this.multiList[i].id===item.id){
            this.multiList.splice(i,1)
            break
          }
        }
      }
    },

    //获取题目列表
    getQuestionList(ids){
      let questionList=ids.map((id)=>{
        return this.getQuestionInfoById(id)
      })
      this.organizeTestPaper(questionList)
    },

    //组织试卷
    organizeTestPaper(questionList){
      Promise.all(questionList).then(value=>{
        for(let i=0;i<value.length;i++){
          //把题目信息存入对应的数组中
          switch(value[i].type){
            case 1:
              this.judgeList.push(value[i])
              break
            case 2:
              this.radioList.push(value[i])
              break
            case 3:
              this.multiList.push(value[i])
              break
            default:
              this.$message.error("题目信息错误")
              break;
          }
        }
      })
    },

    //提交
    submit(formName){
      this.form.judgeContent=JSON.stringify(this.judgeList)
      this.form.radioContent=JSON.stringify(this.radioList)
      this.form.multiContent=JSON.stringify(this.multiList)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if((this.form.judgeScore*this.judgeList.length+this.form.radioScore*this.radioList.length+this.form.multiScore*this.multiList.length)!==100){
            this.$message.warning("总分不为100分，请合理配置")
            return false
          }
          if(this.operation==='add'){
            api_createTestPaper(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.$router.back()
                }
              })
          }else if(this.operation==='edit'){
            api_updateTestPaper(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('更新成功')
                  this.$router.back()
                }
              })
          }
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.button-list{
  display: flex;
  justify-content: space-between;
}

.testpaper-card{
  width: 100%;
  margin-top: 1.25rem;

  .question-list{
    width: 100%;
    text-align: left;

    .question-type{
      font-size: 1.5625rem;
      font-weight: bold;
      margin: .625rem 0;
    }

    .question-item{
      display: inline-block;
      width: 95%;
      font-size: 1.25rem;
      line-height: 1.5rem;
      margin-bottom: 1.25rem;
      position: relative;

      .question-header{
        color: #FFAC59;
        font-size: .875rem;
        height: 1.25rem;
        line-height: 1.25rem;
        margin-bottom: .625rem;

        span{
          font-weight: bold;
        }
      }

      .index{
        font-weight: bold;
        color: #33445D;
      }
      .type{
        font-weight: bold;
        color: #33445D;
      }
      .content{
        color: #101010;
        font-weight: 400;
        width: 100%;
      }
      .question-image{
        display: block;
        width: 16.25rem;
        height: 8.875rem;
        margin-top: .625rem;
      }
      .answer-item{
        color: #434343;
        font-weight: bold;
        margin: 1rem 0 0 0;
      }
      .button{
        position: absolute;
        top: 1.875rem;
        right: -3.75rem;
      }
      .is-correct{
        color: #4499ee;
      }
    }
  }
}
</style>
