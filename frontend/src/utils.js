function truncate(text, length) {
    if (text.length <= length) {
        return text;
    }
    return text.slice(0, length - 3) + '...';
}

function getThumbnailUrl(videoID) {
    return process.env.REACT_APP_API + '/thumbnails/' + videoID + '-thumbnail-1280x720-0001.png';
}


module.exports = { truncate, getThumbnailUrl }