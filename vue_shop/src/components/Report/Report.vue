<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" ref="echarsRef" style="width: 750px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
import { getReport } from "network";
export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {},
  async mounted() {
    let myChart = echarts.init(document.getElementById("main"));
    const res = await getReport();
    if (res.meta.status !== 200) {
      return this.$message.error("获取数据失败");
    }

    const result = _.merge(this.options, res.data);

    myChart.setOption(result);
  },
  methods: {}
};
</script>

<style></style>
