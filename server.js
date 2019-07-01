require('dotenv').config();

const fs = require('fs');

const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();

const ThumbnailGenerator = require('video-thumbnail-generator').default;

const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');

const { Video, User } = require('./database.js');

app.use(cors());

app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(helmet());
app.use(fileUpload());

app.post('/uploadVideo', async (req, res) => {
    const { title, description, tags } = req.body
    if (!title) {
        res.status(400).json({
            success: false,
            response: 'Missing video title.'
        });
        return;
    }

    if (title.length > 100) {
        res.status(400).json({
            success: false,
            response: 'Video title must not exceed 100 characters.'
        });
        return;
    }

    if (!req.files.video) {
        res.status(400).json({
            success: false,
            response: 'Missing video.'
        });
        return;
    }

    try {
        const uploadedFile = await Video.create({
            id: uuid(),
            title,
            description
        });

        req.files.video.mv(`./public/videos/${uploadedFile.id}.mp4`, async err => {
            if (err) {
                res.status(500).json({
                    success: false,
                    response: 'Unexpected issue with server.'
                });
                return;
            }
            const tg = new ThumbnailGenerator({
                sourcePath: `./public/videos/${uploadedFile.id}.mp4`,
                thumbnailPath: `./public/thumbnails`,
            });
            await tg.generateOneByPercent(Math.trunc(Math.random() * 100), {
                size: '1280x720'
            });
            res.json({
                success: true,
                response: ''
            });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            response: err.message
        });
    }
});

app.get('/videos', async (req, res) => {
    const videos = await Video.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    });
    res.json({
        success: true,
        response: videos
    });
});

app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({
        where: {
            username: username.toLowerCase()
        }
    });
    if (!user) {
        res.json({
            success: false,
            response: 'That combination of username and password does not exist.'
        });
        return;
    }
    const hashMatches = await compare(password, user.passwordHash);
    if (!hashMatches) {
        res.json({
            success: false,
            response: 'That combination of username and password does not exist.'
        });
        return;
    }
    const token = await signToken({ userID: user.id });
    res.json({
        success: true,
        response: { token }
    });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await hash(password);
    try {
        const user = await User.create({
            id: uuid(),
            username: username.toLowerCase(),
            passwordHash
        });
        const token = await signToken({ userID: user.id });
        res.json({
            success: true,
            response: { token }
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.json({
                success: false,
                response: 'This username is already registered!'
            });
        }
    }
});

app.listen(process.env.PORT, () => console.log('Running on', process.env.PORT));
module.exports = app;

function hash(password, saltRounds = 10) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                reject(err);
                return;
            }
            resolve(hash);
        });
    });
}

function compare(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, res) {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}

function signToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, 'supersecuresecret', function (err, token) {
            if (err) {
                reject(err);
                return;
            }
            resolve(token);
        });
    });
}