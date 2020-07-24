// 综合统计查询-社保月报查询
import request from '@/utils/request'

// 查询列表
export function listMonthly (data) {
  return request({
    url: '/statistic/info/monthlyList',
    method: 'post',
    data: data
  })
}

// 导出
export function exportMonthly (query) {
  return request({
    url: '/statistic/info/monthlyExport',
    method: 'get',
    params: query
  })
}