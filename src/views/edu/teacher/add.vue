<template>
    <div class="app-container">
        <el-form ref="form" :model="teacherObject" label-width="120px">
            <el-form-item label="姓名">
                <el-input v-model="teacherObject.name"></el-input>
            </el-form-item>
            <el-form-item label="级别">
                <el-select v-model="teacherObject.level" placeholder="请选择讲师级别">
                    <el-option label="高级讲师" value="1"></el-option>
                    <el-option label="首席讲师" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="入职时间">
                <el-col :span="11">
                    <el-date-picker type="datetime" placeholder="选择日期时间" v-model="teacherObject.gmtCreate"
                                    style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>

            <el-form-item label="用户头像上传">
                <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="true"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>


            <el-form-item label="活动性质">
                <el-checkbox-group v-model="teacherObject.type">
                    <el-checkbox-button label="美食/餐厅线上活动" name="type"></el-checkbox-button>
                    <el-checkbox-button label="地推活动" name="type"></el-checkbox-button>
                    <el-checkbox-button label="线下主题活动" name="type"></el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>

            <!--单选框-->
            <el-form-item label="特殊资源">
                <el-radio-group v-model="teacherObject.resource" size="medium">
                    <el-radio border label="线上品牌商赞助"></el-radio>
                    <el-radio border label="线下场地免费"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item size="large">
                <el-button type="primary" @click="saveOrUpdate">保存</el-button>
                <el-button @click="resetTeacher">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import teacher from "@/api/edu/teacher";

export default {
    data() {
        return {
            imageUrl: '',
            teacherObject: {
                name: null,
                intro: null,
                level: null,
                sort: null,
                gmtCreate: null,
            }
        }
    },

    // 用于数据回显, 在哪个页面触发的操作则定义在哪个页面. 例如回显操作由table.vue下的update操作触发, 跳转到当前页面中, 在当前页面add.vue中进行回显操作, 因此回显写在add.vue页面中
    created() {
        this.init()
        // console.log(this.$route.params)
    },

    watch: {
        $route(to, from) {
            this.init()
        }
    },
    methods: {
        // todo: 需要防止重复添加的请求
        saveOrUpdate() {
            // 判断是添加还是修改, 判断条件可以和初始化保持一致
            if (this.isUpdateRouter()) {
                // 更新操作
                teacher.update(this.teacherObject)
            } else {
                // 新增操作
                teacher.add(this.teacherObject)
            }
            // 路由跳转(重定向), 从add.vue页面跳转到table.vue页面
            this.$router.push({path: '/teacher/table'})
            // 显示提示消息
            this.$message({
                    message: '成功',
                    type: 'success'
                }
            )
        },

        resetTeacher() {
            this.teacherObject = {}
        },

        /**
         * 添加的时候不需要进行调用, 而修改的时候需要进行调用回显
         * @param id
         */
        getTeacherById(id) {
            teacher.getById(id)
                .then(response => {
                    // response.data.teacher是根据前后端接口定义确定的
                    this.teacherObject = response.data.teacher
                })
        },

        isUpdateRouter() {
            // 通过this.$route.params.id来获取路由路径上的id变量值
            return this.$route.params && this.$route.params.id
        },

        init() {
            if (this.isUpdateRouter()) {
                this.getTeacherById(this.$route.params.id)
            } else {
                // 两次路由进入的是同一个页面, created()只会触发一次. 需要使用监听来解决
                this.resetTeacher()
            }
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return (isJPG || isPNG) && isLt2M;
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>


<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
