<template>
  <div class="container">
		<el-dialog
			:visible.sync="show"
			:before-close="handleClose"
			:close-on-click-modal="true"
			:show-close="true"
      width="1200px"
			title="查看成绩">
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
        prop="typeName"
        label="实验类别"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="experimentName"
        label="实验"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="itemName"
        label="分项"
        align="center"
        min-width="100">
      </el-table-column>

      <el-table-column
        prop="source"
        label="来源"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{experimentSourceEnum[scope.row.source]}}</span>
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
        prop="score"
        label="得分"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.score<60?'#FF0000':''}`">{{scope.row.score}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="endTime"
        label="实验时间"
        align="center"
        width="160">
      </el-table-column>

      <el-table-column
        prop="timeLong"
        label="实验时长"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span v-if="$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).hours()">{{$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).hours()+"时"}}</span>
          <span v-if="$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).minutes()">{{$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).minutes()+"分"}}</span>
          <span v-if="$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).seconds()">{{$dayjs.duration($dayjs(scope.row.endTime).diff($dayjs(scope.row.startTime))).seconds()+"秒"}}</span>
          <span v-if="scope.row.endTime===scope.row.startTime">-</span>
        </template>
      </el-table-column>

      </el-table>
		</el-dialog>
  </div>
</template>

<script>
import {
  api_fetchItemResultListByCompetition,
} from "@/api/experiment-center"
import {
  experimentSourceEnum
} from "@/utils/share"
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

      experimentSourceEnum,
    }
  },
  created(){
    this.getData()
  },
  methods:{

    //获取数据
    getData(){
      api_fetchItemResultListByCompetition(this.form)
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
