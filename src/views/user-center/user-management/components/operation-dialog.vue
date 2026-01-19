<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="700px"
    :title="operation==='add'?'新增':'编辑'"
    :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="50px" >
      <el-form-item label="角色" prop="role">
				<el-select v-model="form.role" placeholder="请选择角色" filterable clearable>
          <el-option 
            v-for="item in roleOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="院系" prop="departmentId">
				<el-select v-model="form.departmentId" placeholder="请选择院系" filterable clearable @change="departmentChange">
          <el-option 
            v-for="item in departmentList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="班级" prop="classId">
				<el-select v-model="form.classId" placeholder="请选择班级" filterable clearable>
          <el-option 
            v-for="item in classList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="账户" prop="account" v-if="operation==='add'">
        <el-input 
          v-model.trim="form.account" 
          placeholder="请输入账户（20字符以内,账户格式仅支持大小写英文和数字）" 
          maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input 
          v-model.trim="form.name" 
          placeholder="请输入名称（10字符以内）" 
          maxlength="10">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  api_getDepartmentList,
  api_getClassList,
  api_createUser,
  api_updateUser,
} from "@/api/user-center"
import {
  roleOptions,
} from "@/utils/share"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type:Object,
    },
    operation:{
			type:String,
		}
  },
  data() {
    var validateAccount = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]{0,}$/
      if (!reg.test(value)) {
        callback(new Error('账户格式仅支持大小写英文和数字'));
      } else {
        callback();
      }
    };
    return {
      show:this.operationShow,
      form:this.operationForm,
      rules:{
        role:[
          { required: true, message: '角色不能为空', trigger: 'change' },
        ],
        account:[
          { required: true, message: '账户不能为空', trigger: 'change' },
          { validator: validateAccount, trigger: 'change' }
        ],
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
      },
      departmentList:[],
      classList:[],
      roleOptions,
    }
  },
  created(){
    this.getDepartmentList()
    if(this.operation==='edit'){
      this.getClassList()
    }
  },
  methods:{

    //获取院系列表
    getDepartmentList(){
      api_getDepartmentList()
        .then((res)=>{
          if(res && res.code===0){
            this.departmentList=res.data.records
          }
        })
    },

    //获取班级列表
    getClassList(){
      let params={
        departmentId:this.form.departmentId,
      }
      api_getClassList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.classList=res.data.records
          }
        })
    },

    //院系改变
    departmentChange(){
      if(this.form.departmentId){
        this.getClassList()
      }else{
        this.classList=[]
      }
      if(this.form.classId){
        this.form.classId=""
      }
    },

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },
    //提交
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.form.role===2 && !this.form.departmentId){
            this.$message.error("教师角色需选择院系！")
            return false
          }
          if(this.form.role===3 && (!this.form.departmentId || !this.form.classId)){
            this.$message.error("学生角色需选择院系和班级！")
            return false
          }
          if(this.operation==='add'){
            api_createUser(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.handleClose()
                  this.$emit('confirm');
                }
              })
          }else if(this.operation==='edit'){
            api_updateUser(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('更新成功')
                  this.handleClose()
                  this.$emit('confirm');
                }
              })
          }
        } else {
          return false;
        }
      });
    },
  },
}
</script>
