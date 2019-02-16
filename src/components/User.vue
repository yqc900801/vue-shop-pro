<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getUsersInfo"
            @keyup.enter.native="getUsersInfo"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="100"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column label="状态" width="120">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column prop="caozuo" label="操作" width="200">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-tooltip content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersInfo()
  },
  data() {
    return {
      tableData: [],
      // 查询用户是的参数
      queryParams: {
        query: '',
        pagenum: 1, //当前页码
        pagesize: 3 //每页条数
      },
      // 用户状态
      state: true,
      total: 0
    }
  },
  methods: {
    async getUsersInfo() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的数据赋值给表格数据
      this.tableData = res.data.users
      // 总条数
      this.total = res.data.total
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.queryParams.pagesize = val
      this.getUsersInfo()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.queryParams.pagenum = val
      this.getUsersInfo()
    },
    async changeState(id, type) {
      const { data: res } = await this.$http.put(`users/${id}/state/${type}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message({
        message: '修改成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
}
</style>
