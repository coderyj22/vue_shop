<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="clickAddRole">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 角色列表数据 -->
    <el-table :data="roleList" stripe border>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbottom', 'vcenter', index1 === 0 ? 'bdtop' : '']"
            v-for="(item1, index1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag @close="removeRightsById(scope.row, item1.id)" closable>
                {{ item1.authName }}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <!-- 通过for循环嵌套渲染二级权限 -->
              <el-row
                :class="[index2 !== 0 ? 'bdtop' : '', 'vcenter']"
                v-for="(item2, index2) in item1.children"
                :key="item2.id"
              >
                <!-- 左边这一列二级权限 -->
                <el-col :span="6">
                  <el-tag
                    @close="removeRightsById(scope.row, item2.id)"
                    closable
                    type="success"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    @close="removeRightsById(scope.row, item3.id)"
                    closable
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    >{{ item3.authName }}</el-tag
                  >
                  <!-- <i class="el-icon-caret-right"></i> -->
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editRoles(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="clickDeleteButton(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="warning"
            @click="showSetRightsDialog(scope.row)"
            icon="el-icon-setting"
            size="mini"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 点击编辑按钮 弹出的对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="600px">
      <el-form
        ref="editRolesFormRef"
        :model="editRoleForm"
        :rules="editRoleFormRules"
      >
        <el-form-item label-width="80px" label="角色名字" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label-width="80px" label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击删除按钮 弹出的对话框 -->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="600px">
      <span>此操作不可逆，确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击添加角色 弹出的对话框 -->
    <el-dialog title="提示" :visible.sync="addRoleDialogVisible" width="600px">
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleFormConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="600px"
      :before-close='beforeClose'
      :close-on-click-modal="false"
    >
      <!-- 树形空间 -->
      <el-tree
        ref='treeRef'
        :default-checked-keys="defaultKeys"
        node-key="id"
        default-expand-all
        show-checkbox
        :data="rightsList"
        :props="treeProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogClosed">取 消</el-button>
        <el-button type="primary" @click="setRightsDialogConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  editRole,
  deleteRoleById,
  addRole,
  deleteRoleRightsById,
  getAllRightsTree,
  getRoleRights
} from "network";
export default {
  data() {
    return {
      roleList: [], // 所有角色列表数据
      editDialogVisible: false, // 控制编辑对话框的按钮
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            message: "角色名字是必须填写的",
            tigger: "blur"
          }
        ]
      },
      deleteDialogVisible: false, // 控制删除对话框的按钮
      deleteID: -1,
      addRoleDialogVisible: false, // 控制添加对话框的按钮
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: "角色名称是必填的",
            tigger: "blur"
          }
        ]
      },
      setRightsDialogVisible: false, // 分配权限
      rightsList: [
        // 所有权限的数据
      ],
      treeProps: {
        // 树形控件的属性绑定对象
        children: "children",
        label: "authName"
      },
      defaultKeys: [], // 默认选中的节点id值数组
      roleId:null,  // 分配权限的角色的id
    };
  },
  created() {
    this._getRolesList();
  },
  methods: {
    // 获取权限列表
    _getRolesList() {
      // this.loading = true;
      getRolesList().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取列表数据失败");
        }
        // this.loading = ;
        this.roleList = res.data;
      });
    },
    // 点击编辑角色按钮
    editRoles(info) {
      this.editDialogVisible = true;
      this.editRoleForm = info;
      console.log(info);
    },

    // 编辑角色对话框点击了确定
    editRoleConfirm() {
      // 验证表单
      this.$refs.editRolesFormRef.validate(async valid => {
        if (valid) {
          // 验证通过， 发送请求编辑角色
          const res = await editRole(this.editRoleForm);
          if (res.meta.status === 200) {
            // 编辑成功
            this._getRolesList();
            this.$message.success("编辑成功");
            this.editRoleForm = {};
            this.editDialogVisible = false;
          }
        } else {
          // 验证失败
          this.$message.info("请输入合法的字段");
        }
      });
    },

    // 点击了删除按钮
    clickDeleteButton(id) {
      // 保存信息
      console.log(id);
      this.deleteID = id;
      this.deleteDialogVisible = true;
    },

    // 点击了删除角色对话框的确定按钮
    deleteDialogConfirm() {
      // 发送请求删角色
      deleteRoleById(this.deleteID).then(res => {
        console.log(res);
        if (res.meta.status === 200) {
          this.$message.success("删除成功");
          this.deleteID = -1;
          this.deleteDialogVisible = false;
          this._getRolesList();
        } else {
          this.$message.error("删除失败");
        }
      });
    },

    // 点击了添加角色按钮
    clickAddRole() {
      // 弹出对话框
      this.addRoleDialogVisible = true;
    },

    // 点击了添加角色对话框的确定
    addRoleFormConfirm() {
      // 验证表单
      this.$refs.addRoleFormRef.validate(async valid => {
        if (valid) {
          // 表单验证成功
          const res = await addRole(this.addRoleForm);
          if (res.meta.status === 201) {
            // 添加成功
            this.$message.success("添加成功");
            this.addRoleDialogVisible = false;
            this._getRolesList();
          } else {
            // 添加失败
          }
        } else {
          // 表单验证失败
          this.$message.error("请输入合法的字段");
        }
      });
    },

    // 删除权限按钮被点击
    async removeRightsById(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        // 取消删除
        return this.$message.info("取消了删除");
      }
      deleteRoleRightsById(role.id, rightId).then(res => {
        console.log(res);
        if (res.meta.status === 200) {
          this.$message.success("确认了删除");
          // this._getRolesList()
          role.children = res.data;
        }
      });
    },

    // 显示分配权限的对话框
    showSetRightsDialog(role) {
      // 获取所有权限的数据
      this.roleId = role.id
      getAllRightsTree("tree").then(res => {
        if (res.meta.status === 200) {
          // 获取成功, 将获取到的权限数据保存到data中
          this.rightsList = res.data;
          this.getLeftKeys(role, this.defaultKeys);
          this.setRightsDialogVisible = true;
        } else {
          // 获取失败
        }
      });
    },

    // 通过递归的形式获取角色下3级权限的id，并保存在数组中defaultKeys
    getLeftKeys(node, arr) {
      if (!node.children) {
        // 3级节点
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeftKeys(item, arr);
      });
    },

    // 监听分配权限对话框的关闭事件
    setRightsDialogClosed() {
      this.defaultKeys = [];
      this.setRightsDialogVisible = false;
    },

    // 监听分配权限对话框确定事件
    setRightsDialogConfirm() {
      // this.defaultKeys = [];
      // this.setRightsDialogVisible = false;
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      getRoleRights(this.roleId,idStr).then(res => {
        if(res.meta.status === 200){
          // 分配权限成功
          this.$message.success('分配成功')
          this._getRolesList()
          this.defaultKeys = []
          this.setRightsDialogVisible = false
        }else{
          // 失败
          this.$message.error('分配失败')
        }
      })
    },

    beforeClose(done){
      this.defaultKeys = []
      done()
    }
  }
};
</script>

<style scoped lang="scss">
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
