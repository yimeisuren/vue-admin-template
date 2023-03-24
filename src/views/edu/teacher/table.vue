<template>
    <div class="app-container">

        <!--
        用于进行条件查询的表单
        :inline 表示单行显示

        -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="姓名" autocomplete="on">
                <!--el-input表示是element-ui定义的输入框-->
                <el-input v-model="teacherQueryObject.name" placeholder="姓名">
                </el-input>
            </el-form-item>

            <el-form-item label="头衔">
                <!--el-select表示是element-ui定义的选择框-->
                <el-select v-model="teacherQueryObject.level" placeholder="头衔">
                    <el-option label="高级讲师" :value="1"></el-option>
                    <el-option label="首席讲师" :value="2"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="开始时间">
                <el-col>
                    <el-date-picker type="datetime"
                                    placeholder="选择日期时间"
                                    v-model="teacherQueryObject.begin"
                                    style="width: 100%;">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-col>
                    <el-date-picker type="datetime"
                                    placeholder="选择日期时间"
                                    v-model="teacherQueryObject.end"
                                    style="width: 100%;">
                    </el-date-picker>
                </el-col>
            </el-form-item>

            <el-form-item>
                <!--重点: 提交表单的功能需要添加上()-->
                <el-button type="primary" @click="handlePageQuery()">查询</el-button>
                <el-button type="default" @click="resetQuery()">清空</el-button>
            </el-form-item>
        </el-form>


        <!--Element-ui中定义的table组件-->
        <!--:data绑定一个数组, Element-ui会对该数组进行遍历-->
        <el-table
            :data="list"
            element-loading-text="Loading..."
            border
            fit
            highlight-current-row>

            <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index }}
                </template>
            </el-table-column>

            <!--
            label: 页面显示的内容
            prop: 对应response.data.rows中单个对象的属性
            -->
            <el-table-column align="center" label="ID" prop="id">
            </el-table-column>

            <el-table-column align="center" label="姓名" prop="name">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>姓名: {{ scope.row.name }}</p>
                        <p>头衔: {{ scope.row.level === 1 ? '高级' : '首席' }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column label="简介" align="center" prop="intro">
            </el-table-column>

            <!--头衔在数据库中保存的内容是数值, 但实际希望呈现的高级讲师, 初级讲师这种文字内容, 因此需要进一步处理-->
            <el-table-column label="头衔" align="center" prop="level">
                <template slot-scope="scope">
                    <!--
                    scope.row.<prop>来获取属性值
                    ===: 判断类型和值, 例如 '1' === 1 为false
                    ==: 判断值, 例如 '1'== 1为true
                    -->
                    {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
                </template>
            </el-table-column>

            <el-table-column label="入职时间" align="center" prop="gmtCreate">
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!--
                    更新逻辑:
                    1. 路由跳转到表单页面
                    2. 通过id查询到数据, 回显到表单页面上-->
                    <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-edit"
                        @click="updateById(scope.row.id)">编辑
                    </el-button>
<!--                    <router-link :to="'/teacher/update/' + scope.row.id">-->
                    <!--                    </router-link>-->


                    <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click="deleteById(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--
        vue基础知识
        v-bind: 可以简写为":", 表示单向绑定
        v-on: 可以简写为"@", 表示绑定操作对应的时间
        -->

        <!--
        element-ui中和分页插件相关的事件定义
        1. @size-change: pageSize 改变时会触发
        2. @current-change: currentPage 改变时会触发
        3. @prev-click: 用户点击上一页按钮改变当前页后触发
        4. @next-click: 用户点击下一页按钮改变当前页后触发

        重点注意: page-sizes会覆盖掉page-size属性
        -->
        <el-pagination
            @size-change="handlePageQuery"
            @current-change="handlePageQuery"
            @prev-click="handlePageQuery"
            @next-click="handlePageQuery"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            background
            layout="total, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
import teacher from '@/api/edu/teacher'

export default {
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },

    // 定义页面或方法中需要使用的变量
    data() {
        return {
            list: null,
            total: 0,

            // 下面三个和带分页的条件查询的接口对应
            // 当前页
            currentPage: 0,
            // 每页数量
            pageSize: 0,
            // 用于进行条件查询的对象
            teacherQueryObject: {
                name: null,
                level: null,
                begin: null,
                end: null
            },
        }
    },

    // 页面渲染前执行, 初始化方法
    created() {
        // todo: 默认进行一次全部的查询(这里可以进行优化)
        this.handlePageQuery(1)
    },

    // 定义页面中的方法, 用来调用api中的接口
    methods: {
        // 调用后端api的方法
        handlePageQuery(currentPage = 1, pageSize = 3) {
            // 接收页码参数和页面大小参数
            this.currentPage = currentPage
            this.pageSize = pageSize

            teacher.pageQuery(this.currentPage, this.pageSize, this.teacherQueryObject)
                //.then()方法中处理成功请求
                .then(response => {
                    // response表示接口返回的数据
                    console.log(response)
                    // 用页面内定义的变量接收返回结果
                    this.list = response.data.rows
                    this.total = response.data.total
                })
                //.catch()方法中处理失败请求
                .catch(error => {
                    console.log(error)
                })
        },

        // 用于表格的操作
        updateById(id) {
            this.$message({
                message: '希望成功进行跳转',
                type: 'success'
            })
            // 路由跳转
            this.$router.push({path: `/teacher/update/${id}`})
        },

        deleteById(id) {
            // 确认消息框
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //实际调用删除操作
                teacher.deleteById(id)
                // todo: 需要进行刷新, 但是为什么没有更新
                // todo: 存在bug, 为什么需要点击两次才能够成功删除
                // todo: 分页组件部分应该存在bug, 查询第2页的时候不会刷新内容
                this.handlePageQuery(this.getCurrentPageAfterHandleDelete())

                //删除成功后输出消息提示
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                console.log("取消删除!")
            })
        },

        /**
         * 清空查询条件
         */
        resetQuery() {
            this.teacherQueryObject = {}
            // 执行一次查询首页
            this.handlePageQuery()
        },


        getCurrentPageAfterHandleDelete() {
            //1. 如果删除的是第一个页面内的数据, 那么直接返回this.currentPage即可
            if (this.total < this.pageSize) {
                return this.currentPage
            }
            //2. 如果删除的页面是最后一个页面的最后一个数据, 那么返回的currentPage需要减1
            if (this.total % this.pageSize === 1 && this.total / this.pageSize === this.currentPage - 1) {
                return this.currentPage - 1
            }
            return this.currentPage
        }

    }
}
</script>

