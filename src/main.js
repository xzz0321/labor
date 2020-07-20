import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // 一个可以定制的CSS文件

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'  // permission

import './assets/icons' // icon
import './permission' // permission control 前置路由
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download, handleTree } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination"; // 分页

// 全局方法挂载
Vue.prototype.getDicts = getDicts // 字典数据
Vue.prototype.getConfigKey = getConfigKey // 参数
Vue.prototype.parseTime = parseTime // 日期格式化
Vue.prototype.resetForm = resetForm // 表单重置
Vue.prototype.addDateRange = addDateRange // 添加日期范围
Vue.prototype.selectDictLabel = selectDictLabel // 回显数据字典
Vue.prototype.download = download // 通用下载方法
Vue.prototype.handleTree = handleTree // 构造树型结构数据

// 消息弹框
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // 设置元素的大小，默认中等
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
