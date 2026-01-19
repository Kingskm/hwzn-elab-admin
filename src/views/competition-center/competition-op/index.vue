<template>
  <div class="container">
    <div class="title-container">
      <span class="title">{{operation==='add'?'新增':'编辑'}}</span>
    </div>
    <div class="base-container">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="封面">
          <ImageUpload :mode="'upload'" v-model="form.cover" :maxImageSize="102400"></ImageUpload>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input 
            v-model.trim="form.name" 
            placeholder="请输入名称（20字符以内）" 
            maxlength="20"
            style="width:400px">
          </el-input>
        </el-form-item>
        <el-form-item label="举办单位" prop="organization">
          <el-input 
            v-model.trim="form.organization" 
            placeholder="请输入举办单位（20字符以内）" 
            maxlength="20"
            style="width:400px">
          </el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="chargerAccount">
          <el-select v-model="form.chargerAccount" filterable placeholder="请选择负责人" clearable style="width:600px">
            <el-option 
              v-for="item in teacherList" 
              :key="item.account" 
              :label="`${item.name +' '+item.account}`" 
              :value="item.account">
              <span style="float: left">{{ item.name+" "+item.account }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.departmentName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验" prop="experimentList">
          <el-select v-model="form.experimentList" filterable multiple collapse-tags placeholder="请选择实验" clearable style="width:600px">
            <el-option 
              v-for="item in experimentList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id.toString()">
              <span style="float: left">{{ item.name}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.typeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="竞赛时间" prop="timeRange" class="is-required">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            @change="timeRangeChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input 
            v-model.trim="form.tag" 
            placeholder="请输入标签（10字符以内）" 
            maxlength="10"
            style="width:400px">
          </el-input>
        </el-form-item>
        <el-form-item label="评委" prop="judgeList">
          <el-select v-model="form.judgeList" filterable placeholder="请创建评委(最多5个)" multiple allow-create clearable style="width:600px" :multiple-limit="5"></el-select>
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input 
            v-model.trim="form.des" 
            placeholder="请输入描述（200字以内）" 
            maxlength="200"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-form-item>
        <el-form-item label="竞赛介绍">
          <el-tabs id="intro" tab-position="top">
            <el-tab-pane label="赛事规则"><RichText v-model="form.rule"></RichText></el-tab-pane>
            <el-tab-pane label="大赛赛程"><RichText v-model="form.schedule"></RichText></el-tab-pane>
            <el-tab-pane label="常见问题"><RichText v-model="form.problem"></RichText></el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button @click="operationOnClick({},'cancel')">取消</el-button>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue'
import RichText from '@/components/RichText/index.vue'
import {
  api_getCompetitionInfoById,
  api_createCompetition,
  api_updateCompetition,
} from "@/api/competition-center"
import { 
  api_getUserList 
} from '@/api/user-center'
import { 
  api_getExperimentList 
} from '@/api/experiment-center'
export default {
  components: {
    ImageUpload,
    RichText,
  },
  data(){
    var checkTimeRange = (rule, value, callback) => {
      if (this.timeRange.length === 0) {
        callback(new Error('请选择竞赛时间'));
      } else {
        callback();
      }
    };
    return{
      operation:this.$route.query.operation || "add",
      form:{
        experiments:null,
        experimentList:[],
      },
      rules:{
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        organization:[
          { required: true, message: '组织单位不能为空', trigger: 'change' },
        ],
        chargerAccount:[
          { required: true, message: '负责人不能为空', trigger: 'change' },
        ],
        experimentList:[
          { required: true, message: '实验不能为空', trigger: 'change' },
        ],
        timeRange:[
          { validator: checkTimeRange, trigger: 'change' },
        ],
      },
      timeRange:[],
      teacherList:[],
      experimentList:[],
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;  // 可选历史天、可选当前天、不可选未来天
        },
      },
    }
  },
  created(){
    this.getTeacherList()
    this.getExperimentList()
    if(this.operation==='edit'){
      this.getExperimentInfo()
    }
  },
  methods:{

    //获取竞赛信息
    getExperimentInfo(){
      let params={
        id:this.$route.query.id
      }
      api_getCompetitionInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form={
              ...res.data,
              tagList:res.data.tag?res.data.tag.split(','):null,
              judgeList:res.data.judge?res.data.judge.split(','):null,
              experimentList:res.data.experiments?res.data.experiments.split(','):null
            }
            this.timeRange.push(res.data.startTime)
            this.timeRange.push(res.data.endTime)
          }
        })
    },

    //获取教师列表
    getTeacherList(){
      let params={
        pageNum:1,
        pageSize:999999,
        departmentId:"",
        classId:"",
        account:"",
        name:"",
        role:2,
        status:"",
        sortArray:null
      }
      api_getUserList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.teacherList=res.data.records
          }
        })
    },

    //获取实验列表
    getExperimentList(){
      let params={
        pageNum:1,
        pageSize:999999,
        typeId:"",
        name:"",
        org:"",
        author:"",
        isInner:"",
        status:"",
        sortArray:null
      }
      api_getExperimentList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.experimentList=res.data.records
          }
        })
    },

    timeRangeChange(){
      if(this.timeRange){
        this.form.startTime=this.timeRange[0]
        this.form.endTime=this.timeRange[1]
      }else{
        this.form.startTime=""
        this.form.endTime=""
      }
    },


    //点击操作
    operationOnClick(row,operation){
      if(operation==='cancel'){
        this.$router.back()
      }
    },

    //提交
    submit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.tagList){
              this.form.tag=this.form.tagList.toString()
            }
            if(this.form.judgeList){
              this.form.judge=this.form.judgeList.toString()
            }
            if(this.form.experimentList){
              this.form.experiments=this.form.experimentList.toString()
            }
            if(this.operation==='add'){
              api_createCompetition(this.form)
                .then((res)=>{
                  if(res && res.code === 0){
                    this.$message.success('新增成功')
                    this.$router.back()
                  }
                })
            }else if(this.operation==='edit'){
              api_updateCompetition(this.form)
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
.container{
  width: 100%;
  padding: 20px;

  .title-container{
    margin-bottom: 20px;

    .title{
      font-size: 26px;
      font-weight: bold;
    }
    .title-info{
      line-height: 20px;
      margin: 10px;
      font-size: 16px;
      font-weight: 400;
    }
  }

  .base-container{

    .footer{
      text-align: right;
    }
  }
}
</style>
