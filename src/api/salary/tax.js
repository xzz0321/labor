import request from '@/utils/request'

// 查询工资交税管理列表
export function listTax(query) {
  return request({
    url: '/business/tax/list',
    method: 'get',
    params: query
  })
}

// 查询工资交税管理详细
export function getTax(id) {
  return request({
    url: '/business/tax/' + id,
    method: 'get'
  })
}

// 新增工资交税管理
export function addTax(data) {
  return request({
    url: '/business/tax',
    method: 'post',
    data: data
  })
}

// 修改工资交税管理
export function updateTax(data) {
  return request({
    url: '/business/tax',
    method: 'put',
    data: data
  })
}

// 删除工资交税管理
export function delTax(id) {
  return request({
    url: '/business/tax/' + id,
    method: 'delete'
  })
}

// 导出工资交税管理
export function exportTax(query) {
  return request({
    url: '/business/tax/export',
    method: 'get',
    params: query
  })
}