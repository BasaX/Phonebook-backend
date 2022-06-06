const mongoose = require('mongoose')

const personsSchema = new mongoose.Schema({
  name: String,
  phone: Number
})

// Defino cómo se tiene que transformar el toJSON() de la respuesta de la API
// Ir a documentación de Mongoose en todo caso y buscar set transform
personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Creo Modelo, la clase que me deja crear instancias

const Person = mongoose.model('Person', personsSchema)

module.exports = Person
