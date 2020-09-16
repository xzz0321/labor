import request from '@/utils/request'

// 查询企业合同和团队合同列表
export function listInfo(query) {
  return request({
    url: '/constract/info/list',
    method: 'get',
    params: query
  })
}

// 查询企业合同和团队合同详细
export function getInfo(id) {
  return request({
    url: '/constract/info/' + id,
    method: 'get'
  })
}

// 新增企业合同和团队合同
export function addInfo(data) {
  return request({
    url: '/constract/info',
    method: 'post',
    data: data
  })
}

// 修改企业合同和团队合同
export function updateInfo(data) {
  return request({
    url: '/constract/info',
    method: 'put',
    data: data
  })
}

// 删除企业合同和团队合同
export function delInfo(id) {
  return request({
    url: '/constract/info/' + id,
    method: 'delete'
  })
}

// 导出企业合同和团队合同
export function exportInfo(query) {
  return request({
    url: '/constract/info/export',
    method: 'get',
    params: query
  })
}