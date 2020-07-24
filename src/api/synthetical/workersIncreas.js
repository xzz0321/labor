// 综合统计查询-公积金增减员月报
import request from '@/utils/request'

// 查询列表
export function listWorkersIncreas (data) {
  return request({
    url: '/statistic/info/providentList',
    method: 'post',
    data: data
  })
}

// 导出
export function exportWorkersIncreas (query) {
  return request({
    url: '/statistic/info/providentExport',
    method: 'get',
    params: query
  })
}