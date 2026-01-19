<template>
  <div class="container" flex="cross:top" style="flex-wrap: wrap;display:flex;flex-direction: column;padding:0">
    <template v-if="!ifIsDetail">
      <div style="color:#999;font-size:15px" class="empty-image">{{showText}}</div>
    </template>
    <template v-if="this.fileList&&this.fileList.length">
        <div class="image-item" v-for="(file, index) in fileList" :key="index">
          <el-image :src="file.url" :fit="'contain'"></el-image>
          <span class="item-actions">
            <span class="item-actions__item" @click="handlePictureCardPreview(file)"><i class="el-icon-zoom-in"></i></span>
            <span v-if="showDelete" class="item-actions__item" @click="handleRemove(file, index)"><i class="el-icon-delete"></i></span>
          </span>
        </div>
    </template>
    <!-- 无图片时 -->
   <div class="noPicStyle">
    <template v-if="showUpload">
      <el-upload
        class="inner-uploader"
        action="/null/noneed"
        accept="image/png,image/jpg,image/jpeg"
        list-type=""
        :limit="max"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
      ><i class="el-icon-plus"></i>
      </el-upload>
    </template>
   </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false">
      <img width="100%;" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { 
  api_uploadByBase64,
} from '@/api/common.js'
const toFileItem = url => ({
  name: '默认',
  url
})
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: { // 可以是单张图片String，也可以是多张图片String数组
      required: true,
      default: ''
    },
    // 最多图片数量 单张图的时候 !! max==1 value 为string
    max: {
      default: 1,
      type: Number
    },
    // 单张图片大小上限（MB）
    maxImageSize: {
      default: 20,
      type: Number
    },
    // 提示文本 
    text: {
      default: '',
      type: String
    },
    // 查看模式|上传模式
    mode: {
      default: 'upload', // watch upload
      type: String
    },
    // 详情模式不显示尺寸等信息
    isDetail: {
      default: false,
    },
  },
  computed: {
    fileList: {
      get: function () { // 不能使用箭头函数
        if (!this.value) {
          return []
        } else if (this.value instanceof Array) {
          return this.value.map(item => {
            return toFileItem(item.url)
          })
        } else if (typeof this.value === 'string') {
          return [toFileItem(this.value)]
        }
        return []
      },
      set: function (val) {
        let emitImage
        if (this.max === 1) {
          emitImage = (val[0] && val[0].url) || ''
        } else if (this.max > 1) {
          emitImage = val.map(v => ({ url: v.url }))
        }
        this.$emit('input', emitImage)
      }
    },
    showUpload () {
      return this.fileList.length < this.max && this.mode === 'upload'
    },
    showDelete () {
      return this.mode === 'upload'
    },
    showImageList () {
      return !!this.fileList.length
    }
  },
  data () {
    return {
      showText: this.text,
      dialogImageUrl: '',
      dialogVisible: false,
      ifIsDetail: this.isDetail,
    }
  },
  mounted () {
    // console.log(this.value)
  },
  methods: {
    handleRemove (file, index) {
      const _fileList = cloneDeep(this.fileList)
      _fileList.splice(index, 1)
      this.fileList = _fileList
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleBeforeUpload (file, list) {
      let pos=file.name.lastIndexOf('.')
      let type=file.name.toLowerCase().slice(pos+1)
      const isIMG = type === 'jpeg' || type==='png' || type ==='jpg'
      const isLtSize = file.size / 1024 / 1024 < this.maxImageSize
      if (!isIMG) {
        this.$message.error('图片格式有误!')
        return false
      }
      if (!isLtSize) {
        this.$message.error(`上传图片大小不能超过 ${this.maxImageSize}MB!`)
        return false
      }
      const that = this
      const fr = new FileReader(file)
      fr.readAsDataURL(file)
      fr.onload = function () {
				let params={
					base64:this.result,
          type,
				}
        api_uploadByBase64(params).then(res => {
          if(res && res.code===0){
            const _fileList = cloneDeep(that.fileList)
            _fileList.push(toFileItem(res.data.path))
            that.fileList = _fileList
            that.$emit('handleChange',_fileList);
            that.$nextTick()
          }
        })
      }
    },
    handleSuccess (response, file, list) {
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;

  .image-list {
    display: inline-block;
    margin: 0;
    padding: 0;
  }
  .inner-uploader {
    border-style: dashed !important;
  }
  .image-item, .inner-uploader {
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    padding: 5px 5px;
    margin: 0px 0px 0 0px;
    list-style: none;
    border-radius: 5px;
    background: #efefef;
    border: 1px solid #fffbfb;
    .empty-image {
      line-height: 100px;
    }
    &:hover {
      .item-actions {
        display: flex;
      }
    }
    .item-actions {
      display: none;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, .4)
    }
    .item-actions__item {
      margin: 0 10px;
      i {
        color: white;
        &:hover {
          cursor: pointer;
        }
      }
    }
    // .image-del-btn {
    //   display: none;
    //   position: absolute;
    //   top: -10px;
    //   right: -10px;
    // }
  }
}
</style>
