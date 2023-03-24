import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        hidden: true,
        children: [{
            path: 'dashboard',
            component: () => import('@/views/dashboard/index')
        }]
    },

    // 侧边栏, 主体框架
    {
        path: '/teacher',
        component: Layout,
        // 重定向到子路由的路径上, 相当于这一个分支的默认展示页面
        redirect: '/teacher/table',
        name: '讲师管理',

        meta: {
            // title 的修改会反映到对应页面上
            title: '讲师管理',
            // icon 是 src/icons/svg 目录下存储的矢量图片
            icon: 'user'
        },

        children: [
            {
                // 子路由的路径: /teacher/table
                // 特别注意path的值前面不能添加 "/", 否则在路由跳转的时候会进入404页面
                path: 'table',
                name: '讲师列表',
                // '@/views/edu/teacher/table' 这些页面从现有的模板中进行拷贝, 或者自己写页面
                component: () => import('@/views/edu/teacher/table'),
                meta: {
                    title: '讲师列表',
                    icon: 'table'
                }
            },

            {
                path: 'add',
                name: '添加讲师',
                component: () => import('@/views/edu/teacher/add'),
                meta: {
                    title: '添加讲师',
                    icon: 'form'
                }
            },

            {
                // :id 表示要接收的参数
                path: 'update/:id',
                name: '编辑讲师',
                component: () => import('@/views/edu/teacher/add'),
                meta: {
                    title: '编辑讲师',
                    noCache: true
                },
                // 不进行显示, 而是复用其它页面
                hidden: true
            },
        ]
    },

    {

        path: '/subject',
        name: '课程分类管理',
        component: Layout,
        redirect: '/subject/tree',
        meta: {
            title: '课程分类管理',
            icon: 'tree'
        },
        children: [
            {
                path: 'tree',
                name: '课程分类列表',
                // '@/views/edu/teacher/table' 这些页面从现有的模板中进行拷贝, 或者自己写页面
                component: () => import('@/views/edu/subject/tree'),
                meta: {
                    title: '课程分类列表',
                    icon: 'tree'
                }
            },

            {
                path: 'add',
                name: '课程分类添加',
                component: () => import('@/views/edu/subject/add'),
                meta: {
                    title: '添加课程分类',
                    icon: 'form'
                }
            },

            {
                path: 'update/:id',
                name: '课程分类更新',
                component: () => import('@/views/edu/subject/add'),
                meta: {
                    title: '更新课程分类',
                    noCache: true
                },
                // 不进行显示, 而是复用其它页面
                hidden: true
            },
        ]
    },

    {
        path: '/form',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Form',
                component: () => import('@/views/form/index'),
                meta: {title: '添加讲师', icon: 'form'}
            }
        ]
    },

    {
        path: '/nested',
        component: Layout,
        redirect: '/nested/menu1',
        name: 'Nested',
        meta: {
            title: 'Nested',
            icon: 'nested'
        },
        children: [
            {
                path: 'menu1',
                component: () => import('@/views/nested/menu1/index'), // Parent router-view
                name: 'Menu1',
                meta: {title: 'Menu1'},
                children: [
                    {
                        path: 'menu1-1',
                        component: () => import('@/views/nested/menu1/menu1-1'),
                        name: 'Menu1-1',
                        meta: {title: 'Menu1-1'}
                    },
                    {
                        path: 'menu1-2',
                        component: () => import('@/views/nested/menu1/menu1-2'),
                        name: 'Menu1-2',
                        meta: {title: 'Menu1-2'},
                        children: [
                            {
                                path: 'menu1-2-1',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                                name: 'Menu1-2-1',
                                meta: {title: 'Menu1-2-1'}
                            },
                            {
                                path: 'menu1-2-2',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                                name: 'Menu1-2-2',
                                meta: {title: 'Menu1-2-2'}
                            }
                        ]
                    },
                    {
                        path: 'menu1-3',
                        component: () => import('@/views/nested/menu1/menu1-3'),
                        name: 'Menu1-3',
                        meta: {title: 'Menu1-3'}
                    }
                ]
            },
            {
                path: 'menu2',
                component: () => import('@/views/nested/menu2/index'),
                meta: {title: 'menu2'}
            }
        ]
    },

    {
        path: 'external-link',
        component: Layout,
        children: [
            {
                path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
                meta: {title: 'External Link', icon: 'link'}
            }
        ]
    },

    {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})
