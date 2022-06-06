require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./middleware/loggerMiddleware')
const Person = require('./models/Person')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())

app.use(express.json())
app.use('/images', express.static('images'))

app.use(logger)

// const persons = [
//   {
//     name: 'Arto Hellas',
//     id: 1,
//     phone: '0400-3546'
//   },
//   {
//     name: 'Ada Lovelace',
//     id: 2,
//     phone: '39-44-5323523'
//   },
//   {
//     name: 'Dan Abramov',
//     id: 3,
//     phone: '12-43-234345'
//   },
//   {
//     name: 'Mary Poppendieck',
//     id: 4,
//     phone: '39-23-6423122'
//   }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response, next) => {
  Person.count({}, function (err, count) {
    if (err) {
      next(err)
      response.status(400).end()
    } else {
      const message = `Phonebook has info for ${count} people`
      const Time = new Date().toISOString()
      response.send(`<p>${message} </br></br> ${Time}</p>`)
    }
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  // SIN BD
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
  const { id } = request.params

  Person.findById(id)
    .then(person => {
      if (person) {
        return response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      next(err)
      response.status(400).end()
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body

  const newPersonInfo = {
    name: person.name,
    phone: person.phone
  }

  Person.findByIdAndUpdate(id, newPersonInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  // SIN BD
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)
  // response.status(204).end()
  const { id } = request.params
  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  // ESTO REHACER
  // persons.forEach((phonebook) => {
  //   if (phonebook.name === person.name) {
  //     return response.status(409).json({
  //       error: 'name must be unique'
  //     })
  //   }
  // })

  if (!person.name || !person.phone) {
    return response.status(400).json({
      error: 'person.body is missing'
    })
  }

  // YA NO HACE FALTA PORQUE TENGO MONGODB
  // const ids = persons.map(person => person.id)
  // const maxId = Math.max(...ids)
  // const newperson = {
  //   userId: person.userId,
  //   id: maxId + 1,
  //   name: person.name,
  //   phone: person.phone
  // }
  // persons = [...persons, newperson]
  // response.json(newperson)

  const newperson = new Person({
    name: person.name,
    phone: person.phone
  })

  // Salvo la instancia

  newperson.save()
    .then(result => {
      response.json(result)
    })
    .catch(err => {
      console.error(err)
    })
})

// ACA YA USO MIDDLEWARES PARA LOS POSIBLES ERRORES

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
