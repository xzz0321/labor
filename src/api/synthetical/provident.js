// 综合统计查询-公积金月报查询
import request from '@/utils/request'

// 查询列表
export function listProvident (data) {
  return request({
    url: '/statistic/info/providentMonthlyList',
    method: 'post',
    data: data
  })
}

// 导出
export function exportProvident (query) {
  return request({
    url: '/statistic/info/providentMonthlyExport',
    method: 'get',
    params: query
  })
}