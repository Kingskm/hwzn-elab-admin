<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
#app{
  font-size: 16px;
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: auto;
}
// ::-webkit-scrollbar{
//   display: none;
// }
.container{
  width: 100%;
  padding: 20px;
  

  .title{
    margin: 0 0 20px 0;
    font-size: 26px;
    font-weight: bold;
  }
  .table{
    text-align: center;
    border: 1px solid #ebeef5;
  }
  .base-container{
    .footer{
      text-align: right;
    }
  }
}
.el-row {
  margin-bottom: 20px;
}
.el-table th {
  background:#1F2D3D;
  color:#fff;
}
.el-table__empty-block{
  border-right: 1px solid #ebeef5;
}
.el-table__body-wrapper tbody tr td:last-child {
  .cell {
    flex-wrap: wrap;
    .el-button {
      margin: 4px;
    }
  }
}
.el-pagination{
  margin-top: 20px;
  text-align: right;
}
.el-pagination__jump{
  margin-right: 20px;
}
.el-dialog__header .el-dialog__title{
  font-size: 25px;
  font-weight: bold;
}
.el-dialog__body{
  padding: 20px;
}
.el-dialog__footer .el-button--primary{
  background: rgba(39, 49, 66, 1);
  border-color: rgba(39, 49, 66, 1);
}
.w-e-toolbar {
  z-index: 2!important;
}
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
.el-upload__tip{
  color: #E6A23C;
  margin-top: 0;
  line-height: 20px;
}
</style>
