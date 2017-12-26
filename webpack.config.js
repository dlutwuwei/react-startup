const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const I18nPlugin = require("i18n-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const path = require('path')

const isDev = process.env.NODE_ENV != 'production'

var languages = {
	"en": require('./src/locale/en.js'),
	"cn": require("./src/locale/cn.js")
};

module.exports = Object.keys(languages).map(lan => {
  return {
    entry: {
        lib: [ 'react', 'react-dom', 'babel-polyfill' ],
        app: ['./src/index.js']
    },
    output: {
        publicPath: isDev ? '/' : '/static/',
        path: path.join(__dirname, 'dist'),
        filename: `js/[name]-${lan}-[chunkhash:6].js`
    },
    devServer: {
        hot: false,
        inline: false,
        host: "0.0.0.0",
        port: 8001,
        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        proxy: {
          '/upload': {
            target: 'http://60.205.107.191:8808/',
          },
          '/lib': {
            target: 'http://60.205.107.191:8808/',
          },
          '/unity_web/': {
            target: 'http://60.205.107.191:8808/',
          },
          '/api': {
              target: 'http://60.205.107.191:8808/',
              changeOrigin: true,
              bypass: function(req, res, proxyOptions) {
                if (req.headers.accept.indexOf('html') !== -1) {
                  console.log('Skipping proxy for browser request.');
                  return '/index.html';
                }
              }
          }
        }
    },
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: /node_modules/
          },
          {
            test: /\.(svg|ttf|woff|eot)|\.otf/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'iconfont/[name].[hash:8].[ext]',
                }
              }
            ]
          },
          {
            test: /\.(jpe?g|gif|png|svg)$/i,
            use: [
              {
                loader: 'image-webpack-loader',
                options: {
                  byPassOnDebug: true,
                  mozjpeg: { progressive: true },
                  optipng: { optimizationLevel: 3 },
                  pngquant: { quality: '65-80' },
                },
              },
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'img/[name].[ext]',
                },
              },
            ],
          },
          {
            test: /\.css/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [{
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                }
              },{
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [
                      require('autoprefixer')({
                        browsers: ['iOS >= 7', 'android >= 4', 'ie >= 9'],
                      }),
                    ];
                  },
                },
              }]
            })
          },
          {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', {
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [
                      require('autoprefixer')({
                        browsers: ['iOS >= 7', 'android >= 4', 'ie >= 9'],
                      }),
                    ];
                  },
                },
              }, 'resolve-url-loader', 'less-loader']
            })
          },
        ],
      },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'lib' }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true
        }),
        new ExtractTextPlugin({
            filename: 'css/app-[contenthash:6].css',
            allChunks: true
        }),
        new I18nPlugin(
          languages['cn']
        )
    ].concat(!isDev ? [
        new webpack.HashedModuleIdsPlugin(),
        new UglifyJSPlugin({
          test: /\.js($|\?)/i,
          uglifyOptions: {
            compress: {
              warnings: false
            },
            minimize: true
          }
        })
    ] : [ ]),
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
          '~': path.resolve(__dirname, './src/'),
          img: path.resolve(__dirname, './src/img'),
          app: path.resolve(__dirname, './src/app'),
          utils: path.resolve(__dirname, './src/utils'),
          components: path.resolve(__dirname, './src/components'),
        }
    }
  };
});