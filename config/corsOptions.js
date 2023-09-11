const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        /*
        !origin lets apps like postman access our api, removing it will
        only allow the origins in allowedOrigins to access our api
        */
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by cors'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}

module.exports = corsOptions