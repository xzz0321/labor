// 派遣公司业务管理
import request from '@/utils/request'

// 查询派遣公司单位信息列表
export function listInfo (query) {
  return request({
    url: '/business/info/list',
    method: 'get',
    params: query
  })
}

// 查询派遣公司单位信息详细
export function getInfo (dispatchingId) {
  return request({
    url: '/business/info/' + dispatchingId,
    method: 'get'
  })
}

// 新增派遣公司单位信息
export function addInfo (data) {
  return request({
    url: '/business/info',
    method: 'post',
    data: data
  })
}

// 修改派遣公司单位信息
export function updateInfo (data) {
  return request({
    url: '/business/info',
    method: 'put',
    data: data
  })
}

// 删除派遣公司单位信息
export function delInfo (dispatchingId) {
  return request({
    url: '/business/info/' + dispatchingId,
    method: 'delete'
  })
}

// 导出派遣公司单位信息
export function exportInfo (query) {
  return request({
    url: '/business/info/export',
    method: 'get',
    params: query
  })
}