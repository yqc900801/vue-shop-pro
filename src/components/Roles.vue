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
        <!-- 数据表格展示区域 -->
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 遍历1级权限 -->
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="{'border-bottom':'1px solid #EBEEF5','border-top':k===0?'1px solid #EBEEF5':''}"
            >
              <el-col :span="5">
                <el-tag closable @close="closeTag(info.row.id,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 遍历2级权限 -->
                <el-row
                  v-for="(item2,kk) in item.children"
                  :key="item2.id"
                  :style="{'border-top':kk!==0?'1px solid #EBEEF5':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(info.row,id,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="closeTag(info.row.id,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
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
      <!--分配权限的Dialog对话框-->
      <el-dialog title="分配权限" :visible.sync="distributeDialogVisible" width="50%">
        <el-form ref="distributeFormRef" :model="distributeForm" label-width="120px">
          <el-form-item label="角色名称">{{distributeForm.roleName}}</el-form-item>
          <el-form-item label="供分配权限:">
            <el-tree
              :data="rightsInfo"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="rightsInfoProps"
              :default-checked-keys="defaultCheckedKeys"
              ref="rightsTree"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="distributeRights">确定</el-button>
        </span>
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
      },
      // 给角色分配权限
      distributeDialogVisible: false,
      distributeForm: {
        id: 0,
        roleName: ''
      },
      rightsInfo: [],
      rightsInfoProps: { label: 'authName', children: 'children' },
      defaultCheckedKeys: []
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
    },
    // 给角色移除权限
    closeTag(roleId, rightsId) {
      this.$confirm('确定要删除该权限吗？', '权限删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            'roles/' + roleId + '/rights/' + rightsId
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        })
        .catch(() => {})
    },
    // 给角色分配权限
    async showDistributeDialog(role) {
      this.distributeDialogVisible = true
      this.distributeForm = role
      // 把用户的权限数据取到
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsInfo = res.data
      // 把当前角色所拥有的3级权限获取出来(递归)
      var idArr = []
      this.getHaveRights(role, idArr)
      this.defaultCheckedKeys = idArr
    },
    getHaveRights(node, keys) {
      if (!node.children) {
        return keys.push(node.id)
      }
      node.children.forEach(item => {
        return this.getHaveRights(item, keys)
      })
    },
    // 给角色分配权限
    async distributeRights() {
      // 获取全选的节点的ID信息
      var ids1 = this.$refs.rightsTree.getCheckedKeys()
      // 获取半选节点的ID信息
      var ids2 = this.$refs.rightsTree.getHalfCheckedKeys()
      var allIds = [...ids1, ...ids2].join(',')
      if (!allIds) {
        return this.$message.error('请选择权限')
      }
      const { data: res } = await this.$http.post(
        'roles/' + this.distributeForm.id + '/rights',
        { rids: allIds }
      )
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.distributeDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getRoleInfos()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
