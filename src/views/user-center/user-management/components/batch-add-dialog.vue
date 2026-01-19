<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="700px"
    title="批量新增"
    top="10vh"
    :close-on-click-modal="false"
    v-loading="loading"
    :show-close="true">
    <el-form :model="form" :rules="rules" ref="form" label-width="50px">
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
      <el-form-item label="文档" class="is-required">
        <FileUpload v-model="form.filePath" :maxFileSize="10" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" tip="支持上传EXCEL文档，文档大小限制不超过10M"></FileUpload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="button-list">
      <div>
        <el-button type="text" @click="downTemplate">下载模板</el-button>
      </div>
      <div>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" class="submitBtn" @click="submit('form')">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import FileUpload from '@/components/FileUpload/index.vue'
import {
  api_getDepartmentList,
  api_getClassList,
  api_createUserByBatch,
} from "@/api/user-center"
import {
  roleOptions,
} from "@/utils/share"
export default {
  components: {
    FileUpload,
  },
  props:{
    operationShow:{
      type:Boolean,
    },
    operationForm:{
      type:Object,
    }
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      rules:{
        role:[
          { required: true, message: '角色不能为空', trigger: 'change' },
        ],
      },
      departmentList:[],
      classList:[],
      roleOptions,
      loading:false,
    }
  },
  created(){
    this.getDepartmentList()
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
          if(!this.form.filePath){
            this.$message.error('文档不能为空');
            return false
          }
          api_createUserByBatch(this.form)
            .then((res)=>{
              if(res && res.code === 0){
                this.$message.success('批量新增成功')
                this.handleClose()
                this.$emit('confirm');
              }
            })
            .finally((res)=>{
              this.loading=false
            })
            setTimeout(()=>{
              this.loading=false
            },10000)
          }else {
          return false;
        }
      });
    },
    downTemplate(){
      const iframe = document.createElement("iframe");
      //考虑线上环境是否能找到文件所在路径，
      //就得拿到路由的base（配置单页应用的基本路径）来进行判断
      iframe.src = "/hwzn-elab-admin/static/批量新增用户模版.xlsx";
      iframe.style.display = "none"; // 防止影响页面
      iframe.style.height = 0; // 防止影响页面
      document.body.appendChild(iframe); // 必写，iframe挂在到dom树上才会发请求
      // 定时删除节点
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    },
    
  }
}
</script>
<style scoped lang="scss">
.button-list{
  display: flex;
  justify-content: space-between;
}
</style>