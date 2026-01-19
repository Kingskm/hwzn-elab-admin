<template>
  <div class="container">
		<el-dialog
			:visible.sync="show"
			:before-close="handleClose"
			:close-on-click-modal="true"
			:show-close="true"
			title="参赛学员">
			<el-table ref="table" class="table" max-height="480px" :data="tableData" v-loading="loading">

        <el-table-column
          label="序号"
          align="center"
          width="80">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>

        <el-table-column
          prop="departmentName"
          label="院系"
          align="center"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="className"
          label="班级"
          align="center"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="account"
          label="账户"
          align="center"
          minwidth="100">
        </el-table-column>

        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          min-width="100">
        </el-table-column>

      </el-table>
		</el-dialog>
  </div>
</template>

<script>
import {
  api_getCompetitionPlayerListById,
} from "@/api/competition-center"
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
    return {
      show:this.operationShow,
			form:this.operationForm,
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
    }
  },
  created(){
    this.getData()
  },
  methods:{

    //获取数据
    getData(){
      api_getCompetitionPlayerListById(this.form)
        .then((res)=>{
          if(res && res.code===0){
            this.tableData=res.data.records
          }
        })
        .finally((e)=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },5000)
    },

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },
  },
}
</script>
