// 综合统计查询-客户账单明细
import request from '@/utils/request'

// 查询列表
export function listBill (data) {
  return request({
    url: '/statistic/info/customerList',
    method: 'post',
    data: data
  })
}

// 导出
export function exportBill (query) {
  return request({
    url: '/statistic/info/customerExport',
    method: 'get',
    params: query
  })
}