<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        :closable="false"
        show-icon
        type="info"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="140px"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          label-position="top"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="manyTableData">
                <el-checkbox
                  border
                  v-for="(cb, index) in item.attr_vals"
                  :label="cb"
                  :key="index"
                  >{{ cb }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button @click="addProduct" type="primary" class="btn-cls"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getCateListAll, getCategoryListOnlyOrMany,addGoods } from "network";
export default {
  name: "Add",
  created() {
    this._getCateListAll();
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.length === 3
        ? this.addForm.goods_cat[2]
        : null;
    }
  },
  data() {
    return {
      activeIndex: 0,
      addForm: {
        // 添加商品的表单数据对象
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [], // 图片的数组
        goods_introduce: "",
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur"
          }
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择分类",
            trigger: "blur"
          }
        ]
      },
      catelist: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: "http://localhost:8888/api/private/v1/upload",
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      previewDialogVisible: false
    };
  },
  methods: {
    async _getCateListAll() {
      const res = await getCateListAll();
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.catelist = res.data;
    },

    // 级联选择器选择向变化触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        // 不允许选中
        return (this.addForm.goods_cat = []);
      }
    },

    beforeTabLeave(activeName, oldActiveName) {
      console.log({ activeName, oldActiveName });
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$notify.error({
          title: "你不同套路？",
          message: "必须选择商品分类"
        });
        return false;
      }
    },

    async tabClicked() {
      if (this.activeIndex === "1") {
        // 发送请求
        const res = await getCategoryListOnlyOrMany(this.cateId, "many");
        if (res.meta.status !== 200) {
          return this.$message.error("请求失败");
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const res = await getCategoryListOnlyOrMany(this.cateId, "only");
        if (res.meta.status !== 200) {
          return this.$message.error("请求失败");
        }
        this.onlyTableData = res.data;
        console.log(res);
      }
    },

    // 预览图片时触发
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },

    // 处理移除图片的操作
    handleRemove(file, fileList) {
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(item => {
        return item.pic === filePath;
      });
      this.addForm.pics.splice(index, 1);
      console.log(this.addForm);
    },

    handleSuccess(reponse, file, fileList) {
      if (reponse.meta.status !== 200) {
        return this.notify.error({
          title: "错误",
          message: "上传图片失败"
        });
      }
      const picInfo = { pic: reponse.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },

    addProduct() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 验证成功

        let form = JSON.parse(JSON.stringify(this.addForm));
        form.goods_cat = form.goods_cat.join(",");
        this.manyTableData.forEach(item => {
          console.log(item)
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs

        // 发起请求，商品名称必须是唯一的
        const res = await addGoods(form)
        if(res.meta.status !== 201){
          return this.$message.error('请求失败')
        }
        this.$router.push('/goods')
      });
    }
  }
};
</script>

<style scoped lang="scss">
.el-steps {
  margin: 15px 0;
}
.el-alert {
  display: flex;
  justify-content: center;
}
.el-checkbox {
  margin: 10px 20px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.quill-editor {
  min-height: 300px;
}
.btn-cls {
  margin-top: 15px;
}
</style>
