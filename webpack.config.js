const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CSSModuleLoader = {
    loader: 'css-loader',
    options: {
      modules: true,
      sourceMap: true,
      localIdentName: '[local]__[hash:base64:5]',
      minimize: true
    }
  };
  
  const CSSLoader = {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: true,
      minimize: true
    }
  }
  
  const postCSSLoader = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: true,
      plugins: () => [
        autoprefixer({
          browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
        })
      ]
    }
  };
var config = {
    entry: './main.js',
    mode: 'development',
    output: {
        path: '/',
        filename: 'index.js',
        publicPath: '/'
    },
    devServer: {
        inline: true,
        port: 8080,
        proxy: {
            '/api': 'http://localhost:8081'
        },
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.(svg|png|jpg)$/,
                exclude: [/\.inline\.svg$/],
                use: ['url-loader']
           },
           {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: ['style-loader', CSSLoader, postCSSLoader, 'sass-loader']
            },
            {
                test: /\.module\.scss$/,
                use: [
                    'style-loader',
                    CSSModuleLoader,
                    postCSSLoader,
                    'sass-loader',
                ]
            },

           // { test: /\.(js)$/, use: 'babel-loader' },
           //{ test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
        ]
        
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: 'index.html'
        })
      ],
    devtool: 'inline-source-map'
}
module.exports = config;