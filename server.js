require('dotenv').config()

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const fileUpload = require('express-fileupload')

const { Video } = require('./database.js')

app.use(express.static('./public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors())
app.use(helmet())
app.use(fileUpload())

app.get('/video', (req, res) => {

})

app.post('/uploadVideo', async (req, res) => {
    const { title, description, tags } = req.body
    if (!title) {
        res.status(400).json({
            success: false,
            response: 'Missing video title.'
        })
        return
    }

    if (!req.files.video) {
        res.status(400).json({
            success: false,
            response: 'Missing video.'
        })
        return
    }

    //todo accept upload, save it on disk and set videoPath accordingly
    const uploadedFile = await Video.create({
        title,
        description,
        videoPath
    })

    req.files.video.mv(`./videos/${uploadedFile.id}`, err => {
        if (err) {
            res.status(500).json({
                success: false,
                response: 'Unexpected issue with server.'
            })
            return
        }
        res.json({
            sucess: true,
            video: uploadedFile
        })
    })
})

app.listen(process.env.PORT, () => console.log('Running on', process.env.PORT))

module.exports = app