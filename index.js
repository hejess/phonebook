require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')
// middleware to handle request and response objects
//json-parse takes the raw data from the request,
// parse it into a JavaScript object
// and assigns it to the request as a new proprty body.
app.use(express.json())
const morgan = require('morgan')
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }
  const formattedDate = currentDate.toLocaleString('en-AU', options)
  Person.find({}).then(persons =>
    response.send(
      `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${formattedDate}</p>
      </div>`
    )
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (!person) {
      response.status(404).end()
    } else {
      response.json(person)
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    console.log(`delete result ${result}`)
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(409).json({
  //     error: `Person ${body.name} already exists`
  //   })
  // }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(person => response.json(person))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Aloha, server running on port ${PORT}`)
})
