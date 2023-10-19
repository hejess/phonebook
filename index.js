require('dotenv').config() // load and configure environment variables from ".env"

const express = require('express')
const app = express()
const Person = require('./models/person')
app.use(express.static('build')) // serve static files from a directory named "build"
app.use(express.json()) // parse raw data from request to JS object
const morgan = require('morgan')
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
) // request logging

// const cors = require('cors')
// app.use(cors())

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

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
  .then(person => {
    if (!person) {
      response.status(404).end()
    } else {
      response.json(person)
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
  .then(result => {
    console.log(`delete result ${result}`)
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  console.log('post')
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(person => response.json(person))
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log("put")
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  const id = request.params.id
  Person.findByIdAndUpdate(id, person, {new: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

// Error handler should come after route handlers

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  // Handle specific error types, if needed
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error); // Pass the error to the default error handler for further processing
}

app.use(errorHandler) // This should be the last loaded middleware


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Aloha, server running on port ${PORT}`)
})
