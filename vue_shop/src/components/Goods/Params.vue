<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为三级分类设置相关参数"
        type="warning"
      ></el-alert>

      <el-row style="margin:15px 0;">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            type="primary"
            size="mini"
            >添加参数</el-button
          >
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClose(index,scope.row)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  @click="removeParams(scope.row.attr_id)"
                  size="mini"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            type="primary"
            size="mini"
            >添加属性</el-button
          >
          <el-table :data="onlyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClose(index,scope.row)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  @click="removeParams(scope.row.attr_id)"
                  size="mini"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 分静态属性和动态参数 -->

    <!-- 添加静态属性的对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addDialogVisible"
      width="600px"
      @close="addDialogClosed"
    >
      <!-- 添加参数的form表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsDialogConfirm">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="600px"
      @close="editDialogClosed"
    >
      <!-- 添加参数的form表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsDialogConfirm">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryListNull,
  getCategoryListOnlyOrMany,
  addCategoryAttributed,
  getAttributesById,
  submitCategoryAttributes,
  deleteCategoryAttributes,
  editSubmitAttributes
} from "network";
export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }, //级联选择框的配置对象
      selectedCateKeys: [], //级联选择框的双向绑定的数组
      activeName: "many",
      manyTabData: [],
      onlyTabData: [],
      addDialogVisible: false, // 控制添加对话框的显示与隐藏
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this._getCateList();
  },
  computed: {
    isBtnDisable() {
      return this.selectedCateKeys.length !== 3;
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    }
  },
  methods: {
    async _getCateList() {
      const res = await getCategoryListNull();
      if (res.meta.status === 200) {
        this.cateList = res.data;
      } else {
        return this.$message.error("获取失败");
      }
    },

    async _getParamsDate() {
      const res = await getCategoryListOnlyOrMany(this.cateId, this.activeName);
      if (res.meta.status !== 200) {
        // 请求失败
        return this.$message.error("请求失败");
      }
      console.log(res);
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName === "many") {
        // 动态参数里面的数据
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    },
    // 级联选择框选中项变化触发这个函数
    async handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        // 清空数组
        this.manyTabData = []
        this.onlyTabData = []
        return (this.selectedCateKeys = []);
      }
      console.log(this.selectedCateKeys);
      this._getParamsDate();

      // 请求成功
    },

    // tab点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this._getParamsDate();
    },

    // 监听添加对话框的关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 添加对话框的confirm事件
    addParamsDialogConfirm() {
      // 发起请求
      // addCategoryAttributed()
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          // 验证失败
          return this.$message.info("请输入合法的字段");
        }
        // 验证成功
        const res = await addCategoryAttributed(
          this.cateId,
          this.addForm.attr_name,
          this.activeName
        );
        console.log(res);

        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this._getParamsDate();
        this.addDialogVisible = false;
      });
    },

    //
    async showEditDialog(attr_id) {
      // 查询当前参数的信息
      const res = await getAttributesById(
        this.cateId,
        attr_id,
        this.activeName
      );
      if (res.meta.status !== 200) {
        // 请求失败
        return this.$message.error("获取参数信息失败");
      }
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 确认修改
    editParamsDialogConfirm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          // 失败
          return this.$message.error("验证失败");
        }
        // 验证成功
        const res = await submitCategoryAttributes(
          this.cateId,
          this.editForm.attr_id,
          this.editForm.attr_name,
          this.activeName
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this._getParamsDate();
        this.editDialogVisible = false;
      });
    },

    async removeParams(attr_id) {
      // 根据id删除对应的参数项
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
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
      const res = await deleteCategoryAttributes(this.cateId, attr_id);

      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this._getParamsDate();
      this.$message.success("删除成功");
    },

    // 文本框失去焦点或按下enter键
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      console.log(row.inputValue);
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttributesValues(row)
    },
    async saveAttributesValues(row){
      const res = await editSubmitAttributes(this.cateId,row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join(' '))
      console.log(res)
      if(res.meta.status !== 200){
        return this.$message.error('请求失败')
      }
      this.$message.success('修改成功!')
    },

    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 点击按钮 删除tag
    handleClose(index,row){
      row.attr_vals.splice(index,1)
      this.saveAttributesValues(row)
    }
  }
};
</script>

<style scoped lang="scss">
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
}
</style>
