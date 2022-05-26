const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./loggerMiddleware')

app.use(express.json())

app.use(cors())

app.use(logger)

let persons = [
  {
    name: 'Arto Hellas',
    id: 1,
    phone: '0400-3546'
  },
  {
    name: 'Ada Lovelace',
    id: 2,
    phone: '39-44-5323523'
  },
  {
    name: 'Dan Abramov',
    id: 3,
    phone: '12-43-234345'
  },
  {
    name: 'Mary Poppendieck',
    id: 4,
    phone: '39-23-6423122'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response) => {
  const message = `Phonebook has info for ${persons.length} people`
  const Time = new Date().toISOString()

  response.send(`<p>${message} </br></br> ${Time}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  persons.forEach((phonebook) => {
    if (phonebook.name === person.name) {
      return response.status(409).json({
        error: 'name must be unique'
      })
    }
  })

  if (!person.name || !person.phone) {
    return response.status(400).json({
      error: 'person.body is missing'
    })
  }

  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  const newperson = {
    userId: person.userId,
    id: maxId + 1,
    name: person.name,
    phone: person.phone
  }

  persons = [...persons, newperson]

  response.json(newperson)
})

app.use((request, response) => {
  console.log('Error en ruta:')
  console.log(request.path)
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
