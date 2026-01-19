<template>
  <div class="container">
    <el-dialog :visible.sync="show" :before-close="handleClose" :close-on-click-modal="true" :show-close="true" title="试卷详情" width="1400px">
      <div class="base-container">
        <p class="title">{{dataInfo.name}}</p>
        <p class="des">
          <span style="margin-right:1.25rem">出卷人：{{dataInfo.createrDepartmentName || null}} {{dataInfo.createrName}} </span>
          <span style="margin-right:1.25rem">组卷方式：{{testPaperMethodEnum[dataInfo.method]}}</span>
          <span>创建时间：{{dataInfo.createTime}}</span>
        </p>
        <div class="testpaper-card" shadow="always">
          <div class="question-list" v-if="judgeList.length">
            <p class="question-type">一、判断题，共计{{judgeList.length}}题（{{dataInfo.judgeScore}}分/题）。</p>
            <div class="question-item" v-for="(item,index) in judgeList" :key="index">
              <span class="index">{{index+1}}.</span>
              <span class="content">{{item.content}}</span>
              <p :class="`answer-item ${item.answer==='对'?'is-correct':''}`">A. 对</p>
              <p :class="`answer-item ${item.answer==='错'?'is-correct':''}`">B. 错</p>
            </div>
          </div>
          <div class="question-list" v-if="radioList.length">
            <p class="question-type">{{judgeList.length?'二':'一'}}、单选题，共计{{radioList.length}}题（{{dataInfo.radioScore}}分/题）。</p>
            <div class="question-item" v-for="(item,index) in radioList" :key="index">
              <span class="index">{{index+1}}.</span>
              <span class="content">{{item.content}}</span>
              <p :class="`answer-item ${item.answer.indexOf('A')>-1?'is-correct':''}`">A. {{item.selectA}}</p>
              <p :class="`answer-item ${item.answer.indexOf('B')>-1?'is-correct':''}`">B. {{item.selectB}}</p>
              <p :class="`answer-item ${item.answer.indexOf('C')>-1?'is-correct':''}`">C. {{item.selectC}}</p>
              <p :class="`answer-item ${item.answer.indexOf('D')>-1?'is-correct':''}`">D. {{item.selectD}}</p>
            </div>
          </div>
          <div class="question-list" v-if="multiList.length">
            <p class="question-type">{{judgeList.length && radioList.length?'三':judgeList.length || radioList.length?'二':'一'}}、多选题，共计{{multiList.length}}题（{{dataInfo.multiScore}}分/题）。</p>
            <div class="question-item" v-for="(item,index) in multiList" :key="index">
              <span class="index">{{index+1}}.</span>
              <span class="content">{{item.content}}</span>
              <p :class="`answer-item ${item.answer.indexOf('A')>-1?'is-correct':''}`">A. {{item.selectA}}</p>
              <p :class="`answer-item ${item.answer.indexOf('B')>-1?'is-correct':''}`">B. {{item.selectB}}</p>
              <p :class="`answer-item ${item.answer.indexOf('C')>-1?'is-correct':''}`">C. {{item.selectC}}</p>
              <p :class="`answer-item ${item.answer.indexOf('D')>-1?'is-correct':''}`">D. {{item.selectD}}</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  api_getTestPaperInfoById,
} from "@/api/teach-center"
import {
  testPaperMethodEnum,
} from "@/utils/share"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type: Object,
    },
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      dataInfo:[],
      testPaperMethodEnum,
      judgeList:[],
      radioList:[],
      multiList:[],
    }
  },
  created(){
    this.getData()
  },
  methods:{

    //获取数据
    getData(){
      api_getTestPaperInfoById(this.form)
        .then((res)=>{
          if(res && res.code===0){
            this.dataInfo=res.data
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

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },
  },
}
</script>

<style lang="scss" scoped>
.testpaper-card{
  width: 100%;
  max-height: 25rem;
  overflow-y: auto;
  margin-top: 1.25rem;

  .question-list{
    width: 100%;
    text-align: left;

    .question-type{
      font-size: 1.25rem;
      font-weight: bold;
      margin: .625rem 0;
    }

    .question-item{
      display: inline-block;
      width: 95%;
      font-size: 1rem;
      line-height: 1.125rem;
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