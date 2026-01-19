<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :top="`${topHeight}vh`"
    width="1200px"
    title="成绩详情"
    :close-on-click-modal="true"
    :show-close="true">
    <el-form :model="form"  label-width="80px" >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实验分类">
            {{dataInfo.typeName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实验">
            {{dataInfo.experimentName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分项">
            {{dataInfo.itemName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="院系">
            {{dataInfo.departmentName || "-"}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班级">
            {{dataInfo.className || "-"}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实验人">
            {{dataInfo.userName + " " + dataInfo.account}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实验时间">
            {{dataInfo.startTime + " 至 " + dataInfo.endTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实验用时">
            <span v-if="$dayjs.duration($dayjs(dataInfo.endTime).diff($dayjs(dataInfo.startTime))).hours()">{{$dayjs.duration($dayjs(dataInfo.endTime).diff($dayjs(dataInfo.startTime))).hours()+"时"}}</span>
            <span v-if="$dayjs.duration($dayjs(dataInfo.endTime).diff($dayjs(dataInfo.startTime))).minutes()">{{$dayjs.duration($dayjs(dataInfo.endTime).diff($dayjs(dataInfo.startTime))).minutes()+"分"}}</span>
            <span v-if="$dayjs.duration($dayjs(dataInfo.endTime).diff($dayjs(dataInfo.startTime))).seconds()">{{$dayjs.duration($dayjs(dataInfo.endTime).diff($dayjs(dataInfo.startTime))).seconds()+"秒"}}</span>
            <span v-if="dataInfo.endTime===dataInfo.startTime">-</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="得分">
            <span :style="`color:${dataInfo.score<60?'#FF0000':''}`">{{dataInfo.score}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="实验步骤">
            <span v-if="!dataInfo.steps">-</span>
            <span v-if="dataInfo.steps && dataInfo.steps.indexOf('title')<0">{{dataInfo.steps}}</span>
            <div v-if="dataInfo.steps && dataInfo.steps.indexOf('title')>0">
              <el-radio-group v-model="stepIndex" size="mini">
                <el-radio-button :label="index" v-for="(item,index) in JSON.parse(dataInfo.steps)" :key="index">步骤{{index+1}}</el-radio-button>
              </el-radio-group>
              <div class="steps">
                <p>标题：{{JSON.parse(dataInfo.steps)[stepIndex].title}}</p>
                <p>开始时间：{{$dayjs(JSON.parse(dataInfo.steps)[stepIndex].startTime).format('YYYY-MM-DD HH:mm:ss')}}</p>
                <p>结束时间：{{$dayjs(JSON.parse(dataInfo.steps)[stepIndex].endTime).format('YYYY-MM-DD HH:mm:ss')}}</p>
                <p>得分：{{JSON.parse(dataInfo.steps)[stepIndex].score}}（满分：{{JSON.parse(dataInfo.steps)[stepIndex].maxScore}}分）</p>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实验图片">
            <el-image 
                style="width: 100px; height: 100px;margin-top:1rem"
                :src="JSON.parse(dataInfo.imgs)[0]" 
                :preview-src-list="JSON.parse(dataInfo.imgs)"
                v-if="dataInfo.imgs">
              </el-image>
              <p style="margin:0;line-height:1.25rem" v-if="dataInfo.imgs">提示：点击图片放大且可查看更多</p>
              <span v-if="!dataInfo.imgs">-</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实验视频">
            <el-radio-group v-model="videoIndex" size="mini" v-if="dataInfo.videos">
              <el-radio-button :label="index" v-for="(item,index) in JSON.parse(dataInfo.videos)" :key="index">视频{{index+1}}</el-radio-button>
            </el-radio-group>
            <video
              v-bind:src="JSON.parse(dataInfo.videos)[videoIndex]"
              style="width:400px;display:block"
              controls="controls"
              controlsList="nodownload"
              v-if="dataInfo.videos">
              您的浏览器不支持视频播放
            </video>
            <span v-if="!dataInfo.videos">-</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="实验文件">
            <el-select v-model="filePath" placeholder="请选择需要下载的文件" size="mini" v-if="dataInfo.files">
              <el-option 
                v-for="(item,index) in JSON.parse(dataInfo.files)" 
                :key="index" 
                :label="`文件`+(index+1)" 
                :value="item"
                ></el-option>
            </el-select>
            <el-button type="primary" size="mini" style="margin-left:0.625rem" @click="downloadFile" v-if="dataInfo.files && filePath">下载文件</el-button>
            <span v-if="!dataInfo.files">-</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue'
import { 
  api_getItemResultInfoById,
} from "@/api/experiment-center"
export default {
  props:{
    operationShow:{
      type: Boolean,
    },
    operationForm:{
      type:Object,
    },
  },
  components: {
    ImageUpload,
  },
  data() {
    return {
      show:this.operationShow,
      form:this.operationForm,
      dataInfo:{},
      videoIndex:0,
      stepIndex:0,
      filePath:"",
      topHeight:20
    }
  },
  created(){
    this.getData()
  },
  methods:{

    //获取数据
    getData(){
      api_getItemResultInfoById(this.form)
        .then((res)=>{
          if(res && res.code===0){
            this.dataInfo=res.data
            if(this.dataInfo.steps && this.dataInfo.steps.indexOf('title')>0){
              this.topHeight-=5
            }
            if(this.dataInfo.imgs || this.dataInfo.videos){
              this.topHeight-=14
            }
          }
        })
    },

    downloadFile() {
      const loading = this.$loading({
        lock: true,
        text: '处理中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
      }, 20000);
      var img = this.filePath;  //注意需要拼接域名访问哦~
      const url = img;
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", url, true);
      xmlhttp.responseType = "blob";
      xmlhttp.onload = function () {
        if (this.status == 200) {
          const blob = this.response;
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "文件" ;
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

    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },
  },
}
</script>

<style scoped>
.el-form-item{
  margin-bottom: 0;
}
</style>
