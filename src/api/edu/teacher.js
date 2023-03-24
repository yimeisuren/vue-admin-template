import request from '@/utils/request'

// 导出为一个对象(例如为teacher), 可以通过teacher.pageQuery来调用方法, 不需要import {pageQuery, add, logout} from '@/api/edu/teacher'
export default {
    /**
     * 讲师管理模块的带分页的条件查询
     * @param current 当前页
     * @param pageSize 每页记录数
     * @param queryObject 条件查询对象
     * @returns {AxiosPromise}
     */
    pageQuery(pageSize, current, queryObject) {
        return request({
            // 通过路径进行传递值
            url: `/edu/teacher/pageTeacherCondition/${pageSize}/${current}`,
            method: 'post',
            // data 的作用是将对象转为json
            // 通过 post 请求体进行传递值, 对应后端的 @RequestBody (将json数据变为对象)
            data: queryObject

        })
    },


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