// vue.config.js
module.exports = {
  devServer: {
    https: true,
    proxy: {
      "/api": {
        target: "https://testnet.bitmex.com/api/v1",
        secure: false,
        changeOrigin: true,
        pathRewrite: { "^/api": "" }
      }
    }
  }
};
