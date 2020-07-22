import request from '@/utils/request'

// 查询用工单位信息列表
export function listUnitinfo (query) {
  return request({
    url: '/business/unitinfo/list',
    method: 'get',
    params: query
  })
}

// 查询用工单位信息详细
export function getUnitinfo (unitId) {
  return request({
    url: '/business/unitinfo/' + unitId,
    method: 'get'
  })
}

// 新增用工单位信息
export function addUnitinfo (data) {
  return request({
    url: '/business/unitinfo',
    method: 'post',
    data: data
  })
}

// 修改用工单位信息
export function updateUnitinfo (data) {
  return request({
    url: '/business/unitinfo',
    method: 'put',
    data: data
  })
}

// 删除用工单位信息
export function delUnitinfo (unitId) {
  return request({
    url: '/business/unitinfo/' + unitId,
    method: 'delete'
  })
}

// 导出用工单位信息
export function exportUnitinfo (query) {
  return request({
    url: '/business/unitinfo/export',
    method: 'get',
    params: query
  })
}