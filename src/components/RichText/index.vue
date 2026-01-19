<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'
import { 
  api_uploadByBase64,
} from '@/api/common.js'

export default {
  data() {
    return {
      editor: null,
      info_: null,
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true,
      default: ''
    },
    height:{
      default:'400px',
      type: String,
    }
  },
  watch: {
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    },
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.setEditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    setEditor() {
      this.editor = new wangEditor(this.$refs.toolbar, this.$refs.editor)
      this.editor.config.onchange = (html) => {
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      this.$refs.editor.style.height =this.height
      //上传图片设置
      this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        let pos=resultFiles[0].name.lastIndexOf('.')
        let type=resultFiles[0].name.toLowerCase().slice(pos+1)
        const fr = new FileReader(resultFiles[0])
        fr.readAsDataURL(resultFiles[0])
        fr.onload = function () {
          let params={
            base64:this.result,
            type,
          }
          api_uploadByBase64(params)
          .then(res => {
            if(res && res.code===0){
              insertImgFn(res.data.path)
            }
          })
        }
      }
      //上传视频设置
      this.editor.config.customUploadVideo = function (resultFiles, insertImgFn) {
        let pos=resultFiles[0].name.lastIndexOf('.')
        let type=resultFiles[0].name.toLowerCase().slice(pos+1)
        const fr = new FileReader(resultFiles[0])
        fr.readAsDataURL(resultFiles[0])
        fr.onload = function () {
          let params={
            base64:this.result,
            type,
          }
          api_uploadByBase64(params)
            .then(res => {
              if(res && res.code===0){
                insertImgFn(res.data.path)
              }
          })
        }
      }
      
      // 创建富文本编辑器
      this.editor.create()
    }
  }
}
</script>
<style lang="scss" scoped>
.w-e-text-container{
    height: 700px !important;/*!important是重点，因为原div是行内样式设置的高度300px*/
}
</style>
