module.exports = {
  publicPath: ‘/Things/’,
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/scss/style.scss";',
      },
    },
  },
};
