require('dotenv').config()
const express   = require('express')
const app       = express()
const Note      = require('./models/note')
const cors      = require('cors')
const mongoose  = require('mongoose')

// --- MIDDLEWARE --- //

  app.use(express.json())
  app.use(cors())
  app.use(express.static('build'))

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

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  // Post new note
  app.post('/api/notes', (request, response) => {
    const body = request.body
    // Error if note is missing body content
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    // Create new note object
    const note = {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId(),
    }
    // Add new note to notes array
    notes = notes.concat(note)

    response.json(note)
  })

              // app.get('/api/notes', (req, res) => {
              //   res.json(notes)
              // })

  // Delete note
  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
  })

  // Get note by id
  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

// --- UNKNOWN ENDPOINT HANDLING --- //
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)


// --- DECLARE PORTS --- //
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})












// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2022-01-10T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2022-01-10T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2022-01-10T19:20:14.298Z",
//     important: true
//   }
// ]