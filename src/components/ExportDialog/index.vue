<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    width="25%"
    top="30vh"
    :close-on-click-modal="true"
    :show-close="true"
    title="导出数据">
    <el-form :model="operationForm" required size="mini">
      <el-form-item label="数据总数">
        {{ operationForm.total }}
      </el-form-item>
      <el-form-item label="最大页数">
        {{ operationForm.maxPageNum }}
      </el-form-item>
      <el-form-item label="导出数据起始页">
        <el-input-number size="mini" v-model="operationForm.startPageNum"  placeholder="请输入起始页" :min="1" :max="operationForm.endPageNum"></el-input-number>
      </el-form-item>
      <el-form-item label="导出数据结束页">
        <el-input-number size="mini" v-model="operationForm.endPageNum" placeholder="请输入结束页" :min="operationForm.startPageNum" :max="operationForm.maxPageNum"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="operationForm.total!=0"> 
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
    }
  },
  methods:{
    //关闭弹窗
    handleClose() {
      this.show=false;
      this.$emit('closeDialog',this.show);
    },

    //确认删除
    confirm(){
      this.handleClose()
      this.$emit('confirm',this.operationForm);
    },
  },
}
</script>
