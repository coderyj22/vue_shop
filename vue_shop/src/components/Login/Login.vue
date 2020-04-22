<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar">
        <img src="https://cn.vuejs.org/images/logo.png" alt="" />
      </div>
      <div class="form">
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input placeholder="用户名" v-model="loginForm.username">
              <i slot="prefix" class="iconfont icon-user"></i>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              placeholder="密码"
              type="password"
              v-model="loginForm.password"
            >
              <i slot="prefix" class="iconfont icon-password"></i>
            </el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="handleClickLogin">登陆</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "network";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        // 登陆表单的数据对象
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入您的密码", trigger: "blur" },
          { min: 6, message: "密码最小为6位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitLoginForm() {},
    handleClickLogin() {
      const validateRet = this.$refs.loginFormRef.validate();
      validateRet.then((valid) => {
        if (valid) {  // 表单验证成功
          // 发起请求
          login(this.loginForm).then(async (res) => {
            if (res.meta.status === 400) {
              // 返回400 密码错误 || 用户名不存在
              const msg = res.meta.msg;
              this.$message.error(msg);
            }
            if (res.meta.status === 200) {
              console.log(res);
              const token = res.data.token;
              await window.sessionStorage.setItem("token", token);
              this.$router.push('/home')
            }
          });
        }
      });
    },
    resetLoginForm() {
      // 点击重置按钮
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>

<style scoped lang="scss">
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -225px;
    margin-top: -150px;
    .avatar {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .iconfont {
        margin-left: 3px;
      }
      .icon-password {
        font-size: 18px;
      }

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
