import request from '@/utils/request'

// 查询合同单位列表
export function listUnit(query) {
  return request({
    url: '/business/unit/list',
    method: 'get',
    params: query
  })
}

// 查询合同单位详细
export function getUnit(id) {
  return request({
    url: '/business/unit/' + id,
    method: 'get'
  })
}

// 新增合同单位
export function addUnit(data) {
  return request({
    url: '/business/unit',
    method: 'post',
    data: data
  })
}

// 修改合同单位
export function updateUnit(data) {
  return request({
    url: '/business/unit',
    method: 'put',
    data: data
  })
}

// 删除合同单位
export function delUnit(id) {
  return request({
    url: '/business/unit/' + id,
    method: 'delete'
  })
}

// 导出合同单位
export function exportUnit(query) {
  return request({
    url: '/business/unit/export',
    method: 'get',
    params: query
  })
}
