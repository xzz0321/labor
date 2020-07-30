// 派遣公司业务管理-人员管理
import request from '@/utils/request'

// 查询派遣公司单位信息列表
export function listInfo (data) {
  return request({
    url: '/people/management/list',
    method: 'post',
    data: data
  })
}
// 获取所有派遣公司
export function getDispatch () {
  return request({
    url: '/company/choose/list',
    method: 'get'
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

// 新增派遣公司单位信息
export function addInfo (data) {
  return request({
    url: '/people/management',
    method: 'post',
    data: data
  })
}

// 修改派遣公司单位信息
export function updateInfo (data) {
  return request({
    url: '/people/management',
    method: 'post',
    data: data
  })
}

// 删除派遣公司单位信息
export function delInfo (dispatchingId) {
  return request({
    url: '/people/management/' + dispatchingId,
    method: 'delete'
  })
}

// 导入
export function exportTemplate () {
  return request({
    url: '/people/management/importData',
    method: 'post'
  })
}

// 导出
export function exportInfo () {
  return request({
    url: '/people/management/importTemplate',
    method: 'get',
  })
}

// 减员
export function downsizing (personIds) {
  console.log(personIds)
  return request({
    url: '/people/management/depletion',
    method: 'get',
    params: { personIds }
  })
}