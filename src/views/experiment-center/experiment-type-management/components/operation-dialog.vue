<template>
  <div class="container">
    <el-dialog
      :visible.sync="show"
      :before-close="handleClose"
      width="700px"
      :title="operation==='add'?'新增':'编辑'"
      :close-on-click-modal="false"
      :show-close="true">
      <el-form :model="form" :rules="rules" ref="form" label-width="50px" >
        <el-form-item label="名称" prop="name">
          <el-input 
            v-model.trim="form.name" 
            placeholder="请输入名称（20字符以内）" 
            maxlength="20">
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="form.seq" :step="1" :min="1" :max="9999"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  api_createType,
  api_updateType,
} from "@/api/common"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type: Object,
    },
    operation:{
			type:String,
		}
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      rules:{
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        seq:[
          { required: true, message: '排序不能为空', trigger: 'change' },
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

    //提交
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.operation==='add'){
            api_createType(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('新增成功')
                  this.handleClose()
                  this.$emit('confirm')
                }
              })
          }else if(this.operation==='edit'){
            api_updateType(this.form)
              .then((res)=>{
                if(res && res.code === 0){
                  this.$message.success('更新成功')
                  this.handleClose()
                  this.$emit('confirm')
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
