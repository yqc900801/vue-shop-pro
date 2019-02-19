<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-button type="primary" @click="addRoleDialog = true">添加角色</el-button>
      <el-table :data="roleInfos" border style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRole(info.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="delRole(info.row.id)"
            >删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹框 addRolesDialog-->
      <el-dialog title="添加角色" :visible.sync="addRoleDialog" @close="addRoleClose">
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRole">
          <el-form-item label="角色名称" prop="roleName" label-width="80px">
            <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
            <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRoleYes">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑角色弹框 editRolesDialog-->
      <el-dialog title="添加角色" :visible.sync="editRoleDialog" @close="editRoleClose">
        <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRole">
          <el-form-item label="角色名称" prop="roleName" label-width="80px">
            <el-input v-model="editRoleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
            <el-input v-model="editRoleForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="editRoleYes">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleInfos()
  },
  data() {
    return {
      roleInfos: [], //角色列表数据
      addRoleForm: {
        //添加角色
        roleName: '',
        roleDesc: ''
      },
      addRoleDialog: false,
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 编辑角色
      editRoleDialog: false,
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取角色列表数据
    async getRoleInfos() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleInfos = res.data
    },
    // 确定添加角色
    addRoleYes() {
      this.$refs.addRole.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.addRoleForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.addRoleDialog = false
          this.getRoleInfos()
        }
      })
    },
    addRoleClose() {
      this.$refs.addRole.resetFields()
    },
    // 删除角色
    delRole(id) {
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        })
        .catch(() => {})
    },
    // 编辑角色
    async editRole(id) {
      this.editRoleDialog = true
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(res)
      this.editRoleForm = res.data
    },
    editRoleYes() {
      this.$refs.editRole.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'roles/' + this.editRoleForm.roleId,
            this.editRoleForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.editRoleDialog = false
          this.getRoleInfos()
        }
      })
    },
    editRoleClose() {
      this.$refs.editRole.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
