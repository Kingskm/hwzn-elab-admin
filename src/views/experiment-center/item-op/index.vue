<template>
  <div class="container">
    <div class="title-container">
      <span class="title">{{operation==='add'?'新增':'编辑'}}</span>
    </div>
    <div class="base-container">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="实验类别" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择实验类别" clearable style="width:400px" @change="typeChange">
            <el-option 
              v-for="item in typeList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验" prop="experimentId">
          <el-select v-model="form.experimentId" placeholder="请选择实验" clearable style="width:400px" filterable @change="experimentChange">
            <el-option 
              v-for="item in experimentList" 
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
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="form.seq" :step="1" :min="1" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="前置条件" prop="preconditionList" v-if="itemList.length">
          <el-checkbox-group v-model="form.preconditionList">
            <el-checkbox :label="item.id" v-for="(item,index) in itemList" :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否开启教学" prop="isTeach">
          <el-switch
            v-model="form.isTeach"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="教学内容" prop="teachContent" v-show="form.isTeach===1">
          <RichText v-model="form.teachContent"></RichText>
        </el-form-item>
        <el-form-item label="教学视频" prop="teachVideo" v-show="form.isTeach===1">
          <FileUpload  v-model="form.teachVideo" :maxFileSize="500" accept="video/mp4" tip="仅支持MP4视频格式上传,且不超过500M"></FileUpload>
        </el-form-item>
        <el-form-item label="是否开启训练" prop="isTrain">
          <el-switch
            v-model="form.isTrain"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="训练项目路径" prop="trainPath" v-if="form.isTrain===1">
          <el-button type="primary" size="mini" @click="goUnityLibrary('trainPath')">从课件资源库中选取</el-button>
          <el-input
            v-model.trim="form.trainPath"
            placeholder="请输入训练项目路径（200字符以内）" 
            maxlength="200">
          </el-input>
        </el-form-item>
        <el-form-item label="是否开启考核" prop="isCheck">
          <el-switch
            v-model="form.isCheck"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="考核项目路径" prop="checkPath" v-if="form.isCheck===1">
          <el-button type="primary" size="mini" @click="goUnityLibrary('checkPath')">从课件资源库中选取</el-button>
          <el-input
            v-model.trim="form.checkPath"
            placeholder="请输入考核项目路径（200字符以内）" 
            maxlength="200">
          </el-input>
        </el-form-item>
        <el-form-item label="是否开启编辑器" prop="isSet">
          <el-switch
            v-model="form.isSet"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="编辑器项目路径" prop="setPath" v-if="form.isSet===1">
          <el-button type="primary" size="mini" @click="goUnityLibrary('setPath')">从Unity库中选取</el-button>
          <el-input
            v-model.trim="form.setPath"
            placeholder="请输入编辑器项目路径（200字符以内）" 
            maxlength="200">
          </el-input>
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
import { mapState } from 'vuex'
import ImageUpload from '@/components/ImageUpload/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import RichText from '@/components/RichText/index.vue'
import { 
  api_getTypeList 
} from '@/api/common'
import {
  api_getExperimentList,
  api_getItemList,
  api_getItemInfoById,
  api_createItem,
  api_updateItem,
} from "@/api/experiment-center"
import {
  isOptions,
} from "@/utils/share"
export default {
  computed: {
    ...mapState({
      itemOpInfo:state => state.user.itemOpInfo || JSON.parse(localStorage.getItem('itemOpInfo')) || null,
		}),
  },
  components: {
    ImageUpload,
    FileUpload,
    RichText,
  },
  data(){
    return{
      operation:this.$route.query.operation || "add",
      form:{
        seq:1,
        experimentId:"",
        preconditionList:[]
      },
      rules:{
        typeId:[
          { required: true, message: '实验类别不能为空', trigger: 'change' },
        ],
        experimentId:[
          { required: true, message: '实验不能为空', trigger: 'change' },
        ],
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        seq:[
          { required: true, message: '排序不能为空', trigger: 'change' },
        ],
        trainPath:[
          { required: true, message: '训练项目不能为空', trigger: 'change' },
        ],
        checkPath:[
          { required: true, message: '教学项目不能为空', trigger: 'change' },
        ],
        setPath:[
          { required: true, message: '编辑器项目不能为空', trigger: 'change' },
        ],
      },
      typeList:[],
      experimentList:[],
      itemList:[],
      isOptions,
    }
  },
  created(){
    this.getTypeList()
    if(this.operation==='edit'){
      this.getDataInfo()
      this.getExperimentList()
    }else{
      if(this.itemOpInfo){
        this.getExperimentList()
        this.form=this.itemOpInfo
        if(this.form.experimentId){
          this.getItemList()
        }
      }
    }
  },
  destroyed(){
    if(this.$route.name!=='unity-library'){
      this.$store.commit('user/removeItemOpInfo')
    }
  },
  methods:{

    //获取类别列表
    getTypeList(){
      let params={
        pageNum:1,
        pageSize:9999,
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

    //获取实验列表
    getExperimentList(){
      let params={
        pageNum:1,
        pageSize:999999,
        typeId:this.form.typeId,
        name:"",
        org:"",
        author:"",
        isInner:"",
        status:"",
      }
      api_getExperimentList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.experimentList=res.data.records
          }
        })
    },

    //获取分项列表
    getItemList(){
      let params={
        pageNum:1,
        pageSize:999999,
        typeId:this.form.typeId,
        experimentId:this.form.experimentId,
        name:"",
        isTeach:"",
        isTrain:"",
        isCheck:"",
        isSet:"",
        status:"",
        sortArray:null,
      }
      api_getItemList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.itemList=this.operation==='add'?res.data.records:res.data.records.filter((item)=>{ return item.id!==this.form.id})
          }
        })
    },

    //获取分项信息
    getDataInfo(){
      let params={
        id:this.$route.query.id,
        source:1,
      }
      api_getItemInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form={
              ...res.data,
              preconditionList:res.data.precondition?res.data.precondition.split(',').map(Number):[]
            }
            if(this.itemOpInfo){
              this.form=this.itemOpInfo
            }
            this.getItemList()
          }
        })
    },

    //类型改变
    typeChange(){
      if(this.form.typeId){
        this.getExperimentList()
      }else{
        this.experimentList=[]
      }
      this.form.experimentId=""
      this.itemList=[]
    },

    //实验改变
    experimentChange(){
      if(this.form.experimentId){
        this.getItemList()
      }else{
        this.itemList=[]
      }
      this.form.preconditionList=[]
    },


    //点击操作
    operationOnClick(row,operation){
      if(operation==='cancel'){
        this.$router.back()
      }
    },

    //去unity库
    goUnityLibrary(source){
      this.$store.commit('user/setItemOpInfo',this.form)
      this.$router.push({
        name:'unity-library',
        query:{
          operation:'select',
          source,
        }
      })
    },

    //提交
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.precondition=this.form.preconditionList.sort((a,b)=>a-b).toString()
          if(this.form.isTeach===0){
            this.form.teachContent=""
            this.form.teachVideo=""
          }
          if(this.form.isTrain===0){
            this.form.trainPath=""
          }
          if(this.form.isCheck===0){
            this.form.checkPath=""
          }
          if(this.operation==='add'){
            api_createItem(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.$router.back()
                }
              })
          }else if(this.operation==='edit'){
            api_updateItem(this.form)
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
