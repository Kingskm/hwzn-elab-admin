<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="700px"
    :title="operation==='add'?'新增':'编辑'"
    :close-on-click-modal="false"
    :show-close="true">
    <el-form :model="form" :rules="rules" ref="form" label-width="50px" >
      <el-form-item label="标题" prop="name">
        <el-input 
          v-model.trim="form.name" 
          placeholder="请输入标题（20字符以内）" 
          maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="图片" prop="cover">
         <ImageUpload :mode="'upload'" v-model="form.cover" :maxImageSize="10"></ImageUpload>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input 
          v-model.trim="form.url" 
          placeholder="请输入链接（200字符以内）" 
          maxlength="200"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}">
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
      <el-form-item label="排序" prop="seq">
        <el-input-number v-model="form.seq" :step="1" :min="1" :max="999"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue'
import { 
  api_createBanner,
  api_updateBanner,
} from "@/api/news-center"
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
  components:{
    ImageUpload,
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      rules:{
        name:[
          { required: true, message: '标题不能为空', trigger: 'change' },
        ],
        cover:[
          { required: true, message: '图片不能为空', trigger: 'change' },
        ],
        url:[
          { required: true, message: '链接不能为空', trigger: 'change' },
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
              api_createBanner(this.form)
                .then((res)=>{
                  if(res && res.code === 0){
                    this.$message.success('新增成功')
                    this.handleClose()
                    this.$emit('confirm')
                  }
                })
            }else if(this.operation==='edit'){
              api_updateBanner(this.form)
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
