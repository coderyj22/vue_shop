<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data='rightsList' border stripe >
        <el-table-column type='index'></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="等级权限" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type='success'>二级</el-tag>
            <el-tag v-else type='warning'>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network";
export default {
  name: "Rights",
  created() {
    this._getRightsList();
  },
  data() {
    return {
      type: "list", // 请求列表类型的权限
      rightsList: []
    };
  },
  methods: {
    async _getRightsList() {
      const res = await getRightsList(this.type);
      this.rightsList = res.data;
      console.log(this.rightsList);
    }
  }
};
</script>

<style scoped lang="scss"></style>
