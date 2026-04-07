const User = require('../models/User');

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
}
module.exports = {register};