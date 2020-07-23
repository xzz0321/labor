// 综综合统计查询-社保增减员月报
import request from '@/utils/request'

// 查询列表
export function listSocialSecurity (query) {
  return request({
    url: '/statistic/info/socialSecurityList',
    method: 'get',
    params: query
  })
}

// 导出
export function exportSocialSecurity (query) {
  return request({
    url: '/statistic/info/socialSecurityExport',
    method: 'get',
    params: query
  })
}