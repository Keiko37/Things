module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/Things/' : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/scss/style.scss";',
      },
    },
  },
};
