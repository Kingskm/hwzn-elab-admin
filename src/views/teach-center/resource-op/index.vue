<template>
  <div class="container">
    <p class="title">{{operation==='add'?'新增':'编辑'}}</p>
    <div class="base-container">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="资源类别" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择资源类别" clearable style="width:400px">
            <el-option 
              v-for="item in typeList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type" v-if="operation==='add'">
          <el-select v-model="form.type" placeholder="请选择类型" filterable clearable @change="typeChange">
            <el-option 
              v-for="item in resourceTypeOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input 
            v-model.trim="form.name" 
            placeholder="请输入名称（20字符以内）" 
            maxlength="20"
            style="width:400px"
            clearable>
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
        <el-form-item label="资源" prop="path" v-if="operation==='add' && form.type">
          <FileUpload v-model="form.path" :maxFileSize="maxFileSize" :accept="accept" :tip="tip"></FileUpload>
        </el-form-item>
        <el-form-item label="资源介绍">
          <el-tabs tab-position="top">
            <el-tab-pane label="简介"><RichText v-model="form.intro"></RichText></el-tab-pane>
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
import FileUpload from '@/components/FileUpload/index.vue'
import RichText from '@/components/RichText/index.vue'
import {
  api_getTypeList
} from "@/api/common"
import {
  api_getResourceInfoById,
  api_createResource,
  api_updateResource,
} from "@/api/teach-center"
import {
  resourceTypeOptions
} from "@/utils/share"
export default {
  components: {
    FileUpload,
    RichText,
  },
  data(){
    return{
      operation:this.$route.query.operation || "add",
      form:{},
      rules:{
        typeId:[
          { required: true, message: '资源类别不能为空', trigger: 'change' },
        ],
        type:[
          { required: true, message: '类型不能为空', trigger: 'change' },
        ],
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        path:[
          { required: true, message: '资源不能为空', trigger: 'change' },
        ],
      },
      typeList:[],
      maxFileSize:null,
      accept:null,
      tip:null,
      resourceTypeOptions,
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
        pageSize:999,
        module:4,
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

    //获取信息
    getDataInfo(){
      let params={
        id:this.$route.query.id,
      }
      api_getResourceInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form=res.data
          }
        })
    },

    //类型转变
    typeChange(){
      if(this.form.type===1){
        this.maxFileSize=100
        this.accept="application/*"
        this.tip="文件大小限制不超过100MB"
      }else if(this.form.type===2){
        this.maxFileSize=10
        this.accept="image/*"
        this.tip="文件大小限制不超过10MB"
      }else if(this.form.type===3){
        this.maxFileSize=100
        this.accept="audio/*"
        this.tip="文件大小限制不超过100MB"
      }else if(this.form.type===4){
        this.maxFileSize=1024
        this.accept="video/*"
        this.tip="文件大小限制不超过1GB"
      }else if(this.form.type===5){
        this.maxFileSize=1024
        this.accept="text/*"
        this.tip="文件大小限制不超过1GB"
      }else if(this.form.type===6){
        this.maxFileSize=1024
        this.accept=null
        this.tip="文件大小限制不超过1GB"
      }else{
        this.form.path=""
      }
      this.form.path=""
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
            api_createResource(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.$router.back()
                }
              })
          }else if(this.operation==='edit'){
            api_updateResource(this.form)
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
