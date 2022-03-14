require('dotenv').config()
const express   = require('express')
const app       = express()
const Note      = require('./models/note')
const cors      = require('cors')
require('mongoose')

// --- MIDDLEWARE --- //
app.use(express.static('build'))
app.use(express.json())
app.use(cors())


// --- MONGODB --- //

// Set Mongo database as response for /api/notes
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// --- REQUEST LOGGER --- //
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

// --- HTTP REQUESTS --- //

// Get index
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Create new note
app.post('/api/notes', (request, response, next) => {
  const body = request.body
  // Error if note is missing body content
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  // Create new note object
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  // Add new note to notes array
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  // Pass exceptions to error handler
    .catch(error => next(error))
})

// Delete note
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
  // eslint-disable-next-line no-unused-vars
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Get note by id
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Update note
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// --- UNKNOWN ENDPOINT HANDLING --- //
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// --- ERROR HANDLING --- //
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// --- DECLARE PORTS --- //
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})