const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_Signup = async (req, res, next)=>{

    await User.find({email: req.body.email})
    .exec()
    .then(user =>{
if(user.length>=1){
    return res.status(409).json({
        message: 'This email already exist'
    });
}   else{
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err){
                return res.status(500).json({
                    error: err
                });
            } 
            else{
                    const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password: hash 
                });
                user.save()
                .then(result =>{
                    console.log(result);
                    res.status(201).json({
                        message: 'User is successfully created'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                    error: err 
                    })
                    
                } );
            }

    });
}
    });

}

exports.user_Login = async (req, res, next)=>{
    await User.find({email: req.body.email})
        .exec()
        //get user array
        .then(user=>{
            if(user.length<1){
            return res.status(401).json({
                message: 'Authentication failed'
            });   
            }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message: 'Authentication failed one'
                }); 
            }
                if(result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    'secret',
                    {
                        expiresIn: "1h"
                    }
                    );
                    return res.status(200).json({
                        message: 'Authenticated with success',
                        token: token
                    });
                } 
                res.status(401).json({
                    message: 'Authentication failed to'
                });
        });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }

exports.user_Delete = async (req, res, next)=>{
    
    await User.findByIdAndDelete({_id: req.params.userId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'User is deleted from our database'
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    }); 
}