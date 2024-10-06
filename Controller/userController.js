
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const users = require("../data/users");
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const path = require('path');

const saltRounds = 10;
const filePath = path.join(__dirname, '..', 'data', 'users.json');

const registerSchema = Joi.object({ //set valid input parameters for new user registration
    username: Joi.string().min(2).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required()
});

const registerUser = async (req,res) =>{
    const { error } = registerSchema.validate(req.body); //validate input to fit schema
    if(error){
        return res.status(400).json({ error: error.details[0].message });
    }
    try{
        const usersData = await fs.readFile(filePath, 'utf-8'); //read and parse json mock data
        const parsedUsers = JSON.parse(usersData);

        const {email, username, password }= req.body; //Determine whether email already in use
        const existingUser = parsedUsers.find(user => user.email === email )
        if(existingUser){
            return res.status(401).json({error: 'User with this email already exists'});
        }
        const hashedPassword = await bcrypt.hash(password,10); //could also use bcrypt.genSalt for greater control
        const newUser = {id:parsedUsers.length+1 , username, password:hashedPassword, email};
        parsedUsers.push(newUser); //append new user to list of existing users


        await fs.writeFile(filePath, JSON.stringify(parsedUsers, null, 2)); //
        return res.status(201).json({ message: 'User registered successfully.' });
        
    }
    catch(err){
        console.error(err);
        return res.status(500).json({error: 'Unable to register user. Server error'});
    }
};


const loginUser = async (req,res) =>{
    try{
        const usersData = await fs.readFile(filePath, 'utf-8'); 
        const parsedUsers = JSON.parse(usersData);

        const {username, password }= req.body; 
        const foundUser = parsedUsers.find(user => user.username === username) //check if username and password match a user in db
        if(!foundUser){
            return res.error(401).json({error: 'Username not found'});
        }
        const validPassword = await bcrypt.compare(password, foundUser.password);
        if(!validPassword){
            return res.error(401).json({error: 'Incorrect password'});
        }

        //afterwards send a res with a jwt token
        const token = jwt.sign({ ID: foundUser.ID, username: foundUser.username }, 'SECRET_KEY',{
            expiresIn: '1h',
          });

        return res.status(200).json({ message: 'Login successful', token });
    }
    catch(err){
        return res.error(500).json({ error: 'Unable to login user. Server error'});
    }
};

const profileDetails = async (req, res) => {
    try{
        const usersData = await fs.readFile(filePath, 'utf-8'); 
        const parsedUsers = JSON.parse(usersData);
        const foundUser = parsedUsers.find(user => user.username === req.user.username);
        if(!foundUser){
            return res.status(404).json({ error: 'User not found' });
        }
        const { password, ...userDetails } = foundUser;
        res.json(userDetails);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Unable to retrieve user profile.' });
    }

}

module.exports = {
    registerUser,
    loginUser,
    profileDetails
}; 