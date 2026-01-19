<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="700px"
    title="发布考试"
    :close-on-click-modal="false"
    :show-close="true">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
      <el-form-item label="验证码" prop="code">
        <el-input 
          v-model.trim="form.code" 
          placeholder="请输入验证码（限制为6字符）"
          maxlength="6"
          @input="(value)=>(form.code=value.replace(/[^\a-\z\A-\Z0-9]/g,''))">
        </el-input>
      </el-form-item>
      <el-form-item label="考试时长" prop="duration">
        <el-input-number v-model="form.duration" :step="10" :min="1" :max="9999"></el-input-number>
        <span style="margin-left:10px">分钟</span>
      </el-form-item>
      <el-form-item label="发布方式" prop="method">
				<el-select v-model="form.method" placeholder="请选择发布方式" clearable>
          <el-option 
            v-for="item in examMethodOptions" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="开始时间" prop="startTime" v-if="form.method===2">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:00"
          :picker-options="pickerOptions">
        </el-date-picker>
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
  api_submitExam,
} from "@/api/teach-center"
import {
  examMethodOptions,
} from "@/utils/share"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type: Object,
    },
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      rules:{
        duration:[
          { required: true, message: '考试时长不能为空', trigger: 'change' },
        ],
        method:[
          { required: true, message: '发布方式不能为空', trigger: 'change' },
        ],
      },
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;  // 可选未来天、可选当前天、不可选历史天
        },
      },
      examMethodOptions,
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
          if(this.form.code && this.form.code.length!==6){
            this.$message.error("验证码长度应为6字符")
            return false
          }
          if(this.form.method===1){
            this.form.startTime=null
          }
          api_submitExam(this.form)
            .then((res)=>{
              if(res && res.code === 0){
                this.$message.success('发布成功')
                this.handleClose()
                this.$emit('confirm')
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
