const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const listsRouter = require('./routes/lists')
const taskRouter = require('./routes/tasks')

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(cors())
app.use(express.json()) // req.body
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// ROUTES
app.use('/lists', listsRouter)
app.use('/lists/:id/tasks', taskRouter)

// Start server
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server is started on ${port}`))
