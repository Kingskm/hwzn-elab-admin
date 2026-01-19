<template>
  <div class="container">
    <p class="title">{{operation==='add'?'新增':'编辑'}}</p>
    <div class="base-container">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="标题" prop="name" style="width:850px">
          <el-input 
            v-model.trim="form.name" 
            placeholder="请输入标题（50字符以内）" 
            maxlength="50"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <ImageUpload :mode="'upload'" v-model="form.cover" :maxImageSize="10"></ImageUpload>
        </el-form-item>
        <el-form-item label="作者" prop="author" style="width:850px">
          <el-input 
            v-model.trim="form.author" 
            placeholder="请输入作者（20字符以内）" 
            maxlength="20"
            clearable>
          </el-input>
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
        <el-form-item label="内容" prop="content">
          <RichText v-model="form.content"></RichText>
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
  api_getNewsInfoById,
  api_createNews,
  api_updateNews,
} from "@/api/news-center"
export default {
  components: {
    ImageUpload,
    RichText,
  },
  data(){
    return{
      operation:this.$route.query.operation || "add",
      baseInfo:{
        id:this.$route.query.id || "",
      },
      form:{},
      rules:{
        name:[
          { required: true, message: '标题不能为空', trigger: 'change' },
        ],
        author:[
          { required: true, message: '作者不能为空', trigger: 'change' },
        ],
        content:[
          { required: true, message: '内容不能为空', trigger: 'change' },
        ],
      },
    }
  },
  created(){
    if(this.operation==='edit'){
      this.getNewsInfo()
    }
  },
  methods:{

    //获取新闻信息
    getNewsInfo(){
      let params={
        id:this.$route.query.id,
        source:1,
      }
      api_getNewsInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form=res.data
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
          if(this.operation==='add'){
            api_createNews(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.$router.back()
                }
              })
          }else if(this.operation==='edit'){
            api_updateNews(this.form)
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
