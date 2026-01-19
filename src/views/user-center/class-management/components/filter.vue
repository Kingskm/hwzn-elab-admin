<template>
  <div class="filter-container">
    <el-form :inline="true" :model="formInline" required size="mini">
      <el-form-item label="院系">
				<el-select v-model="formInline.departmentId" placeholder="请选择院系" filterable clearable>
          <el-option 
            v-for="item in departmentList" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id"
            ></el-option>
        </el-select>
			</el-form-item>
      <el-form-item label="名称">
				<el-input v-model="formInline.name" placeholder="请输入名称" clearable></el-input>
			</el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="search">查询</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="reset">清空</el-button>
        <slot name="add"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { 
  api_getDepartmentList 
} from '@/api/user-center'
export default {
  props: {
    filter: {
      type: Object
    },
  },
  data() {
    return {
      formInline:this.filter,
      departmentList:[],
    }
  },
  created(){
    this.getDepartmentList()
  },
  methods: {

    //获取院系列表
    getDepartmentList(){
      api_getDepartmentList()
        .then((res)=>{
          if(res && res.code===0){
            this.departmentList=res.data.records
          }
        })
    },

    //查询
    search(){
      this.$emit('search', this.formInline)
    },
    //清空
    reset () {
      this.formInline.departmentId=""
			this.formInline.name=""
      this.$emit('reset', this.formInline)
    },
  }
}
</script>
