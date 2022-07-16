const mongoose = require('mongoose')

const Trabajador = mongoose.model('Trabajador', {
  
  nombre:String,
  puesto: String,
  correo: String,
  password: String,
  

})

module.exports = Trabajador