const mongooose = require('mongoose')

const connectDB = async () => {
    try{
        await mongooose.connect(process.env.DATABASE_URI)
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB