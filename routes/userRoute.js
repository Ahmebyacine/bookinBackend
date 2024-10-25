const express = require('express');
const router = express.Router();
const { 
    addUser, 
    allUser, 
    getUserId,
    updateUser,
    deleteUser,
    statisticsUsers,
    changePassword,
    updateUserPublic,
    getLoggedUser
} = require('../services/userServices');
const { 
    addUserValidator, 
    updateUserValidator, 
    updateUserPublicValidator, 
    changeUserPasswordValidator
} = require('../utils/validators/userValidator');

const { idValidator } = require('../utils/validators/idValidator');
const {protect ,allowedTo} = require('../services/authServices');

router.use(protect);


// Private access Admine access

// Create a new user
router.post('/users',allowedTo('admin', 'employee'),addUserValidator, addUser);

// Get all users
router.get('/users',allowedTo('admin', 'employee'), allUser);

// Get a user by ID
router.get('/users/:id',allowedTo('admin', 'employee'),idValidator, getUserId);

// Update a user by admin
router.patch('/users/:id',updateUserValidator, updateUser);

// Delete a user
router.delete('/users/:id',allowedTo('admin', 'employee'),idValidator, deleteUser);

// statistics User
router.get('/userStats',allowedTo('admin', 'employee'), statisticsUsers);



// Public access Logged operation


//logged Usr info
router.get('/my-info', getLoggedUser);

// update  auser loggedd in
router.put('/change-info', updateUserPublic);

// change use Password form user
router.put('/change-password' ,changeUserPasswordValidator,changePassword);

module.exports = router;