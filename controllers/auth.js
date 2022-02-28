const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Patient = require('../models/Patient.js');
const Doctor = require('../models/Doctor.js');
const Pharma_Inc = require('../models/Pharma_Inc.js');


const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const type = req.body.type;
    delete req.body.type;
    const hasedPassword = await bcrypt.hash(req.body.password, 12);
    try {
        if (type === 'patient'){
            const newPatient = new Patient({
                ...req.body,
                password: hasedPassword
    
        });
        
        await newPatient.save();
        res.status(201).json(newPatient);
        }
        else if (type === 'doctor') {
            const newDoctor = new Doctor({
                ...req.body,
                password: hasedPassword
    
        });
        
        await newDoctor.save();
        res.status(201).json(newDoctor);
        }

        else if (type === 'pharma_inc') {
            const newPharma = new Pharma_Inc({
                ...req.body,
                password: hasedPassword
    
        });
        
        await newPharma.save();
        res.status(201).json(newPharma);
        }

        else {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
       return next(error)
        }
        
    } 
    
    catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
                }
                next(err);
    }
   
}

// // just for testing
// getall = async (req, res) => {
//     const data = await Patient.find({})
//     res.json({data})
// }

const login = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    // User.findOne({ email: email })
    //   .then(user => {
    //     if (!user) {
    //       const error = new Error('A user with this email could not be found.');
    //       error.statusCode = 401;
    //       throw error;
    //     }
    //     loadedUser = user;
    //     return bcrypt.compare(password, user.password);
    //   })
    //   .then(isEqual => {
    //     if (!isEqual) {
    //       const error = new Error('Wrong password!');
    //       error.statusCode = 401;
    //       throw error;
    //     }
    //     const token = jwt.sign(
    //       {
    //         email: loadedUser.email,
    //         userId: loadedUser._id.toString()
    //       },
    //       'somesupersecretsecret',
    //       { expiresIn: '1h' }
    //     );
    //     res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    //   })
    //   .catch(err => {
    //     if (!err.statusCode) {
    //       err.statusCode = 500;
    //     }
    //     next(err);
    //   });

    let loaded;
    if (type === 'patient'){
        loaded = await Patient.findOne({email: email});
    }

    else if (type === 'doctor'){
        loaded = await Doctor.findOne({email: email});
    }

    else if (type === 'pharma_inc'){
        loaded = await Pharma_Inc.findOne({email: email});
    }

    else {
        const error = new Error('Log in Failed.');
        error.statusCode = 422;
       return next(error)
    }


    try {

         if (!loaded) {
          const error = new Error('A user with this email could not be found.');
          error.statusCode = 401;
          return next(error)
        }

        const validPassword = await bcrypt.compare(password, loaded.password);
        if (!validPassword){
          const error = new Error('Wrong password!');
          error.statusCode = 401;
          return next(error);
        
        }

        const token = jwt.sign(
          {
            email: loaded.email,
            userId: loaded._id.toString()
          },
          process.env.jwt_secret_key,
          { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, userId: loaded._id.toString() });
        
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

    
    

}






module.exports = {
    register, login
}