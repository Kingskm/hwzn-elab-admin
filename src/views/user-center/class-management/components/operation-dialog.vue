<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="700px"
    :title="operation==='add'?'新增':'编辑'"
    :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="50px" >
      <el-form-item label="院系" prop="departmentId">
				<el-select v-model="form.departmentId" placeholder="请选择院系" filterable clearable>
          <el-option 
            v-for="item in departmentList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input 
          v-model.trim="form.name" 
          placeholder="请输入名称（20字符以内）" 
          maxlength="20">
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
  api_createClass,
  api_updateClass,
} from '@/api/user-center'
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
    return {
      show:this.operationShow,
      form:this.operationForm,
      rules:{
        departmentId:[
          { required: true, message: '院系不能为空', trigger: 'change' },
        ],
        name:[
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
      },
      departmentList:[],
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
              api_createClass(this.form)
                .then((res)=>{
                  if(res && res.code === 0){
                    this.$message.success('新增成功')
                    this.handleClose()
                    this.$emit('confirm');
                  }
                })
            }else if(this.operation==='edit'){
              api_updateClass(this.form)
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
