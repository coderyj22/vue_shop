<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addCategory" type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        :border="true"
      >
        <!-- 是否有效模版 -->
        <template slot="isOk" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color:lightgreen;"
          ></i>
          <i v-else class="el-icon-error" style="color:red;"></i>
          <!-- {{scope}} -->
        </template>

        <!-- 排序模版 -->
        <template slot-scope="scope" slot="order">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini"> 三级</el-tag>
        </template>

        <!-- 操作模版 -->
        <template slot-scope="scope" slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
          @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="600px"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :rules="addCateFormRules"
        :model="addCateForm"
        ref="addCateFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options指定数据源 -->
          <el-cascader
            change-on-select
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, addCategories,deleteCate } from "network";
export default {
  name: "Category",
  data() {
    return {
      cateList: [], // 商品分类的列表, 默认为空
      queryInfo: {
        type: 3,
        pagenum: 1, // 默认第一页
        pagesize: 5 // 默认每页5条
      },
      total: 0, // 总数据条数
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template", // 将当前列定义为模版列
          template: "isOk" // 当前这一列使用的模版名称
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "", // 将要添加分类的名称
        cat_pid: 0, // 父级分类的id
        cat_level: 0 // 添加分类的等级
      },
      addCateFormRules: {
        // 验证规则
        cat_name: [
          {
            required: true,
            message: "请输入分类的名称",
            trigger: "blur"
          }
        ]
      },
      parentCateList: [], // 父级分类的列表
      cascaderProps: {
        // 级联选择器的配置对象
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      selectedKeys: [] // 选中的父级分类的id数组
    };
  },
  created() {
    this._getCategoryList();
  },
  methods: {
    async _getCategoryList() {
      const res = await getCategoryList(this.queryInfo);
      if (res.meta.status !== 200) {
        // 获取失败
        return this.$message.error("获取商品分类失败");
      }
      // this.cateList = res.data
      // 将数据列表赋值给cateList
      this.cateList = res.data.result;
      this.total = res.data.total;
    },

    // 点击添加分类按钮
    async addCategory() {
      await this.getParentCateList();
      this.addCateDialogVisible = true;
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getCategoryList();
    },

    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getCategoryList();
    },

    // 获取父级分类的列表
    async getParentCateList() {
      this.queryInfo.type = 2;
      const res = await getCategoryList(2,0,0);
      if (res.meta.status !== 200) {
        // 获取失败
        return this.$message.error("获取失败");
      }
      console.log(res.data)
      this.parentCateList = res.data;
    },

    // 选择项发生变化触发这个函数
    parentCateChange() {
      console.log(this.selectedKeys);
      //如果selectedKeys数组长度大于0，证明选中了父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击按钮添加新的分类
    addCate() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if(valid){
          // 验证成功
          const res = await addCategories(this.addCateForm)
          if(res.meta.status !== 201){
            return this.$message.error('添加分类失败')
          }
          this.$message.success('成功')
          this._getCategoryList()
          this.addCateDialogVisible = false
        }else{
          // 验证失败
          this.$message.info('请输入合法的字段')
        }
      })
    },

    // 监听对话框的关闭事件
    addCateDialogClosed() {
      // 重置表单数据
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },

    // 点击删除分类
    deleteCate(info){
      console.log(info.cat_id)
      deleteCate(info.cat_id).then(res => {
        if(res.meta.status === 200){
          // 删除成功
          this.$message.success('删除成功')
          this._getCategoryList()
        }else{
          return this.$message.error('删除失败')
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
