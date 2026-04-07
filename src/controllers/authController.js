const User = require('../models/User');
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
    try{
        const { name, lastname, email, password } = req.body;
        if(!name){
            return res.status(400).json({
                status: 'error',
                message: 'Please enter name'
            })
        }
        if(!lastname){
            return res.status(400).json({
                status: 'error',
                message: 'Please enter last name'
            })
        }
        if(!email){
            return res.status(400).json({
                status: 'error',
                message: 'Please enter email'
            })
        }
        if(!password){
            return res.status(400).json({
                status: 'error',
                message: 'Please enter password'
            })
        }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                status: 'error',
                message: 'User already exist'
            })
        }
        const user = await User.create({
            name,
            lastname,
            email,
            password,
        });
        user.password = undefined;
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            user
        })
    } catch (error){
        console.log(error);
        return res.status(400).json({
            status: 'error',
            message: error.message,
        })
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter email'
            });
        }

        if (!password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter password'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        user.password = undefined;

        return res.status(200).json({
            status: 'success',
            message: 'Successfully logged in',
            token,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};
module.exports = {
    register, login
};