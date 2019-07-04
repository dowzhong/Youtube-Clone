//import dotenv module that'll automatically load environment variables for this machine.
require('dotenv').config();

//uuid package is used to generate time based unique IDs
const uuid = require('uuid/v4');

//bcrypt is a hashing and salting module for passwords.
const bcrypt = require('bcryptjs');
//json web token is a web authentication protocol that we'll use to authenticate our frontend with our backend.
const jwt = require('jsonwebtoken');

//express is the backend framework this project uses to create it's REST API.
const express = require('express');
const app = express();

//THis packages allows us to offload the CPU heavy task of generating thumbnails away from Nodejs onto FFMPEG
//Offloading this task away from nodejs is important since node is not optimized for CPU heavy/bound operations
const ThumbnailGenerator = require('video-thumbnail-generator').default;

//BodyParser allows for easy parsing of query params and form bodies from  HTTP requests.
const bodyParser = require('body-parser');
/**
 * CORS (Cross origin resource sharing) is a browser security features that disallows different domains
 * from interacting with each other. We can disable this by sending a header to the browser saying we explicitly
 * allow this.
 */

const cors = require('cors');
/**
 * Helmet is a package that has compiled patches for most known security issues that exposing your server bare
 * to the world may introduce.
 */
const helmet = require('helmet');

/**
 * fileUpload allows the backend to accept file uploads (for video uploading.)
 */
const fileUpload = require('express-fileupload');

//Import Video and User models from database since we are going to be creating, updating and deleting them.
const { Video, User } = require('./database.js');

app.use(cors());

app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(helmet());
app.use(fileUpload());

//Delete route for deletion of videos
app.delete('/deleteVideo', async (req, res) => {
    const { videoID, token } = req.body;
    if (!token) {
        //if there is no token, reject the request as the user is not authenticated.
        res.status(403).json({
            success: false,
            response: 'You are not authenticated. Please log in first.'
        });
        return;
    }
    if (!videoID) {
        //if there is no video ID provided, we dont know which video to work on, so reject the request.
        res.status(400).json({
            success: false,
            response: 'Missing video ID.'
        });
        return;
    }
    try {
        //verify the token provided using the JWT Protocol.
        const { userID } = await verify(token);
        const deleted = await Video.destroy({
            where: {
                id: videoID,
                userId: userID
            }
        });
        //The destroy method returns the number of rows destroyed in the database.
        if (deleted) {
            /**
             * if there are deleted rows, that means the operation was successful. 
             * Return the request with a success message
             */
            res.json({
                success: true,
                response: ''
            });
        } else {
            /**
             * No rows were removed. This would suggest that there was no video with that ID under the
             * provided token's ownership.
             */
            res.status(403).json({
                success: false,
                response: 'You do not own this resource.'
            });
        }
    } catch (err) {
        //An unexpected error has occured and we have not foreseen it. Return a generic error message.
        console.error(err);
        res.status(400).json({
            success: false,
            response: err.message
        });
    }
});

//endpoint for editing video data (title and description)
app.post('/editVideo', async (req, res) => {
    const { videoID, token, title, description } = req.body;
    if (!token) {
        //Reject if authentication token is invalid
        res.status(403).json({
            success: false,
            response: 'You are not authenticated. Please log in first.'
        });
        return;
    }
    if (!videoID) {
        //Reject if video ID is missing.
        res.status(400).json({
            success: false,
            response: 'Missing video ID.'
        });
        return;
    }
    if (!title || description === undefined) {
        //Enforce that title cannot be empty and that description cannot be non existant in the request.
        res.status(400).json({
            success: false,
            response: 'Missing fields (Make sure you filled out the title).'
        });
        return;
    }
    if (title.length > 100) {
        //title mustn ot exceed 100 character limit
        res.status(400).json({
            success: false,
            response: 'Video title must not exceed 100 characters.'
        });
        return;
    }
    try {
        const { userID } = await verify(token);
        //Query the database for the specified video under the ownership of the token
        const video = await Video.findOne({
            where: {
                userId: userID,
                id: videoID
            }
        });
        if (!video) {
            res.status(403).json({
                success: false,
                response: 'You do not own this resource.'
            });
            return;
        }
        //edit the video according to the fields requested.
        video.title = title;
        video.description = description;
        await video.save();
        res.json({
            success: true,
            response: ''
        });
    } catch (err) {
        //handle unforeseen errors generically.
        console.error(err);
        res.status(400).json({
            success: false,
            response: err.message
        });
    }
});

//upload video endpoint
app.post('/uploadVideo', async (req, res) => {
    const { title, description, tags, token } = req.body
    if (!token) {
        //If no token is provided, reject since the user is not authencated.
        res.status(403).json({
            success: false,
            response: 'You are not logged in.'
        });
        return;
    }
    if (!title) {
        //title cannot be empty
        res.status(400).json({
            success: false,
            response: 'Missing video title.'
        });
        return;
    }

    if (title.length > 100) {
        //title mustn ot exceed 100 character limit
        res.status(400).json({
            success: false,
            response: 'Video title must not exceed 100 characters.'
        });
        return;
    }

    if (!req.files.video) {
        //uploading a video would need a video. duh.
        res.status(400).json({
            success: false,
            response: 'Missing video.'
        });
        return;
    }

    try {
        const { userID } = await verify(token);
        try {
            const uploader = await User.findOne({
                where: {
                    id: userID
                }
            });
            if (!uploader) {
                //verify the token
                res.status(400).json({
                    success: false,
                    response: 'User does not exist. Did you fake the token?'
                });
                return;
            }
            //create a database record of the uploaded video
            const uploadedFile = await Video.create({
                id: uuid(),
                title,
                description
            });
            uploadedFile.setUser(uploader);
            //move the uploaded video into the public path so that it is available for the outside world to see.
            req.files.video.mv(`./public/videos/${uploadedFile.id}.mp4`, async err => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        response: 'Unexpected issue with server.'
                    });
                    return;
                }
                //generate thumbnail
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
    } catch (err) {
        res.status(400).json({
            success: false,
            response: 'Malformed or Invalid Token/Secret.'
        });
    }
});

//endpoint for grabbing all videos that are stored in the database.
app.get('/videos', async (req, res) => {
    //query for all the videos and sort them by time created in descending order.
    const videos = await Video.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
            { model: User, attributes: ['username'] }
        ]
    });
    res.json({
        success: true,
        response: videos
    });
});

app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        //if either usename or password is non existant, the authentication is disqualified. reject.
        res.status(400).json({
            success: false,
            response: 'Username and password cannot be blank.'
        });
        return;
    }
    //find the username in the database
    const user = await User.findOne({
        where: {
            username: username.toLowerCase() //toLowerCase since username is case insensitive.
        }
    });
    if (!user) {
        res.status(400).json({
            success: false,
            response: 'That combination of username and password does not exist.'
        });
        return;
    }
    //compare the hash in the database with the password provided.
    const hashMatches = await compare(password, user.passwordHash);
    if (!hashMatches) {
        //hash does not match, meaning the password is incorrect.
        res.status(400).json({
            success: false,
            response: 'That combination of username and password does not exist.'
        });
        return;
    }
    /**
     * hash is correct, hence authentication is successful. We generat the user a valid JWT Token and send
     * it back to the user.
     */
    const token = await signToken({ userID: user.id });
    res.json({
        success: true,
        response: { token, username: user.username }
    });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        //Users cannot register with an empty username or password.
        res.status(400).json({
            success: false,
            response: 'Username and password cannot be blank.'
        });
        return;
    }
    //hash the password selected by the user so that we dont store plain text passwords.
    const passwordHash = await hash(password);
    try {
        //create the user record in the database and grant them a valid JWT
        const user = await User.create({
            id: uuid(),
            username: username.toLowerCase(),
            passwordHash
        });
        const token = await signToken({ userID: user.id });
        res.json({
            success: true,
            response: { token, username: user.username }
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            //Username already exists, refuse to register the user and ask them to log in.
            res.status(409).json({
                success: false,
                response: 'This username is already registered!'
            });
            return;
        }
        res.status(500).json({
            success: false,
            response: err.message
        });
    }
});

app.listen(process.env.PORT, () => console.log('Running on', process.env.PORT));
module.exports = app;

/**
 * ANything below are just convenience functions written to convert javascript's callback pattern to
 * promises since its more modern.
 */

function hash(password, saltRounds = 10) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
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
        bcrypt.compare(password, hash, (err, res) => {
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
        jwt.sign(data, process.env.JWTSECRET, (err, token) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(token);
        });
    });
}

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(decoded);
        });
    });
}