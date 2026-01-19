<template>
  <div class="container">
    <p class="title">课件资源管理</p>
    <div class="nav">
      <div class="back-icon"  @click="goBack" >
        <i class="el-icon-back"></i>
      </div>
      <div class="path">
        <i class="el-icon-s-home" style="float: left;line-height:30px"></i>
        <el-breadcrumb class="bre" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>unityProjects</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item,i) in parPathList" :key="i" @click="goPage(item)">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
       <div class="refresh-icon" @click="getData">
        <i class="el-icon-refresh-right"></i>
      </div>
    </div>
    <div class="btn-list">
      <el-button icon="el-icon-upload" type="primary" size="mini" @click="operationOnClick({},'upload')" v-if="operation!=='select'">上传</el-button>
      <el-button icon="el-icon-delete" type="danger" size="mini" @click="operationOnClick({},'batch-delete')" v-if="operation!=='select'">批量删除</el-button>
      <el-button icon="el-icon-folder" type="success" size="mini" @click="operationOnClick({},'create-folder')" v-if="operation!=='select'">新建文件夹</el-button>
      <el-button icon="el-icon-finished" type="primary" size="mini" @click="operationOnClick({},'select')" v-if="operation==='select'">选取</el-button>
    </div>

    <el-table class="table" max-height="670" :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="50"
        align="center">
      </el-table-column>

      <el-table-column
        prop="name"
        label="文件名"
        :show-overflow-tooltip="true"
        align="left"
        min-width="300">
        <template slot-scope="scope">
          <div style="cursor: pointer;" @click="goPage(scope.row.name)" v-if="scope.row.type==='文件夹'">
            <el-image :src="folderImg" class="folder"></el-image>
            <span>{{scope.row.name}}</span>
          </div>
          <div v-else>
            <span>{{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="lastModifiedTime"
        label="修改日期"
        align="center"
        width="160">
        <template slot-scope="scope">
          {{$dayjs(scope.row.lastModifiedTime).format('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>

      <el-table-column
        prop="type"
        label="类型"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{scope.row.type}}
        </template>
      </el-table-column>

      <el-table-column
        prop="size"
        label="大小"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='文件夹'"></span>
          <span v-else>{{scope.row.size}}</span>
        </template>
      </el-table-column>

      <el-table-column 
        label="操作"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="operationOnClick(scope.row,'edit')">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="operationOnClick(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <uploadDialog
      v-if="uploadDialogVisible" 
      :operationShow="uploadDialogVisible" 
			:operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="getData"
    ></uploadDialog>
    <operationDialog
      v-if="operationDialogVisible" 
      :operationShow="operationDialogVisible" 
			:operationForm="operationForm"
      @closeDialog="closeDialog"
      :operation="operation"
      @confirm="getData"
    ></operationDialog>
    <ConfirmDialog
      v-if="confirmDialogVisible"
      :operationShow="confirmDialogVisible"
      :operationForm="operationForm"
      @closeDialog="closeDialog"
      @confirm="confirm"
    ></ConfirmDialog>
  </div>
</template>

<script>
import uploadDialog from './components/upload-dialog.vue'
import operationDialog from './components/operation-dialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog'
import { 
  api_getFileList,
  api_deleteFile,
  api_deleteFileByBatch,
} from "@/api/common"
export default {
  components: {
    uploadDialog,
    operationDialog,
    ConfirmDialog,
  },
  data(){
    return{
      folderImg:require('@/assets/img/folder.png'),
      //筛选条件
      filter:{
        path:"unityProjects",
      },
      filterSubmit:{
        path:"unityProjects",
      },
      loading:false,
      tableData:[],  //表格数据
      totalCount:0,  //数据总条数
      operation:this.$route.query.operation || "",  //操作
      operationForm:{},  //操作表单，默认为空
      operationDialogVisible:false,  //操作弹窗显示，默认为false
      confirmDialogVisible:false,  //确认弹窗显示，默认为false
      uploadDialogVisible:false,  //上传弹窗显示，默认为false

      parPathList:[],
      multipleSelection: [],
    }
  },
  created(){
    this.getData()
    this.handleParPath()
  },
  methods:{

    //获取数据
    getData(){
      this.loading=true
      api_getFileList(this.filter)
        .then((res)=>{
          if(res && res.code===0){
            this.tableData=res.data.records
          }
          else{
            this.filter=JSON.parse(JSON.stringify(this.filterSubmit))
            this.handleParPath()
          }
        })
        .finally(()=>{
          this.loading=false
        })
        setTimeout(()=>{
          this.loading=false
        },5000)
    },

    handleParPath(){
      this.parPathList=this.filter.path.split("/")
      this.parPathList.shift()
    },

    goBack(){
      this.parPathList.pop()
      if(this.parPathList.length){
        this.filter.path="unityProjects/"+this.parPathList.join('/')
      }else{
        this.filter.path="unityProjects"
      }
      this.getData()
    },

    goPage(name){
      this.filterSubmit=JSON.parse(JSON.stringify(this.filter))
      this.filter.path=this.filter.path+"/"+name
      this.handleParPath()
      this.getData()
    },

    //关闭窗口
    closeDialog(bool){
      this.uploadDialogVisible=bool
      this.operationDialogVisible=bool;
      this.confirmDialogVisible=bool
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //点击操作
    operationOnClick(row,operation){
      this.operation=operation
      if(operation==='upload'){
        this.operationForm={
          path:this.filter.path,
        }
        this.uploadDialogVisible=true
      }else if(operation==='create-folder'){
        this.operationForm={
          path:this.filter.path,
        }
        this.operationDialogVisible=true
      }else if(operation==='edit'){
        this.operationForm={
          path:row.path,
          name:row.name,
        }
        this.operationDialogVisible=true
      }else if(operation==='delete'){
        this.operationForm={
          path:row.path,
          title:"您确认删除这条记录吗？"
        }
        this.confirmDialogVisible=true
      }else if(operation==='download'){
        this.downloadFile(row.path,row.name)
      }else if(operation==='batch-delete'){
        if(!this.multipleSelection.length){
          this.$message.warning("请先勾选需要删除的文件或者文件夹")
          return false
        }
        let pathList=[]
        this.multipleSelection.forEach(item => {
          pathList.push(item.path)
        });
        this.operationForm={
          path:JSON.stringify(pathList),
          title:`"您确认删除这${pathList.length}条记录吗？"`
        }
        this.confirmDialogVisible=true
      }else if(operation==='select'){
        if(!this.multipleSelection.length){
          this.$message.warning("请选择文件")
          return false
        }
        if(this.multipleSelection.length>1){
          this.$message.warning("不可多选")
          return false
        }
        let file=this.multipleSelection[0]
        if(file.type==='文件夹'){
          this.$message.warning("不支持文件夹类型")
          return false
        }
        const isUnity = file.type === 'html' || file.type==='exe' 
        if (!isUnity) {
          this.$message.error('格式有误!')
          return false
        }
        let obj=this.$store.state.user.itemOpInfo || JSON.parse(localStorage.getItem('itemOpInfo')) || null
        if(obj){
          if(this.$route.query.source==='trainPath'){
            obj.trainPath=this.multipleSelection[0].path
          }else if(this.$route.query.source==='checkPath'){
            obj.checkPath=this.multipleSelection[0].path
          }else if(this.$route.query.source==='setPath'){
            obj.setPath=this.multipleSelection[0].path
          }
        }
        this.$store.commit('user/setItemOpInfo',obj)
        this.$router.back()
      }
    },
    //确认
    confirm(){
      if(this.operation==='delete'){
        api_deleteFile(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.getData()
            }
          })
      }else if(this.operation==='batch-delete'){
        api_deleteFileByBatch(this.operationForm)
          .then((res)=>{
            if(res && res.code===0){
              this.$message.success("删除成功")
              this.getData()
            }
          })
      }
    },
    
    downloadFile(path,name) {
      const loading = this.$loading({
        lock: true,
        text: '处理中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
      }, 20000);
      var img = path;  //注意需要拼接域名访问哦~
      const url = img;
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", url, true);
      xmlhttp.responseType = "blob";
      xmlhttp.onload = function () {
        if (this.status == 200) {
          const blob = this.response;
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = name ;
          //此写法兼容可火狐浏览器
          document.body.appendChild(link);
          const evt = document.createEvent("MouseEvents");
          evt.initEvent("click", false, false);
          link.dispatchEvent(evt);
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
          loading.close()
        }
      };
      xmlhttp.send();
    },
  }
}
</script>

<style lang="scss" scoped>
.container{

  .nav{
    width: 100%;
    height: 30px;
    background-color: #e5e5e6;
    margin-bottom: 20px;
    padding: 0;

    .back-icon{
      display: inline-block;
      width: 40px;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      text-align: center;
      border: 1px solid #e5e5e6;
      background-color: #fff;
      float: left;
      cursor: pointer;
    }
    .path{
      display: inline-block;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      text-align: left;
      padding: 0 10px;

      .bre{
        display: inline-block;
        font-size: 15px;
        line-height: 30px;
        margin-left: 10px;
      }
    }
    .refresh-icon{
      display: inline-block;
      width: 40px;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      text-align: center;
      border: 1px solid #e5e5e6;
      background-color: #fff;
      float: right;
      cursor: pointer;
    }
  }
  .btn-list{
    margin-bottom: 20px;
  }

  .folder{
    width: 19px;
    height: 25px;
    margin-right: 10px;
  }
}
</style>
