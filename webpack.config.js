//CONFIGURACION PARA WEBPACK
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './public/js/app.js',//punto de entrada
  output: { //configuracion del punto de salida
    filename: 'bundle.js', //nombre que tendra el archivo
    path: path.join(__dirname,('./public/dist')) //directorio donde se guardara
  },
  //webpack requiere de algunos modulos ()
  module: { 
    rules: [ 
      { //configuracion que require babel
        test: /\.m?js$/,
        use:{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }

    ]
  }
}