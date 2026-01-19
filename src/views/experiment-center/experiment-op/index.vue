<template>
  <div class="container">
    <p class="title">{{operation==='add'?'新增':'编辑'}}</p>
    <div class="base-container">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="实验类别" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择实验类别" filterable clearable style="width:400px">
            <el-option 
              v-for="item in typeList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <ImageUpload :mode="'upload'" v-model="form.cover" :maxImageSize="10"></ImageUpload>
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
        <el-form-item label="单位" prop="organization">
          <el-input 
            v-model.trim="form.organization" 
            placeholder="请输入单位（10字符以内）" 
            maxlength="10"
            style="width:400px">
          </el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input 
            v-model.trim="form.author" 
            placeholder="请输入作者（10字符以内）" 
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
            placeholder="请输入负责人名称"
            :remote-method="searchTeacher"
            :loading="loading"
            style="width:400px">
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
        <el-form-item label="描述" prop="des">
          <el-input 
            v-model.trim="form.des" 
            placeholder="请输入描述（200字以内）" 
            maxlength="200"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}">
          </el-input>
        </el-form-item>
        <el-form-item label="是否校内实验" prop="isInner">
          <el-switch
            v-model="form.isInner"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="简介视频" prop="introVideo">
          <FileUpload  v-model="form.introVideo" :maxFileSize="500" accept="video/mp4" tip="仅支持MP4视频格式上传,且不超过500M"></FileUpload>
        </el-form-item>
        <el-form-item label="教学视频" prop="teachVideo">
          <FileUpload  v-model="form.teachVideo" :maxFileSize="500" accept="video/mp4" tip="仅支持MP4视频格式上传,且不超过500M"></FileUpload>
        </el-form-item>
        <el-form-item label="实验介绍">
          <el-tabs tab-position="top">
            <el-tab-pane label="简介"><RichText v-model="form.intro"></RichText></el-tab-pane>
            <el-tab-pane label="必读"><RichText v-model="form.must"></RichText></el-tab-pane>
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
} from '@/api/common'
import { 
  api_getUserList 
} from '@/api/user-center'
import {
  api_getExperimentInfoById,
  api_createExperiment,
  api_updateExperiment,
} from "@/api/experiment-center"
import {
  isOptions,
} from "@/utils/share"
export default {
  components: {
    ImageUpload,
    FileUpload,
    RichText,
  },
  data(){
    return{
      operation:this.$route.query.operation || "add",
      form:{
        isInner:1,
      },
      rules:{
        typeId:[
          { required: true, message: '类别不能为空', trigger: 'change' },
        ],
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        author:[
          { required: true, message: '负责人不能为空', trigger: 'change' },
        ],
        organization:[
          { required: true, message: '单位不能为空', trigger: 'change' },
        ],
        chargerAccount:[
        { required: true, message: '负责人不能为空', trigger: 'change' },
        ]
      },
      typeList:[],
      teacherList:[],
      isOptions,
      loading:false,
    }
  },
  created(){
    this.getTypeList()
    if(this.operation==='edit'){
      this.getDataInfo()
    }
  },
  methods:{

    //获取类别列表
    getTypeList(){
      let params={
        pageNum:1,
        pageSize:999999,
        module:1,
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

    //获取实验信息
    getDataInfo(){
      let params={
        id:this.$route.query.id,
      }
      api_getExperimentInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form=res.data
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
            if(this.form.tag){
              this.form.tag=this.form.tag.toString()
            }
            if(this.operation==='add'){
              api_createExperiment(this.form)
                .then((res)=>{
                  if(res && res.code === 0){
                    this.$message.success('新增成功')
                    this.$router.back()
                  }
                })
            }else if(this.operation==='edit'){
              api_updateExperiment(this.form)
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
