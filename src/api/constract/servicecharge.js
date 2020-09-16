import request from '@/utils/request'

// 查询个人合同列表
export function listServicecharge(query) {
  return request({
    url: '/constract/servicecharge/list',
    method: 'get',
    params: query
  })
}

// 查询个人合同详细
export function getServicecharge(id) {
  return request({
    url: '/constract/servicecharge/' + id,
    method: 'get'
  })
}

// 新增个人合同
export function addServicecharge(data) {
  return request({
    url: '/constract/servicecharge',
    method: 'post',
    data: data
  })
}

// 修改个人合同
export function updateServicecharge(data) {
  return request({
    url: '/constract/servicecharge',
    method: 'put',
    data: data
  })
}

// 删除个人合同
export function delServicecharge(id) {
  return request({
    url: '/constract/servicecharge/' + id,
    method: 'delete'
  })
}

// 导出个人合同
export function exportServicecharge(query) {
  return request({
    url: '/constract/servicecharge/export',
    method: 'get',
    params: query
  })
}