const express = require('express');
const router = express.Router();
const { 
    addService, 
    allService,
    getServiceId,
    updateService,
    deleteService,
    getServiceBooked
 } = require('../services/servicesServices');
const { idValidator } = require('../utils/validators/idValidator');
const { addServiceValidator,updateServiceValidator } = require('../utils/validators/servicesValidator');
const {protect, allowedTo} = require('../services/authServices');

router.get('/allServices', allService);
router.use(protect);

// Create a new service
router.post('/services',allowedTo('admin', 'employee'),addServiceValidator, addService);

// Get all services
router.get('/services', allService);

// Get a service by ID
router.get('/services/:id',idValidator, getServiceId);

// GET service booked
router.get('/servicesBookedForYear/:year',allowedTo('admin', 'employee'), getServiceBooked);
// Update a service
router.patch('/services/:id',allowedTo('admin', 'employee'),updateServiceValidator, updateService);

// Delete a service
router.delete('/services/:id',allowedTo('admin', 'employee'),idValidator, deleteService);

module.exports = router;