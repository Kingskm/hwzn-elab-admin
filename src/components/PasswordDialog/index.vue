<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="480px"
    :close-on-click-modal="false"
    :show-close="operationForm.source==='custom'">
    <div slot="title">
      <p class="title-name">{{operationForm.source==='system'?'初始密码强制修改':'密码修改'}}</p>
      <p class="tip" v-if="operationForm.source==='system'">检测到此账号密码为初始密码，为了预防可能存在的风险，请及时修改密码！</p>
    </div>
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
      <el-form-item label="新密码" prop="newPassowrd">
        <el-input 
          v-model.trim="form.newPassowrd"
          show-password
          placeholder="请输入新密码（20字符以内）" 
          maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input 
          v-model.trim="form.confirmPassword" 
          show-password 
          placeholder="请输入确认密码（20字符以内）" 
          maxlength="20">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose" v-if="operationForm.source==='custom'">取消</el-button>
      <el-button type="primary" @click="submit('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
import { api_updateMyPassword } from "@/api/user-center"
import { goLoginPage } from "@/utils/common.js"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type: Object,
    }
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      //必须包含⼤⼩写字母、数字、特殊字符长度再9-16位之间
      var regex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}");
      if (value === "") {
          callback(new Error("请输⼊新密码"));
      } else if (value.length < 8 || value.length > 20) {
        callback(new Error("请输⼊8~20位新密码"));
      } else if (!regex.test(value)) {
        callback(new Error("新密码必须同时包含字母、数字和特殊字符且⾄少8位"));
      } else {
        callback();
      }
    }
    return {
      show:this.operationShow,
      form:this.operationForm,
      rules:{
        newPassowrd:[
          { required: true, message: '新密码不能为空', trigger: 'change' },
          { required: true, validator: validatePassword , trigger: "change" },
        ],
        confirmPassword:[
          { required: true, message: '确认密码不能为空', trigger: 'change' },
        ],
      },
    }
  },
  methods:{

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },

    //关闭窗口
    closeDialog(bool){
      this.passwordDialogVisible=bool
    },

    //提交
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.form.newPassowrd!==this.form.confirmPassword){
            this.$message.error("错误！前后密码不一致")
            return false
          }
          this.form.password=this.$md5(this.form.newPassowrd)
          delete this.form.newPassowrd
          delete this.form.confirmPassword
          api_updateMyPassword(this.form)
            .then((res)=>{
              if(res && res.code === 0){
                this.$message.success('更新成功')
                this.handleClose()
                Cookies.remove('token')
                localStorage.removeItem("userInfo")
                goLoginPage(location.href)
              }
            })
        } else {
          return false;
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.title-name{
  font-size: 25px;
  font-weight: 600;
  margin: 0;
}
.tip{
  font-size: 10px;
  margin: 10px 0 0 0;
  color: red;
}
</style>
