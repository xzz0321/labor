// 综合统计查询-客户缴费历史
import request from '@/utils/request'

// 查询列表
export function listHistory (data) {
  return request({
    url: '/statistic/info/historyList',
    method: 'post',
    data: data
  })
}

// 导出
export function exportHistory (query) {
  return request({
    url: '/statistic/info/historyExport',
    method: 'get',
    params: query
  })
}