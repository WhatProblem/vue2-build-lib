<template>
  <div class="vlist-vue2">
    <div class="container">
      <div class="list-header">
        <div class="header-label" :style="headerLabelStyle">{{ labelName }}</div>
        <div ref="headValue" class="header-value" :style="headerValueStyle" @click="onShowList">
					<span class="vlist-icon">
						<svg t="1651128828208" :class="['v-list-svg-icon', isShowList && 'is-rotate' || '' ]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2416" width="14" height="14"><path d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" p-id="2417" fill="#c0c4cc"></path></svg>
					</span>
          <span v-show="!selectLabel" class="placeholder">{{ placeholder }}</span>
          <span v-show="selectLabel">{{ selectLabel }}</span>
        </div>
      </div>
      <transition name="el-zoom-in-top">
        <div v-show="isShowList" ref="listWrap" class="list-wraper" :style="leftStyle" @scroll="onScroll">
          <div ref="scrollbar" class="scroll-bar">
            <div v-if="!options.length" class="no-data">暂无数据</div>
          </div>
          <div ref="list" class="list">
            <div v-for="(item, index) in showList" :key="index" :style="listEleStyle" :class="['list-ele', isActive(item)]" @click="onSelect(item)">
              <slot :item="item">{{ item.label }}</slot>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VirListV2',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // label 名称
    labelName: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择内容'
    },
    // 传入的数据列表
    options: {
      type: Array,
      default: () => ([])
    },
    labelWidth: {
      type: String,
      default: '72'
    },
    labelPositon: {
      type: String,
      default: 'right'
    },
    headerHeight: {
      type: String,
      default: '30'
    },
    // 默认显示10条数据
    showNum: {
      type: Number,
      default: 10
    },
    // 每一行数据的高度
    lineHeight: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      selectValue: null, // 选中的 value
      start: 0, // 滚动过程开始的索引
      end: 10, // 滚动过程结束的索引

      isShowList: false, // 依赖数据列表

      tempSelectItem: {}, // 弹窗出现，待重新选择时候的临时依赖数据
      onceExec: false, // 控制 watch 的 initScroll 优化函数只执行一次
      isSelected: false, // 控制是否有点击选中过

      eventCb: null // 监听的回调函数
    }
  },
  computed: {
    headerLabelStyle() {
      return {
        width: `${this.labelWidth}px`,
        height: `${this.headerHeight}px`,
        lineHeight: `${this.headerHeight}px`,
        textAlign: this.labelPositon
      }
    },
    headerValueStyle() {
      return {
        height: `${this.headerHeight}px`,
        lineHeight: `${this.headerHeight - 2}px`
      }
    },
    listEleStyle() {
      return {
        height: `${this.headerHeight}px`,
        lineHeight: `${this.headerHeight}px`
      }
    },
    leftStyle() {
      return {
				width: `calc(100% - ${this.labelWidth}px)`,
        left: `${this.labelWidth}px`,
        top: `${Number(this.headerHeight) + 10}px`
      }
    },

    // 计算属性，动态展示的数据
    showList() {
      return this.options.slice(this.start, this.end)
    },

    // 选中value对应的label
    selectLabel() {
      if (this.isShowList || this.isSelected) {
        return this.tempSelectItem.label
      }
      return (this.showList.find(item => item.value === this.selectValue) || {}).label || this.selectValue
    }
  },

  watch: {
    isShowList(cur, prev) {
      if (cur && this.onceExec) {
        this.onceExec = false
        this.$nextTick(() => {
          this.initScroll()
        })
      }
    }
  },

  // mock 数据
  created() {
    this.selectValue = this.$attrs.value
    // // 构造一个超长列表
    // for (let i = 0; i < 5; i++) {
    //   this.list.push({ label: '开发小群组' + i, value: i })
    // }
  },

  mounted() {
    // // 点击页面其他地方隐藏div列表
    // document.addEventListener('click', (e) => {
    //   if (!this.$refs.headValue.contains(e.target)) {
    //     this.isShowList = false
    //   }
    // })
    this.onceExec = true

    this.initWrap()
    this.initValue()
    // 监听事件点击
    this.eventCb = this.clickEmptyClose()
  },

  beforeDestroy() {
    this.eventCb()
    this.eventCb = null
  },

  methods: {
    // 初始化设置容器高度
    initWrap() {
      // 滚动容器的高度
      // this.$refs.listWrap.style.height = this.lineHeight * this.showNum + 'px'
      // this.$refs.listWrap.style['max-height'] = this.lineHeight * this.showNum + 'px'
      this.$refs.listWrap.style['max-height'] = this.lineHeight * this.minValue(this.showNum, this.options.length) + 'px'
      // 计算总的数据需要的高度，构造滚动条高度
      this.$refs.scrollbar.style.height = this.lineHeight * this.options.length + 'px'
    },

    // 获取初始值
    initValue() {
      const index = this.options.findIndex(item => item.value === this.selectValue)
      this.start = (index > -1) && index || 0
      this.end = this.start + this.showNum

      // 初始化回显值的依赖数据
      const temp = this.options.find(item => item.value === this.selectValue) || { label: this.selectValue, value: this.selectValue }
      this.tempSelectItem = JSON.parse(JSON.stringify(temp))
    },

    // 初始化 初始展示的列表数据
    initScroll() {
      const index = this.options.findIndex(item => item.value === this.selectValue)
      this.start = (index > -1) && index || 0
      this.end = this.start + this.showNum

      this.$refs.listWrap.scrollTop = this.start * this.lineHeight

      // 绝对定位相对偏移量
      this.$refs.list.style.top = this.start * this.lineHeight + 'px'
    },

    onScroll() {
      // 获取滚动高度
      const scrollTop = this.$refs.listWrap.scrollTop
      // 开始的数组索引
      this.start = Math.floor(scrollTop / this.lineHeight)
      // 结束索引
      this.end = this.start + this.showNum
      // 绝对定位相对偏移量
      this.$refs.list.style.top = this.start * this.lineHeight + 'px'
    },

    // 点击输入框
    onShowList() {
      this.isShowList = !this.isShowList
    },

    // 选中单行数据
    onSelect(row) {
      this.isSelected = true

      const temp = this.showList.find(item => item.value === row.value) || {}
      this.selectValue = temp.value

      this.tempSelectItem = JSON.parse(JSON.stringify(temp))

      this.$emit('change', this.selectValue)

      this.isShowList = false
    },

    isActive(row) {
      return this.selectValue === row.value && 'active-line' || ''
    },

    /** ********** 公共方法 *****************/

    // 获取最小值
    minValue(...rest) {
      if (!rest.length) {
        throw new Error('比对数值不能为空')
      }
      return Math.min(...rest)
    },

    // 点击空白区域关闭弹框
    clickEmptyClose() {
      const callback = e => {
        const headValue = this.$refs.headValue
        if (headValue) {
          if (!headValue.contains(e.target)) {
            this.isShowList = false
          }
        }
      }

      document.addEventListener('mouseup', callback)

      return () => {
        document.removeEventListener('mouseup', callback)
      }
    }
  }
}
</script>
<style scoped>
.container {
 width: 100%;
 position: relative;
}
.header-label {
 float: left;
 box-sizing: border-box;
 padding-right: 6px;
 font-size: 14px;
 color: #606266;
 font-weight: 700;
}

.header-value {
  cursor: pointer;
  overflow: hidden;
  height: 100%;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
  padding: 0 15px;
  padding-right: 30px;
  position: relative;
  text-align: left;
}

.vlist-icon {
	position: absolute;
	top: 0;
	right: 0;
	width: 28px;
	text-align: center;
	vertical-align: middle;
}

.v-list-svg-icon {
	vertical-align: middle;
	transition: all 0.25s;
}

.is-rotate {
	transform: rotate(180deg);
}

.placeholder {
  color: #DCDFE6;
  font-size: 14px;
}

.list-wraper {
  transform-origin: center top;
	position: absolute;
	z-index: 99999;
	background: #fff;
	overflow-y: auto;
	/* width: 100%; */
	box-sizing: border-box;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.no-data {
 color: #999;
 font-size: 14px;
 text-align: center;
 width: 100%;
 height: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
}
.list {
 width: 100%;
 position: absolute;
 top: 0;
 left: 0;
}

.list-ele {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  text-align: left;
}

.list-ele:hover {
 background: #f5f7fa;
}

.active-line {
  color: #409eff;
}

.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  /* transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) !default; */
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}

.el-zoom-in-top-enter,
.el-zoom-in-top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>