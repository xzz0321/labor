// 综合统计查询-客户欠费统计
import request from '@/utils/request'

// 查询列表
export function listArrears (query) {
  return request({
    url: '/statistic/info/arrearsList',
    method: 'get',
    params: query
  })
}

// 导出
export function exportArrears (query) {
  return request({
    url: '/statistic/info/arrearsExport',
    method: 'get',
    params: query
  })
}