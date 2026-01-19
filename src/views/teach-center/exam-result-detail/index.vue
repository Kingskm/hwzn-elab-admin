<template>
  <div class="container">
    <p class="title">考试成绩详情</p>
    <div class="testpaper-header">
      <p>总分：{{dataInfo.score}}</p>
    </div>
    <div class="testpaper-card">
      <div class="question-list" v-if="judgeList.length">
        <p class="question-type">一、判断题（每题{{testPaperInfo.judgeScore}}分），共计{{judgeList.length}}题。</p>
        <div class="question-item" v-for="(item,index) in judgeList" :key="index">
          <span :class="`content ${item.isCorrect?'is-correct':'is-error'}`">{{index+1}}、{{item.content}}</span>
          <p :class="`answer-item ${item.userAnswer==='对'?'is-select':''}`">A. 对</p>
          <p :class="`answer-item ${item.userAnswer==='错'?'is-select':''}`">B. 错</p>
          <p :class="`answer ${item.isCorrect?'is-correct':'is-error'}`">正确答案：{{item.answer}}</p>
        </div>
      </div>
      <div class="question-list" v-if="radioList.length">
        <p class="question-type">二、单选题（每题{{testPaperInfo.radioScore}}分），共计{{radioList.length}}题。</p>
        <div class="question-item" v-for="(item,index) in radioList" :key="index">
          <span :class="`content ${item.isCorrect?'is-correct':'is-error'}`">{{index+1}}、{{item.content}}</span>
          <p :class="`answer-item ${item.userAnswer.indexOf('A')>-1?'is-select':''}`">A. {{item.selectA}}</p>
          <p :class="`answer-item ${item.userAnswer.indexOf('B')>-1?'is-select':''}`">B. {{item.selectB}}</p>
          <p :class="`answer-item ${item.userAnswer.indexOf('C')>-1?'is-select':''}`">C. {{item.selectC}}</p>
          <p :class="`answer-item ${item.userAnswer.indexOf('D')>-1?'is-select':''}`">D. {{item.selectD}}</p>
          <p :class="`answer ${item.isCorrect?'is-correct':'is-error'}`">正确答案：{{item.answer}}</p>
        </div>
      </div>
      <div class="question-list" v-if="multiList.length">
        <p class="question-type">三、多选题（每题{{testPaperInfo.multiScore}}分），共计{{multiList.length}}题。</p>
        <div class="question-item" v-for="(item,index) in multiList" :key="index">
          <span :class="`content ${item.isCorrect?'is-correct':'is-error'}`">{{index+1}}、{{item.content}}</span>
          <p :class="`answer-item ${item.userAnswerList.indexOf('A')>-1?'is-select':''}`">A. {{item.selectA}}</p>
          <p :class="`answer-item ${item.userAnswerList.indexOf('B')>-1?'is-select':''}`">B. {{item.selectB}}</p>
          <p :class="`answer-item ${item.userAnswerList.indexOf('C')>-1?'is-select':''}`">C. {{item.selectC}}</p>
          <p :class="`answer-item ${item.userAnswerList.indexOf('D')>-1?'is-select':''}`">D. {{item.selectD}}</p>
          <p :class="`answer ${item.isCorrect?'is-correct':'is-error'}`">正确答案：{{item.answer}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  api_getExamResultInfoById,
  api_getTestPaperInfoById,
} from "@/api/teach-center"
export default {
  data(){
    return{
      dataInfo:{},
      testPaperInfo:{},
      questionList:[],
      judgeList:[],
      radioList:[],
      multiList:[],
    }
  },
  created(){
    this.getDataInfo()
  },
  methods:{

    //获得信息
    getDataInfo(){
      let params={
        id:this.$route.query.id
      }
      api_getExamResultInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.dataInfo=res.data
            this.getTestPaperInfo(res.data.paperId)
            this.questionList=JSON.parse(res.data.content)
            this.questionList.forEach((item=>{
              if(item.type==1){
                this.judgeList.push(item)
              }else if(item.type==2){
                this.radioList.push(item)
              }else if(item.type==3){
                this.multiList.push(item)
              }
            }))
            // if(res.data.judgeContent){
            //   this.judgeList=JSON.parse(res.data.judgeContent)
            // }
            // if(res.data.radioContent){
            //   this.radioList=JSON.parse(res.data.radioContent)
            // }
            // if(res.data.multiContent){
            //   this.multiList=JSON.parse(res.data.multiContent)
            // }
          }
        })
    },

    //获取试卷信息
    getTestPaperInfo(id){
      api_getTestPaperInfoById({id})
        .then((res)=>{
          if(res && res.code===0){
            this.testPaperInfo=res.data
          }
        })
    },
    
  }
}
</script>

<style lang="scss" scoped>
.testpaper-header{
  font-weight: bold;
  font-size: 1.25rem;
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
        // font-weight: bold;
        margin: 1rem 0 0 0;
      }
      .answer{
        color: #434343;
        font-weight: bold;
      }
      .button{
        position: absolute;
        top: 1.875rem;
        right: -3.75rem;
      }
      .is-correct{
        color: #67C23A;
        font-weight: bold;
      }
      .is-error{
        color: #F56C6C;
        font-weight: bold;
      }
      .is-select{
        color:#409EFF;
        font-weight: bold;
      }
    }
  }
}
</style>
