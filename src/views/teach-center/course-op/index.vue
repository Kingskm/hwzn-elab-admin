<template>
  <div class="container">
    <div class="title-container">
      <span class="title">{{operation==='add'?'新增':'编辑'}}</span>
    </div>
    <div class="base-container">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="课程类别" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择课程类别" clearable style="width:600px">
            <el-option 
              v-for="item in typeList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
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
        <el-form-item label="标签" prop="tag">
          <el-input 
            v-model.trim="form.tag" 
            placeholder="请输入标签（10字符以内）" 
            maxlength="10"
            style="width:400px">
          </el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="chargerAccount">
          <el-select
            v-model="form.chargerAccount"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入负责人名称（模糊查询）"
            :remote-method="searchTeacher"
            :loading="loading"
            style="width:400px">
            <el-option
              v-for="item in form.teacherTeamAccounts?teacherList.filter((item)=>!form.teacherTeamAccounts.includes(item.account)):teacherList"
              :key="item.account"
              :label="`${item.name +' '+item.account}`" 
              :value="item.account">
              <span style="float: left">{{ item.name+" "+item.account }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.departmentName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师团队" prop="teacherTeamAccounts">
          <el-select v-model="form.teacherTeamAccounts" filterable clearable remote multiple :multiple-limit="5" placeholder="请选择教师团队(最多5个)" :remote-method="searchTeacher" :loading="loading" style="width:100%">
            <el-option 
              v-for="item in teacherList.filter((item)=>item.account!==form.chargerAccount)" 
              :key="item.account" 
              :label="`${item.name +' '+item.account}`" 
              :value="item.account">
              <span style="float: left">{{ item.name+" "+item.account }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.departmentName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐实验" prop="recommendExperimentIds">
          <el-select v-model="form.recommendExperimentIds" filterable multiple :multiple-limit="4" placeholder="请选择推荐实验(最多4个)" clearable style="width:100%">
            <el-option 
              v-for="item in experimentList" 
              :key="item.id" 
              :label="`${item.name +' '+item.typeName}`" 
              :value="item.id.toString()">
              <span style="float: left">{{ item.name}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.typeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input 
            v-model.trim="form.des" 
            placeholder="请输入描述（200字以内）" 
            maxlength="200"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}">
          </el-input>
        </el-form-item>
        <el-form-item label="简介视频" prop="introVideo">
          <FileUpload  v-model="form.introVideo" :maxFileSize="500" accept="video/mp4" tip="仅支持MP4视频格式上传,且不超过500M"></FileUpload>
        </el-form-item>
        <el-form-item label="课程介绍">
          <el-tabs tab-position="top">
            <el-tab-pane label="课程目标"><RichText v-model="form.objective"></RichText></el-tab-pane>
            <el-tab-pane label="参考材料"><RichText v-model="form.reference"></RichText></el-tab-pane>
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
import FileUpload from '@/components/FileUpload/index.vue'
import RichText from '@/components/RichText/index.vue'
import {
  api_getTypeList
} from "@/api/common"
import { 
  api_getUserList 
} from '@/api/user-center'
import { 
  api_getExperimentList 
} from '@/api/experiment-center'
import {
  api_getCourseInfoById,
  api_createCourse,
  api_updateCourse,
} from "@/api/teach-center"
export default {
  components: {
    ImageUpload,
    FileUpload,
    RichText,
  },
  data(){
    return{
      operation:this.$route.query.operation || "add",
      form:{},
      rules:{
        typeId:[
          { required: true, message: '类别不能为空', trigger: 'change' },
        ],
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        chargerAccount:[
          { required: true, message: '负责人不能为空', trigger: 'change' },
        ]
      },
      typeList:[],
      teacherList:[],
      loading:false,
      experimentList:[],
    }
  },
  created(){
    this.getTypeList()
    this.getExperimentList()
    if(this.operation==='edit'){
      this.getDataInfo()
    }
  },
  methods:{

    //获取课程信息
    getDataInfo(){
      let params={
        id:this.$route.query.id,
      }
      api_getCourseInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form={
              ...res.data,
              tagList:res.data.tag?res.data.tag.split(','):null,
              teacherTeamAccounts:res.data.teacherTeam?res.data.teacherTeam.split(','):null,
              recommendExperimentIds:res.data.recommendExperiments?res.data.recommendExperiments.split(','):null
            }
            this.getTeacherList(null)
          }
        })
    },

    searchTeacher(query){
      if(query==null || query==""){
        return false;
      }else{
        this.getTeacherList(query)
      }
    },

    //获取教师列表
    getTeacherList(query){
      this.loading = true;
      let params={
        pageNum:1,
        pageSize:9999,
        departmentId:"",
        classId:"",
        account:"",
        name:query,
        role:2,
        status:"",
        sortArray:[
          {
            field:"name",
            sort:"ASC"
          }
        ]
      }
      api_getUserList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.teacherList=res.data.records
          }
        })
        .finally(()=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },10000)
    },

    //获取类别列表
    getTypeList(){
      let params={
        pageNum:1,
        pageSize:999,
        module:2,
        name:"",
        status:"",
        sortArray:[
          {
            field:"seq",
            sort:"ASC"
          }
        ]
      }
      api_getTypeList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.typeList=res.data.records
          }
        })
    },

    //获取实验列表
    getExperimentList(){
      api_getExperimentList()
        .then((res)=>{
          if(res && res.code===0){
            this.experimentList=res.data.records
          }
        })
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
          if(this.form.teacherTeamAccounts){
            this.form.teacherTeam=this.form.teacherTeamAccounts.toString()
          }
          if(this.form.recommendExperimentIds){
            this.form.recommendExperiments=this.form.recommendExperimentIds.toString()
          }
          if(this.operation==='add'){
            api_createCourse(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.$router.back()
                }
              })
          }else if(this.operation==='edit'){
            api_updateCourse(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('保存成功')
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
    display: flex;
    justify-content: space-between;

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
    margin: 20px 0;

    .footer{
      text-align: right;
    }
  }

  .filter{
    margin-top: 20px;
  }

  .teacher-list{
    margin-top: 20px;

    .table{
      text-align: center;
      border-left: 1px solid #ebeef5;
    }
  }

  .el-pagination{
    margin-top: 20px;
    text-align: right;
  }
}
</style>
