<template>
  <div class="container">
		<el-dialog
			:visible.sync="show"
			:before-close="handleClose"
			:close-on-click-modal="true"
			:show-close="true"
      width="1200px"
			title="查看排名">
			<el-table ref="table" class="table" max-height="480px" :data="tableData" v-loading="loading">

      <el-table-column
        label="排名"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="account"
        label="实验人员"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.userName">{{scope.row.userName + " " + scope.row.account}}</span>
          <span v-else style="color:#F56C6C">用户不存在</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="total"
        label="总分"
        align="center"
        min-width="100">
      </el-table-column>

      </el-table>
		</el-dialog>
  </div>
</template>

<script>
import {
  api_getRankList,
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
      api_getRankList(this.form)
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
