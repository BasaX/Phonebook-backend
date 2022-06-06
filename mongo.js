const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// Conexión a  MongoDB

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => {
    console.log(err)
  })

// // Creo esquema de datos

// // Creo una instancia

// const person = new Person({
//   name: 'Damian Basarena',
//   phone: '112233445566'
// })

// // Salvo la instancia

// person.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => {
//     console.error(err)
//   })

process.on('uncaughtException', () => {
  console.log('Database disconnected')
  mongoose.connection.close()
})
