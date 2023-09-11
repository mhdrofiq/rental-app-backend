const express = require('express')
const router = express.Router()
const path = require('path')

//only match if the requrested route is only a slash
//could request just slash, just slash index, index.html
router.get('^/$|/index(.html)?', (req, res) => {
    /*
    tell it where to find the file to send
    '..' look out of the routes folder
    'views' look at the views folder
    'index.html' look for the index.html file
    */
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router