<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="25%"
    :close-on-click-modal="true"
    :show-close="true"
    title="提示">
    <el-row>
      <el-col :span="24">
        {{title}}
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer"> 
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
			title:this.operationForm.title,
    }
  },
  methods:{
    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },

    //确认
    confirm(){
      this.handleClose()
      this.$emit('confirm');
    },
  },
}
</script>
