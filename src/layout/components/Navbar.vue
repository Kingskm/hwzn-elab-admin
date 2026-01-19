<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <span class="name">{{userInfo.name}}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item class="dropdown-item" command="1">
            返回前台
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-item" command="2">
            密码修改
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-item" command="3">
            账户日志
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-item" command="4">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <PasswordDialog
      v-if="passwordDialogVisible" 
      :operationShow="passwordDialogVisible" 
      :operationForm="operationForm"
      @closeDialog="closeDialog"
    ></PasswordDialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import PasswordDialog from'@/components/PasswordDialog'
import { 
	goLoginPage,
  goClientPage,
} from '@/utils/common'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    PasswordDialog
  },
  data(){
    return{
      userInfo:JSON.parse(localStorage.getItem('userInfo')),
      sidebar:this.$store.state.app.sidebar,
      
      operationForm:{},
      passwordDialogVisible:false,  //密码修改弹窗显示，默认为false
    }
  },
  created(){
    if(this.userInfo.isNeedUpdatePassword){
      this.operationForm={
        id:this.userInfo.id,
        source:'system'
      }
      this.passwordDialogVisible=true
    }
  },
  methods: {
    handleCommand(command){
      if(command==='1'){
        goClientPage(window.location.href)
      }else if(command==='2'){
        this.operationForm={
          source:'custom'
        }
        this.passwordDialogVisible=true
      }else if(command==='3'){
        this.$router.push({
          name:'account-log'
        })
      }else if(command==='4'){
        this.userInfo=null
        localStorage.removeItem("userInfo")
				Cookies.remove("token")
        goLoginPage(location.href)
      }
    },

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    //关闭窗口
    closeDialog(bool){
      this.passwordDialogVisible=bool
    },
  }
}
</script>

<style lang="scss" scoped>
.el-popper{
  margin-top: -10px;
}
.el-dropdown-menu__item{
  padding: 0 31px;
  line-height: 22px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        height: 50px;
        display: flex;
        align-items: center;
        cursor: pointer;

        .user-avatar {
          margin-right: 10px;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .name{
          font-size:16px;
          font-weight:bold;
          margin-right: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.el-popper.user-dropdown{
  margin-top: 5px;
  padding: 0;
  .dropdown-item{
    padding: 5px 25px;
  }
}
</style>
