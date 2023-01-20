module.exports = (app)=>{
    const {
       register,
       getAllUsers,
       upload,
       login,
       updateUserDetails,
       deleteUser,
       changePassword,
       getAuthToken
    } = require('../controller/user');
    const express = require('express');
    const {verifyToken} = require('../middleware/authjwt')
    app.use(express.static(__dirname + '/public'));
    app.use('/uploads', express.static('uploads'));

    app.post('/register',upload.single("Image"),register);
    app.post('/login',login)
    app.get('/users',verifyToken,getAllUsers);
    app.put('/updateUserDetails',verifyToken,upload.single("Image"),updateUserDetails);  
    app.put('/deleteUser',verifyToken,deleteUser);
    app.post('/changePassword/:userid',verifyToken,changePassword);
    app.post('/genrateToken',getAuthToken)
}