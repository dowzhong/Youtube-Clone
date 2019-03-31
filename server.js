require('dotenv').config()

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')

const { Video } = require('./database.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors())
app.use(helmet())



app.listen(process.env.PORT, () => console.log('Running on', process.env.PORT))

module.exports = app