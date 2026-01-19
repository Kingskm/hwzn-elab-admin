<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :close-on-click-modal="true"
    :show-close="true"
    width="1200"
    title="操作记录">
    <el-table class="table" max-height="530" :data="tableData" v-loading="loading">
      <el-table-column
        label="序号"
        align="center"
        width="80">
        <template slot-scope="scope">
          {{(filter.pageNum-1)*filter.pageSize+scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="createrAccount"
        label="账户"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.createrName">{{scope.row.createrName + " " + scope.row.createrAccount}}</span>
          <span v-else style="color:#F56C6C">用户不存在</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="content"
        label="操作内容"
        align="center"
        min-width="200"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="操作时间"
        align="center"
        width="200">
      </el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="filter.pageNum"
      :page-size="filter.pageSize"
      background
      layout="prev, pager, next,jumper,total,sizes"
      :total="totalCount">
    </el-pagination>
  </el-dialog>
</template>

<script>
import { api_getDataLogList } from "@/api/log-center"
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
			filter:this.operationForm,
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
      this.loading=true
      api_getDataLogList(this.filter)
        .then((res)=>{
          if(res && res.code===0){
            this.tableData=res.data.records
            this.totalCount=res.data.total
          }
        })
        .finally(()=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },5000)
    },

    //分页
    handleCurrentChange(){
      this.getData()
    },

    //换页码
    handleSizeChange(val){
      this.filter.pageSize=val
      this.getData()
    },

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },
  },
}
</script>
