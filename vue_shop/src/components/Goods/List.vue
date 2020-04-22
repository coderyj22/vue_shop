<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            @clear="_getGoodsList"
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
          >
            <el-button
              @click="_getGoodsList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="90px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="90px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px;">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="removeById(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGoodsById } from "network";
export default {
  name: "List",
  created() {
    this._getGoodsList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagesize: 10,
        pagenum: 1
      },
      goodslist: [],
      total: -1
    };
  },
  methods: {
    async _getGoodsList() {
      const res = await getGoodsList(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      //
      this.goodslist = res.data.goods;
      console.log(this.goodslist);
      this.total = res.data.total;
    },

    // pagesize 发生变化触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getGoodsList();
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getGoodsList();
    },

    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        // 点击了取消
        return this.$message.info("取消删除");
      }
      // 点击了确定
      const res = await deleteGoodsById(id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$notify({
          title:"失败",
          message:"删除失败, 你运气真好",
          type:'error',
          duration:2000
        })
      }
      // this.$message.success('删除成功')
      this.$notify({
        title: "成功",
        message: "删除了改商品, 你可以哦",
        type: "success",
        duration: 2000
      });
      this._getGoodsList();
    },

    // 跳转
    goAddPage(){
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style scoped lang="scss">

</style>
