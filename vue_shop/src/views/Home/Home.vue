<template>
  <el-container class="home">
    <el-header style="height:80px;">
      <div class="header">
        <img src="https://cn.vuejs.org/images/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            v-for="item in menuList"
            :index="item.path"
            :key="item.id"
          >
            <template slot="title">
              <i class="iconfont" :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saceNavState('/' + subItem.path)"
            >
              <template>
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "network";
export default {
  name: "Home",
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    this._getMenuList();
  },
  data() {
    return {
      menuList: [],
      iconsObj: {
        "125": "icon-users",
        "103": "icon-tijikongjian",
        "101": "icon-shangpin",
        "102": "icon-danju",
        "145": "icon-baobiao",
      },
      collapse: false,
      activePath: "",
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.replace("/login");
    },
    handleOpen(e) {
      console.log(e);
    },
    handleClose(e) {
      console.log(e);
    },
    _getMenuList() {
      getMenuList().then((res) => {
        // 获取左侧菜单
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.menuList = res.data;
      });
    },
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
    saceNavState(activePath) {
      // 保存链接的激活状态
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = window.sessionStorage.getItem("activePath");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #373d41;
    .header {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 40px;
        height: 40px;
      }
      span {
        font-size: 20px;
        color: #fff;
        margin-left: 20px;
      }
    }
    .el-button {
      height: 40px;
    }
  }
  .el-container {
    .el-aside {
      background-color: #333744;
      .iconfont {
        margin-right: 12px;
        font-size: 18px;
      }
      .el-menu {
        border-right: none;
      }
    }
    .toggle-button {
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      font-size: 10px;
      line-height: 24px;
      height: 24px;
      letter-spacing: 0.2rem;
      cursor: pointer;
    }
    .el-main {
      background-color: #eaedf1;
    }
  }
}
</style>
