// 综合统计查询-客户缴费历史
import request from '@/utils/request'

// 查询列表
export function listHistory (query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 导出
export function exportHistory (query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}