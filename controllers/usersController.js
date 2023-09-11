const User = require('../models/User')
const bcrypt = require('bcrypt')

// @route GET /users
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
}

// @route GET /userid
const getOneUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required.' });

    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ "message": `No user matches ID ${req.params.id}.` });
    }
    res.json(user);
}

// @route POST /users
const createNewUser = async (req, res) => {
    const { fullName, email, role, password } = req.body

    if(!email || !password || !fullName || !role) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { fullName, email, role, "password": hashedPwd }

    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message: `New user ${fullName} created`})
    }else{
        res.status(400).json({message: 'Invalid user data recieved'})
    }
}

// @route PATCH /user
const updateUser = async (req, res) => {
    const {id, fullName, email, password } = req.body
    //console.log(req.body)

    if(!id || !fullName || !email){
        return res.status(400).json({message: req.body})
    }

    const user = await User.findById(id).exec()
    
    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    user.fullName = fullName
    user.email = email

    if(password){
        user.password = await bcrypt.hash(password, 10) //10 salt rounds
    }

    const updatedUser = await User.save()

    res.json({message: `${updatedUser.fullName} data updated`})
}

// @route DELETE /user
const deleteUser = async (req, res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({message: 'User ID required' })
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    const result = await user.deleteOne()

    const reply = `User ${result.fullName} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateUser,
    deleteUser
}