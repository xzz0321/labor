import request from '@/utils/request'

// 查询工资管理列表
export function listManage (query) {
  return request({
    url: '/business/manage/list',
    method: 'get',
    params: query
  })
}

// 查询工资管理详细
export function getManage (id) {
  return request({
    url: '/business/manage/' + id,
    method: 'get'
  })
}

// 新增工资管理
export function addManage (data) {
  return request({
    url: '/business/manage',
    method: 'post',
    data: data
  })
}

// 修改工资管理
export function updateManage (data) {
  return request({
    url: '/business/manage',
    method: 'put',
    data: data
  })
}

// 删除工资管理
export function delManage (id) {
  return request({
    url: '/business/manage/' + id,
    method: 'delete'
  })
}

// 导出工资管理
export function exportManage (query) {
  return request({
    url: '/business/manage/export',
    method: 'get',
    params: query
  })
}