require('dotenv').config()
require('express-async-errors') //this lets us use async/await with express (instead of try/catch and asynchandler inside the controller)

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/dbConn')

const app = express()
const path = require('path')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

//uncomment to check environment variables
//prints 'development' in console
console.log(process.env.NODE_ENV)

connectDB()

app.use(express.json()) //to process
app.use(cookieParser()) //to parse cookie
app.use(cors(corsOptions)) //allows urls in allowedOrigins to access our resources from api

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/vehicles', require('./routes/vehicleRoutes'))
app.use('/orders', require('./routes/orderRoutes'))

//everything that doesnt go to the routes above goes here
app.all('*', (req, res) => {
    res.status(404)
    //look at the headers that come in and determine what kind of response to send
    if(req.accepts('html')){ //if the request has an accepts header that is html
        //send the 404 page
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    //if there was a json request that wasnt routed properly
    } else if(req.accepts('json')){
        res.json({message: '404 Not Found'})
    //if it's not html or json
    } else {
        res.type('txt').send('404 Not Found')
    }
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
})