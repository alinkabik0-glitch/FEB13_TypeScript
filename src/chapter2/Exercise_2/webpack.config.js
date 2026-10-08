const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Точка входа
  entry: './src/index.ts',
  
  // Настройка резолва, чтобы вебпак понимал расширения .ts и .js
  resolve: {
    extensions: ['.ts', '.js'],
  },

  // Лоадеры (преобразования)
module: {
  rules: [
    {
      test: /\.ts$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-typescript'
          ]
        }
      },
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ],
},

  // Точка выхода
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Очищает папку dist перед каждой сборкой
  },

  // Плагины
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  // Настройки dev-сервера
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
  },
};