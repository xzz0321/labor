// 综合统计查询-客户欠费统计
import request from '@/utils/request'

// 查询列表
export function listArrears (data) {
  return request({
    url: '/statistic/info/arrearsList',
    method: 'post',
    data: data
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