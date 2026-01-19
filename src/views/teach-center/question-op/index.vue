<template>
  <div class="container">
    <p class="title">{{operation==='add'?'新增':'编辑'}}</p>
    <div class="base-container">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="题目类型" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择题目类型" filterable clearable>
            <el-option 
              v-for="item in typeList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题型" clearable>
            <el-option 
              v-for="item in questionTypeOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题干" prop="content">
          <el-input 
            v-model.trim="form.content" 
            placeholder="请输入题干（500字以内）" 
            maxlength="500"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}">
          </el-input>
        </el-form-item>

      <!-- 选择 -->
        <div v-if="form.type===2 || form.type===3">
          <el-form-item label="选项A" prop="selectA">
            <el-input 
              v-model.trim="form.selectA" 
              placeholder="请输入选项A（200字以内）" 
              maxlength="200"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}">
            </el-input>
          </el-form-item>
          <el-form-item label="选项B" prop="selectB">
            <el-input 
              v-model.trim="form.selectB" 
              placeholder="请输入选项B（200字以内）" 
              maxlength="200"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}">
            </el-input>
          </el-form-item>
          <el-form-item label="选项C" prop="selectC">
            <el-input 
              v-model.trim="form.selectC" 
              placeholder="请输入选项C（200字以内）" 
              maxlength="200"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}">
            </el-input>
          </el-form-item>
          <el-form-item label="选项D" prop="selectD">
            <el-input 
              v-model.trim="form.selectD" 
              placeholder="请输入选项D（200字以内）" 
              maxlength="200"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}">
            </el-input>
          </el-form-item>
        </div>

        <el-form-item label="答案" prop="answer" v-if="form.type===1">
          <el-radio-group v-model="form.answer">
            <el-radio label="对">对</el-radio>
            <el-radio label="错">错</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="答案" prop="answer" v-if="form.type===2">
          <el-radio-group v-model="form.answer">
            <el-radio v-for="(item,index) in selectList" :key="index" :label="item" >{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="答案" prop="answerList" v-if="form.type===3">
          <el-checkbox-group v-model="form.answerList">
            <el-checkbox v-for="(item,index) in selectList" :key="index" :label="item" ></el-checkbox>
          </el-checkbox-group>
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
import {
  api_getTypeList
} from "@/api/common"
import {
  api_getQuestionInfoById,
  api_createQuestion,
  api_updateQuestion,
} from "@/api/teach-center"
import {
  questionTypeOptions,
} from "@/utils/share"
export default {
  data(){
    return{
      operation:this.$route.query.operation || "add",
      form:{
        answerList:[]
      },
      rules:{
        typeId:[
          { required: true, message: '题目类型不能为空', trigger: 'change' },
        ],
        type:[
          { required: true, message: '题型不能为空', trigger: 'change' },
        ],
        content:[
          { required: true, message: '题干不能为空', trigger: 'change' },
        ],
        selectA:[
          { required: true, message: '选项A不能为空', trigger: 'change' },
        ],
        selectB:[
          { required: true, message: '选项B不能为空', trigger: 'change' },
        ],
        selectC:[
          { required: true, message: '选项C不能为空', trigger: 'change' },
        ],
        selectD:[
          { required: true, message: '选项D不能为空', trigger: 'change' },
        ],
        answer:[
          { required: true, message: '答案不能为空', trigger: 'change' },
        ],
        answerList:[
          { required: true, message: '答案不能为空', trigger: 'change' },
        ],
      },
      typeList:[],
      questionTypeOptions,
      selectList:['A','B','C','D']
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
        module:3,
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

    //获得信息
    getDataInfo(){
      let params={
        id:this.$route.query.id
      }
      api_getQuestionInfoById(params)
        .then((res)=>{
          if(res && res.code===0){
            this.form=res.data
            if(this.form.type===3){
              this.$set(this.form,'answerList',this.form.answer.split("、"))
            }else{
              this.$set(this.form,'answerList',[])
            }
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
          if(this.form.type===1){
            this.form.selectA=""
            this.form.selectB=""
            this.form.selectC=""
            this.form.selectD=""
          }
          if(this.form.type===3){
            this.form.answer=this.form.answerList.sort().join("、")
          }
          if(this.operation==='add'){
            api_createQuestion(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.$router.back()
                }
              })
          }else if(this.operation==='edit'){
            api_updateQuestion(this.form)
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
