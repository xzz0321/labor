// 个人缴费-退款
import request from '@/utils/request'

// 查询缴费记录信息列表
export function listMessage (data) {
  return request({
    url: '/pay/record/list',
    method: 'post',
    data: data
  })
}

// 退款
export function delMessage (data) {
  return request({
    url: '/pay/record/updateStatus',
    method: 'post',
    data: data
  })
}

// 导出缴费记录信息
export function exportMessage (query) {
  return request({
    url: '/pay/record/export',
    method: 'get',
    params: query
  })
}

// 回显退款状态
export function selectMessage (datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].value == ('' + value)) {
      actions.push(datas[key].name);
      return false;
    }
  })
  return actions.join('');
}

// 获取所有派遣公司
export function getDispatch () {
  return request({
    url: '/pay/record/companyList',
    method: 'get'
  })
}

// 获取用工单位
export function getEmployee (data) {
  return request({
    url: '/pay/record/employeeList',
    method: 'post',
    data: data
  })
}

// 回显派遣公司字典
export function selectDispatch (datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dispatchingId == ('' + value)) {
      actions.push(datas[key].companyName);
      return false;
    }
  })
  return actions.join('');
}

// 回显用工单位字典
export function selectEmployee (datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].companyNumber == ('' + value)) {
      actions.push(datas[key].companyName);
      return false;
    }
  })
  return actions.join('');
}