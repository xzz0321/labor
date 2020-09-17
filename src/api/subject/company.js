import request from '@/utils/request'

// 查询用工单位（企业）列表
export function listCompany(query) {
  return request({
    url: '/business/company/list',
    method: 'get',
    params: query
  })
}

// 查询用工单位（企业）列表
export function listCompany2(query) {
  return request({
    url: '/business/company/list2',
    method: 'get',
    params: query
  })
}

// 查询用工单位（企业）详细
export function getCompany(id) {
  return request({
    url: '/business/company/' + id,
    method: 'get'
  })
}

// 新增用工单位（企业）
export function addCompany(data) {
  return request({
    url: '/business/company',
    method: 'post',
    data: data
  })
}

// 修改用工单位（企业）
export function updateCompany(data) {
  return request({
    url: '/business/company',
    method: 'put',
    data: data
  })
}

// 删除用工单位（企业）
export function delCompany(id) {
  return request({
    url: '/business/company/' + id,
    method: 'delete'
  })
}
// 导出用工单位（企业）
export function exportCompany(query) {
  return request({
    url: '/business/company/export',
    method: 'get',
    params: query
  })
}

// 导出用工单位（企业）
export function exportCompany2(query) {
  return request({
    url: '/business/company/export2',
    method: 'get',
    params: query
  })
}