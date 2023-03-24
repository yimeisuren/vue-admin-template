import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/edu/teacher/findAllTeacher',
        method: 'get',
        params
    })
}
