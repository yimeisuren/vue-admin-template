import request from '@/utils/request'

export default {

    /**
     * 添加一位教师
     * @param teacherObject 待添加的teacher对象
     */
    add(teacherObject) {
        return request({
            url: `/edu/teacher/add`,
            method: 'post',
            data: teacherObject

        })
    },

    deleteById(id) {
        return request({
            url: `/edu/teacher/delete/${id}`,
            method: 'get'
        })
    },

    getById(id) {
        return request({
            url: `/edu/teacher/get/${id}`,
            method: 'get'
        })
    },

    update(teacherObject) {
        return request({
            url: `/edu/teacher/update`,
            method: 'post',
            data: teacherObject
        })
    }
}