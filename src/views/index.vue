<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">欢迎您！ {{userInfo.name}}</div> -->
    <p class="dashboard-title">数据统计</p>
    <div class="data-list">
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">实验数量</p>
        <p class="data-card-value">{{dataInfo.experimentCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">有效实验次数</p>
        <p class="data-card-value">{{dataInfo.itemResultCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">课程数量</p>
        <p class="data-card-value">{{dataInfo.courseCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">题目数量</p>
        <p class="data-card-value">{{dataInfo.questionCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">考试试卷数量</p>
        <p class="data-card-value">{{dataInfo.testPaperCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">教研资源数量</p>
        <p class="data-card-value">{{dataInfo.resourceCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">活动专题数量</p>
        <p class="data-card-value">{{dataInfo.newsCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">用户数量</p>
        <p class="data-card-value">{{dataInfo.userCount}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">实验合格率</p>
        <p class="data-card-value">{{dataInfo.experimentPassRate}}</p>
      </el-card>
      <el-card class="data-card" shadow="always">
        <p class="data-card-title">试卷合格率</p>
        <p class="data-card-value">{{dataInfo.examPassRate}}</p>
      </el-card>
    </div>
    <p class="dashboard-title">数据分析（平台访问情况和实验操作情况）</p>
    <div class="my-charts">
      <div id="barChart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  api_getPlatFormData
} from "@/api/common"
export default {
  name: 'Dashboard',
  data(){
    return{
      userInfo:JSON.parse(localStorage.getItem('userInfo')) || { name:'游客' },
      dataInfo:{},
      barChart: null,
    }
  },
  created(){
    this.getData()
  },
  mounted() {
    this.barChart = echarts.init(document.getElementById("barChart"));
  },
  methods:{

    getData(){
      api_getPlatFormData()
        .then((res=>{
          if(res && res.code===0){
            this.dataInfo=res.data
            this.init();
          }
        }))
    },

    init() {
      this.barChart.setOption({
        title: {
          text: "平台数据分析",
          textStyle: {
            color: "pink", // 标题颜色
            fontSize: 14, // 默认值：18
            fontStyle: "italic", // normal:正常风格（默认值）,italic:倾斜体
            fontWeight: "bold" // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
          },
          // subtext: "柱状图副标题"
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data:['有效访问','有效实验']
        },
        grid: {
          left: "40px",
          right: "10px",
          bottom: "30px"
        },
        xAxis : [
          {
            type : 'category',
            data : ['本日','本周','本月','本年']
          }
      ],
        yAxis: {
          axisLabel: {
            show: true
          }
        },
        series: [
          {
            name: "有效访问",
            type: "bar", // 设置图表类型为柱状
            data: this.dataInfo.loginArray
          },
          {
            name: "有效实验",
            type: "bar", // 设置图表类型为柱状
            data: this.dataInfo.itemResultArray
          },
        ]
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-title {
    margin: 0 0 20px 0;
    font-size: 26px;
    font-weight: bold;
  }
}
.data-list{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .data-card{
    width: 250px;
    height: 130px;
    margin-right: 50px;
    margin-bottom: 20px;

    .data-card-title{
      font-size: 30px;
      line-height: 40px;
      font-weight: bold;
    }
    .data-card-value{
      font-size: 25px;
      line-height: 50px;
    }
    p{
      margin: 0;
    }
  }
}
.my-charts {
  display: flex;
  > div {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
  }
  div + div {
    margin-left: 10px;
  }
}
</style>
