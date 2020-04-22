const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === "production", config => {
      // 生产配置
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        // 'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    config.when(process.env.NODE_ENV === "development", config => {
      // 开发配置
      config.entry('app').clear().add('./src/main-dev.js')
    })

    // 开发和生产依赖的配置
    config.resolve.alias
    .set("@", resolve("src"))
    .set("components", resolve("src/components"))
    .set("views", resolve("src/views"))
    .set("common", resolve("src/common"))
    .set("network", resolve("src/network"))

  }
}





