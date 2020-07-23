import request from '@/utils/request'

// 获取所有派遣公司
export function getDispatch () {
  return request({
    url: '/business/info/selectDispatching',
    method: 'get'
  })
}

// 回显派遣公司字典
export function selectDispatch(datas, value) {
	var actions = [];
	Object.keys(datas).map((key) => {
		if (datas[key].number == ('' + value)) {
			actions.push(datas[key].name);
			return false;
		}
	})
	return actions.join('');
}