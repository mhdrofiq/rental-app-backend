const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const role = foundUser.role
        const userId = foundUser._id
        const email = foundUser.email
        const fullName = foundUser.fullName
        
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": email,
                    "fullName": fullName,
                    "role": role,
                    'userId': userId,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' } //set to minutes/hours
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } //set to days
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        //console.log(role);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000 
        });

        // Send authorization roles and access token to user
        res.json({ 
            email, 
            fullName, 
            userId, 
            role, 
            accessToken });

    } else {
        res.sendStatus(401);
    }
}

const adminRegister = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        const result = await User.create({
            "password": hashedPwd,
            "email": email,
            "fullName": fullName,
            "role": "Administrator",
        });

        //console.log(result);

        res.status(201).json({ 'success': `New user ${result} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const reviewerRegister = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        const result = await User.create({
            "password": hashedPwd,
            "email": email,
            "fullName": fullName,
            "role": "Reviewer",
        });

        //console.log(result);

        res.status(201).json({ 'success': `New user ${result} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const logout = async (req, res) => {
    const cookies = req.cookies //check for the cookie
    
    //if the cookie doesnt exist
    if (!cookies?.jwt) return res.sendStatus(204) //204 means no content
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken }).exec()
    if(!foundUser){
    //clearing the cookie 
    res.clearCookie('jwt', { 
        httpOnly: true, 
        sameSite: 'None', 
        secure: true 
    })
    return res.sendStatus(204) //204 means no content
    }

    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)

    res.clearCookie('jwt', {
        httpOnly: true, 
        sameSite: 'None', 
        secure: true
    })
    res.status(200).json({ message: 'Cookie cleared' })
}

const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);  //check if cookie exists
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {

            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

            const role = foundUser.role;
            const userId = foundUser._id;
            const fullName = foundUser.fullName;
            const email = foundUser.email;

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": email,
                        "fullName": fullName,
                        "role": role,
                        'userId': userId,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );
            res.json({ 
                email, 
                fullName, 
                userId, 
                role, 
                accessToken 
            })
        }
    );
}

module.exports = { 
    login, 
    adminRegister, 
    reviewerRegister, 
    logout, 
    refresh 
};
