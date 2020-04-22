<template>
  <div>
    <!-- 用户列表 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            ref="inputSearchRef"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="queryInfo.query"
            clearable
            @clear="_getUsers"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="_getUsers">搜索</el-button>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="电话" prop="mobile" />
        <el-table-column label="角色" prop="role_name" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="165px">
          <template slot-scope="scope">
            <el-tooltip
              content="编辑"
              placement="top-start"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="'mini"
                circle
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="'mini"
                circle
                @click="confirmDelete(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="分配角色"
              placement="top-end"
              effect="dark"
              :enterable="false"
            >
              <el-button
                @click="setRole(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="'mini"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleChangeSize"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalUser"
      >
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="600px"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑/修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="600px"
        :close-on-click-modal="false"
      >
        <el-form
          label-width="70px"
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
        >
          <el-form-item label="用户名">
            <el-input disabled v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="600px"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>当前的用户:{{ userinfo.username }}</p>
          <p>当前的角色:{{ userinfo.role_name }}</p>
          <p>
            分配新角色:
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getUsers,
  userStateChange,
  addUser,
  getUserInfoById,
  editUserInfo,
  deleteUser,
  getRolesList,
  getUserRole
} from "network";
export default {
  name: "Users",
  created() {
    this._getUsers();
  },
  mounted() {
    this.$refs.inputSearchRef.focus();
    // console.log(Vue.config.keyCodes)
    // Vue.config.keyCodes = {
    //   enter:20
    // }
  },
  data() {
    // 验证邮箱
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[A-Za-z0-9_-])+/;
      if (regEmail.test(value)) {
        // 校验通过
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 校验通过
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    // 验证
    return {
      inputSearch: "",
      queryInfo: {
        query: "",
        pagesize: 2,
        pagenum: 1
      },
      userList: [],
      totalUser: -1,
      addDialogVisible: false, // 控制添加对话框的显示与隐藏
      editDialogVisible: false, // 控制编辑对话框的显示与隐藏
      addForm: {
        //添加用户的表单数据
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        //添加表单的验证规则对象
        username: [
          {
            required: "true",
            message: "请输入用户名",
            tigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3-10个字符之间",
            tigger: "blur"
          }
        ],
        password: [
          {
            required: "true",
            message: "请输入用户名",
            tigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6-15个字符之间",
            tigger: "blur"
          }
        ],
        email: [
          {
            required: "true",
            message: "请输入邮箱",
            tigger: "blur"
          },
          {
            validator: checkEmail,
            tigger: "blur"
          }
        ],
        mobile: [
          {
            required: "true",
            message: "请输入手机号",
            tigger: "blur"
          },
          {
            validator: checkMobile,
            tigger: "blur"
          }
        ]
      },
      editForm: {}, // 查询的用户信息
      editFormRules: {
        email: [
          {
            required: "true",
            message: "请输入邮箱",
            tigger: "blur"
          },
          {
            validator: checkEmail,
            tigger: "blur"
          }
        ],
        mobile: [
          {
            required: "true",
            message: "请输入手机号",
            tigger: "blur"
          },
          {
            validator: checkMobile,
            tigger: "blur"
          }
        ]
      },
      setRoleDialogVisible: false, // 控制分配角色对话框的显示与隐藏
      userinfo: "", // 需要被分配角色的用户信息
      rolesList: "", // 所有角色的数据列表
      selectedRoleId: "" //以选中的角色id值
    };
  },
  methods: {
    _getUsers() {
      getUsers(this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.userList = res.data.users;
        this.totalUser = res.data.total;
      });
    },

    // 监听pagesize改变 如100页/条 200页/条
    handleChangeSize(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getUsers();
    },

    // 监听页码值的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getUsers();
    },

    //  监听switch开关的改变
    switchChange(scope) {
      console.log(scope);
      this._userStateChange(scope.id, scope.mg_state);
    },

    // 发送请求修改用户状态
    _userStateChange(id, state) {
      userStateChange(id, state).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("设置失败");
        }
        this.$message.success(res.meta.msg);
      });
    },

    // 添加用户对话框的关闭事件, 对话框关闭时触发
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 点击添加对话框的确定
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 添加用户的表单 校验成功
          // 发送网络请求,
          const res = await addUser(this.addForm);
          if (res.meta.status !== 201) {
            // 添加用户失败
            return this.$message.error("添加用户失败");
          } else {
            // 添加用户成功
            this.$message.success("添加用户成功");
            this.addDialogVisible = false;
            this._getUsers();
          }
        } else {
          // 校验失败
        }
      });
    },

    // 显示 编辑用户的对话框
    async showEditDialog(info) {
      this.editDialogVisible = true;
      // 根据id获取用户信息, 虽然这里可以直接获取数据
      const res = await getUserInfoById(info.id);
      if (res.meta.status !== 200) {
        return this.$message.error("查找用户信息失败");
      }
      console.log(res);
      this.editForm = res.data;
    },

    // 点击修改用户信息对话框的确定
    editConfirm() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 通过验证, 发送请求求改用户数据
          const res = await editUserInfo(this.editForm);
          console.log(res);
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg);
            this.editForm = {};
            this.editDialogVisible = false;
          }
        } else {
          // 验证失败
          this.$message.error("请输入合法的信息");
        }
      });
    },

    // 确认是否删除该用户
    confirmDelete(info) {
      // console.log(info)
      this.$confirm("此操作将永久删除该用户，是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 确定删除,获取新数据更新显示的Card
          const res = await deleteUser(info.id);
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.info("删除失败");
          }
          this.$message.success("删除成功");
          this._getUsers();
        })
        .catch(() => {
          // 取消删除
          this.$message.info("删除失败");
        });
    },

    // 点击了操作分配权限按钮
    async setRole(userinfo) {
      this.userinfo = userinfo;
      // 在展示对话框之前，获取所有角色列表
      const res = await getRolesList();
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
      this.setRoleDialogVisible = true;
    },
    // 点击分配角色对话框的确定按钮
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      // console.log(this.userinfo.id)
      // console.log(this.selectedRoleId)
      const res = await getUserRole(this.userinfo.id, this.selectedRoleId);
      console.log(res);
      if(res.meta.status === 200){
        this.$message.success('修改成功')
        this._getUsers()
        this.setRoleDialogVisible = false
      }else{
        this.$message.error('更新失败')
      }
      // if(res.meta.status !== 200) {
      //   return this.$message.error('失败')
      // }
    },

    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed(){
      this.selectedRoleId = ''
      this.userinfo = {}
    }
  }
};
</script>

<style></style>
