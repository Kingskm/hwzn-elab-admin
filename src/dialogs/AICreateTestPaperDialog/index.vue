<template>
  <div class="container">
    <el-dialog
      :visible.sync="show"
      :before-close="handleClose"
      width="700px"
      title="AI组卷"
      :close-on-click-modal="false"
      :show-close="true">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
        <el-form-item label="名称" prop="name">
          <el-input 
            v-model.trim="form.name" 
            placeholder="请输入名称（20字符以内）" 
            maxlength="20">
          </el-input>
        </el-form-item>
        <el-form-item label="判断题" prop="judgeScore">
          <el-input-number v-model="form.judgeCount" :min="0" :max="100" style="margin-right:10px"></el-input-number>题，
          每题<el-input-number v-model="form.judgeScore" :min="0" :max="100" style="margin:0 10px"></el-input-number>分
        </el-form-item>
        <el-form-item label="单选题" prop="radioScore">
          <el-input-number v-model="form.radioCount" :min="0" :max="100" style="margin-right:10px"></el-input-number>题，
          每题<el-input-number v-model="form.radioScore" :min="0" :max="100" style="margin:0 10px"></el-input-number>分
        </el-form-item>
        <el-form-item label="多选题" prop="multiScore">
          <el-input-number v-model="form.multiCount" :min="0" :max="100" style="margin-right:10px"></el-input-number>题，
          每题<el-input-number v-model="form.multiScore" :min="0" :max="100" style="margin:0 10px"></el-input-number>分
        </el-form-item>
        <el-form-item label="总分">
          <span style="margin-left:20px">{{form.judgeScore*form.judgeCount+form.radioScore*form.radioCount+form.multiScore*form.multiCount}}分</span>
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
  api_createTestPaperByAI,
} from "@/api/teach-center"
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
    var judgeScoreChange = (rule, value, callback) => {
      if (this.form.judgeCount>0 && this.form.judgeScore==0) {
        callback(new Error('判断题得分不能为0'));
      } else {
        callback();
      }
    };
    var radioScoreChange = (rule, value, callback) => {
      if (this.form.radioCount>0 && this.form.radioScore==0) {
        callback(new Error('单选题得分不能为0'));
      } else {
        callback();
      }
    };
    var multiScoreChange = (rule, value, callback) => {
      if (this.form.multiCount>0 && this.form.multiScore==0) {
        callback(new Error('多选题得分不能为0'));
      } else {
        callback();
      }
    };
    return {
      show:this.operationShow,
      form:{
        judgeCount:0,
        judgeScore:0,
        radioCount:0,
        radioScore:0,
        multiCount:0,
        multiScore:0,
        type:this.operationForm.type || 1,
        relId:this.operationForm.relId || null,
      },
      rules:{
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        judgeScore:[
          { required: true, message: '判断题分值不能为空', trigger: 'change' },
          { validator: judgeScoreChange, trigger: 'change' },
        ],
        radioScore:[
          { required: true, message: '单选题分值不能为空', trigger: 'change' },
          { validator: radioScoreChange, trigger: 'change' },
        ],
        multiScore:[
          { required: true, message: '多选题分值不能为空', trigger: 'change' },
          { validator: multiScoreChange, trigger: 'change' },
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
          if((this.form.judgeScore*this.form.judgeCount+this.form.radioScore*this.form.radioCount+this.form.multiScore*this.form.multiCount)!==100){
            this.$message.warning("总分不为100分，请合理配置")
            return false
          }
          const loading = this.$loading({
            lock: true,
            text: '智能AI正在努力生成试卷中，请勿操作',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          api_createTestPaperByAI(this.form)
            .then((res)=>{
              if(res && res.code === 0){
                this.$message.success('新增成功')
                this.handleClose()
                this.$emit('confirm')
              }
            })
            .finally(()=>{
              loading.close()
            })
            setTimeout(()=>{
              loading.close()
            },5000)
        } else {
          return false;
        }
      });
    },
  },
}
</script>
