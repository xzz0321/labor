import request from '@/utils/request'

// 查询缴费记录信息列表
export function listMessage (query) {
  return request({
    url: '/pay/record/list',
    method: 'get',
    params: query
  })
}

// 退款
export function delMessage (id) {
  return request({
    url: '/pay/record/updateStatus' + id,
    method: 'post',
    date: data
  })
}

// 导出缴费记录信息
export function exportMessage (query) {
  return request({
    url: '/business/message/export',
    method: 'get',
    params: query
  })
}