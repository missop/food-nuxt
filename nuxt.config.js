module.exports = {
  /*设置 Nuxt.js 应用的源码目录*/
  // srcDir: "/",
  head: {
    title: "我的第一个nuxt项目",
    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1,user-scalable=no,maximum-scale=1.0,minimum-scale=1.0"
      },
      {name: 'description', content: 'Meta description'},
      {name: 'keywords', content: 'key,keyval'}
    ],
    link: [
      {
        rel: "shortcut icon",
        type: "image/png",
        // 注意图片的路径直接指向static下的logo.png
        href: "/logo.png"
      }
    ]
  },
  css: [
    "@/assets/stylus/reset.css"
  ],
  build: {
    vendor: ['axios'],
    loaders: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.styl/,
        loader: "vue-style-loader!css-loader!stylus-loader"
      }
    ]
  }
}
