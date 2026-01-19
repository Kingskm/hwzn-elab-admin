<template>
  <div class="container">
    <p class="title">分项管理</p>
    <searchFilter :filter="filter" @search="search" @reset="reset">
      <el-button slot="add" type="primary" icon="el-icon-plus" @click="operationOnClick({},'add')">新增</el-button>
    </searchFilter>

    <el-table ref="table" class="table" max-height="618" :data="tableData" v-loading="loading" @sort-change="sortChange">
      <el-table-column
        label="序号"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{(filterSubmit.pageNum-1)*filterSubmit.pageSize+scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        prop="cover"
        label="封面"
        align="center"
        width="120">
        <template slot-scope="scope">
          <ImageUpload :mode="'watch'" v-model="scope.row.cover" v-if="scope.row.cover"></ImageUpload>
          <span v-if="!scope.row.cover">-</span>
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
        prop="name"
        label="名称"
        align="center"
        sortable="custom"
        min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
          <span v-if="scope.row.tag">
            <el-tag v-for="(item,index) in scope.row.tag.split(',')" :key="index" size="mini" effect="dark">{{item}}</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="seq"
        label="排序"
        align="center"
        sortable="custom"
        width="100">
      </el-table-column>

      <el-table-column
        prop="isTeach"
        label="是否开启教学"
        align="center"
        sortable="custom"
        width="130">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.isTeach===0?'#FF0000':'#00cc00'}`">{{isEnum[scope.row.isTeach]}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="isTrain"
        label="是否开启训练"
        align="center"
        sortable="custom"
        width="130">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.isTrain===0?'#FF0000':'#00cc00'}`">{{isEnum[scope.row.isTrain]}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="isCheck"
        label="是否开启考核"
        align="center"
        sortable="custom"
        width="130">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.isCheck===0?'#FF0000':'#00cc00'}`">{{isEnum[scope.row.isCheck]}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="isSet"
        label="是否开启编辑器"
        align="center"
        sortable="custom"
        width="150">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.isSet===0?'#FF0000':'#00cc00'}`">{{isEnum[scope.row.isSet]}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        align="center"
        sortable="custom"
        width="100">
        <template slot-scope="scope">
          <span :style="`color:${scope.row.status===0?'#FF0000':'#00cc00'}`">{{statusEnum[scope.row.status]}}</span>
        </template>
      </el-table-column>

      <el-table-column 
        label="操作"
        align="center"
        min-width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="operationOnClick(scope.row,'edit')">编辑
          </el-button>
          <el-button
            size="mini"
            :type="`${scope.row.status===0?'success':'danger'}`"
            :icon="`${scope.row.status===0?'el-icon-video-play':'el-icon-video-pause'}`"
            @click="operationOnClick(scope.row,'update-status')">
            {{scope.row.status===0?'启用':'停用'}}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="operationOnClick(scope.row,'delete')"
            v-show="scope.row.status===0">删除
          </el-button>
          <el-button
            size="mini"
            type="info"
            icon="el-icon-tickets"
            @click="operationOnClick(scope.row,'show-opRecord')">操作记录
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-mouse"
            @click="operationOnClick(scope.row,'train')"
            v-if="scope.row.trainPath">训练
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-star-off"
            @click="operationOnClick(scope.row,'check')"
            v-if="scope.row.checkPath">考核
          </el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="operationOnClick(scope.row,'set')"
            v-if="scope.row.setPath">编辑器
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="filterSubmit.pageNum"
      :page-size="filterSubmit.pageSize"
      background
      layout="prev, pager, next,jumper,total,sizes"
      :total="totalCount">
    </el-pagination>
    <ConfirmDialog
      v-if="confirmDialogVisible"
      :operationShow="confirmDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="confirm"
    ></ConfirmDialog>
    <OpRecordDialog
      v-if="opRecordDialogVisible"
      :operationShow="opRecordDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
    ></OpRecordDialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import ImageUpload from '@/components/ImageUpload/index.vue'
import searchFilter from './components/filter.vue'
import ConfirmDialog from '@/components/ConfirmDialog'
import OpRecordDialog from '@/components/OpRecordDialog'
import { 
  api_getItemList,
  api_updateItemStatus,
  api_deleteItem,
} from "@/api/experiment-center"
import {
  statusEnum,
  isEnum,
} from "@/utils/share"
export default {
  components: { 
    searchFilter,
    ImageUpload,
    ConfirmDialog,
    OpRecordDialog
  },
  data(){
    return{
      //筛选条件
      filter:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        typeId:"",
        experimentId:"",
        name:"",
        isTeach:"",
        isTrain:"",
        isCheck:"",
        isSet:"",
        status:"",
      },
      //筛选条件镜像
      filterSubmit:{
        pageNum:1,
        pageSize:10,
        sortArray:null,
        typeId:"",
        experimentId:"",
        name:"",
        isTeach:"",
        isTrain:"",
        isCheck:"",
        isSet:"",
        status:"",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      statusEnum,
      isEnum,

      operation:"",  //操作
      operationForm:{},  //操作表单，默认为空
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      opRecordDialogVisible:false, //操作记录弹窗显示，默认为false
    }
  },
  created(){
    if(localStorage.getItem('filterRecord')){
      let filterRecord = JSON.parse(localStorage.getItem('filterRecord'))
      this.filter=filterRecord.page==='item-management'?filterRecord.filter:this.filter
      localStorage.removeItem('filterRecord')
    }
    this.search()
  },
  methods:{
    //获取数据
    getData(filter){
      this.loading=true
      api_getItemList(filter)
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
    //清空
    reset(){
      this.$refs.table.clearSort()
      this.filter.sortArray=null
      this.search()
    },
    //搜索
    search(){
      //深浅拷贝，赋值不影响原来对象
      this.filterSubmit=JSON.parse(JSON.stringify(this.filter))
      this.getData(this.filterSubmit)
    },
    //换页
    handleCurrentChange(){
      this.getData(this.filterSubmit)
    },
    //换页码
    handleSizeChange(val){
      this.filterSubmit.pageSize=val
      this.getData(this.filterSubmit)
    },
    //关闭窗口
    closeDialog(bool){
      this.confirmDialogVisible=bool
      this.opRecordDialogVisible=bool
    },
    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='add'){
        this.$router.push({
          name:'item-op',
          query:{
            operation,
          }
        })
        this.$store.commit('user/removeItemOpInfo')
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'item-management'}))
      }else if(operation==='edit'){
        this.$router.push({
          name:'item-op',
          query:{
            operation,
            id:row.id
          }
        })
        this.$store.commit('user/removeItemOpInfo')
        localStorage.setItem('filterRecord',JSON.stringify({filter:this.filterSubmit,page:'item-management'}))
      }else if(operation==='update-status'){
        this.updateStatus(row.id,row.status===1?0:1)
      }else if(operation==='delete'){
        this.operationForm={
          id:row.id,
          title:"您确认删除这条记录吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='show-opRecord'){
        this.operationForm={
          pageNum:1,
          pageSize:10,
          tableName:'items',
          dataId:row.id,
          type:1,
          content:'',
          createrAccount:'',
          startTime:"",
          endTime:"",
          sortArray:[
            {
              field:"create_time",
              sort:"DESC"
            }
          ]
        }
        this.opRecordDialogVisible=true
      }else if(operation==='train'){
        let hasQ=row.trainPath.indexOf('?')
        window.open(row.trainPath+(hasQ>0?'&':'?')+"token="+Cookies.get('token')+"&itemId="+row.id+"&type=1",'_blank')
      }else if(operation==='check'){
        let hasQ=row.checkPath.indexOf('?')
        window.open(row.checkPath+(hasQ>0?'&':'?')+"token="+Cookies.get('token')+"&itemId="+row.id+"&type=2",'_blank')
      }else if(operation==='set'){
        let hasQ=row.setPath.indexOf('?')
        window.open(row.setPath+(hasQ>0?'&':'?')+"token="+Cookies.get('token')+"&itemId="+row.id+"&type=3",'_blank')
      }
    },
    //改变状态
    updateStatus(id,status){
      let params={
        id,
        status,
      }
      api_updateItemStatus(params)
        .then((res)=>{
          if(res && res.code===0){
            this.$message.success("更新成功")
            this.handleCurrentChange()
          }
        })
    },
    //确认
    confirm(){
      if(this.operation==='delete'){
        api_deleteItem(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.handleCurrentChange()
            }
          })
      }
    },

    //排序改变
    sortChange(obj){
      if(obj.order){
        this.filter.sortArray=[
          {
            field:obj.prop,
            sort:obj.order==='descending'?'DESC':'ASC',
          }
        ]
      }else{
        this.filter.sortArray=null
      }
      this.search()
    },
  }
}
</script>
<style scoped>
.container /deep/ .el-tag{
  margin-left: 5px;
}
</style>
