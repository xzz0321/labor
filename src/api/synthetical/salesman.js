// 综综合统计查询-业务员绩效明细列表
import request from '@/utils/request'

// 查询列表
export function listSalesman (data) {
  return request({
    url: '/statistic/info/salesmanList',
    method: 'post',
    data: data
  })
}

// 导出
export function exportSalesman (query) {
  return request({
    url: '/statistic/info/salesmanExport',
    method: 'get',
    params: query
  })
}