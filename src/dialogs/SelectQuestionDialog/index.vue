<template>
  <div class="container">
    <el-dialog
      :visible.sync="show"
      :before-close="handleClose"
      width="1400px"
      top="10vh"
      :close-on-click-modal="false"
      :show-close="true"
      title="选题"
      class="form">
      <el-form :inline="true" :model="filter" required size="mini">
        <el-form-item label="题目类型">
				<el-select v-model="filter.typeId" placeholder="请选择题目类型" filterable clearable @change="changeFilter">
          <el-option 
            v-for="item in typeList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
        <el-form-item label="题型">
          <el-select v-model="filter.type" placeholder="请选择题型" filterable clearable @change="changeFilter" size="mini">
            <el-option 
              v-for="item in questionTypeOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value"
              ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        class="table"
        :data="tableData"
        max-height="450"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>

        <el-table-column
          prop="typeName"
          label="题目类型"
          align="center"
          min-width="120">
        </el-table-column>

        <el-table-column
          prop="type"
          label="题型"
          align="center"
          width="80">
          <template slot-scope="scope">
            {{questionTypeEnum[scope.row.type]}}
          </template>
        </el-table-column>

        <el-table-column
          prop="content"
          label="题干"
          align="center"
          min-width="350"
          :show-overflow-tooltip="true">
        </el-table-column>

        <el-table-column
          prop="answer"
          label="答案"
          align="center"
          min-width="80">
        </el-table-column>

        <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="160">
      </el-table-column>

      <el-table-column
        prop="createrAccount"
        label="创建人"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          {{scope.row.createrAccount+" "+ (scope.row.createrName || "用户不存在")}}
        </template>
      </el-table-column>

      </el-table>
      <el-pagination
        @current-change="getData"
        :current-page.sync="filter.pageNum"
        :page-size="filter.pageSize"
        background
        layout="prev, pager, next,jumper,total"
        :total="totalCount">
      </el-pagination>
      <div slot="footer" class="dialog-footer"> 
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  api_getTypeList 
} from '@/api/common'
import {
  api_getQuestionList
} from '@/api/teach-center'
import {
  questionTypeOptions,
  questionTypeEnum,
} from '@/utils/share'
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
  },
  data() {
    return {
      show:this.operationShow,
      typeList:[],
      filter:{
        pageNum:1,
        pageSize:100,
        typeId:"",
        type:"",
        startTime:"",
        endTime:"",
        chargerAccount:"",
        sortArray:null,
      },
      tableData:[],  //表格数据
      totalCount:0,
      questionTypeOptions,  //题型选项
      questionTypeEnum,  //题型枚举
      multipleSelection:[],
    }
  },
  created(){
    this.getTypeList()
    this.getData()
  },
  methods:{

    //获取类型列表
    getTypeList(){
      let params={
        pageNum:1,
        pageSize:9999,
        module:3,
        name:"",
        status:"",
        sortArray:[
          {
            field:"seq",
            sort:"ASC"
          }
        ]
      }
      api_getTypeList(params)
        .then((res)=>{
          if(res && res.code===0){
            this.typeList=res.data.records
          }
        })
    },

    //获取数据
    getData(){
      api_getQuestionList(this.filter)
        .then((res)=>{
          if(res && res.code===0){
            this.tableData=res.data.records
            this.totalCount=res.data.total
          }
        })
    },

    //改变筛选项
    changeFilter(){
      this.filter.pageNum=1
      this.getData()
    },

    //选择
    handleSelectionChange(val){
      this.multipleSelection = val;
    },

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },

    //确认
    confirm(){
      if(this.multipleSelection.length){
        let ids=[]
        for(let i=0;i<this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id)
        }
        this.handleClose()
        this.$emit('confirm',ids)
      }
    },
  },
}
</script>
