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

app.get('/video', (req, res) => {

})

app.post('/uploadVideo', (req, res) => {
    const { title, description, tags } = req.body
    if (!title) {
        res.status(400).json({
            success: false,
            response: 'Missing video title.'
        })
        return
    }

    //todo accept upload, save it on disk and set videoPath accordingly
    Video.create({
        title,
        description
    })
})

app.listen(process.env.PORT, () => console.log('Running on', process.env.PORT))

module.exports = app