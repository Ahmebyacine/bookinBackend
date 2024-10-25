const asyncHandler = require('express-async-handler');
const { Booking } = require('../models/bookingModel'); 
const { Service } = require('../models/serviceModel');
const ApiError = require('../utils/ApiError');


exports.addService = asyncHandler(async (req, res,next) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(200).send(service);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              400
            )
          );
    }
});
exports.allService = asyncHandler(async (req, res,next) => {
    try {
        const services = await Service.find();
        res.status(200).send(services);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});
exports.getServiceId = asyncHandler(async (req, res,next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).send();
        }
        res.status(200).send(service);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});
exports.updateService = asyncHandler(async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'availability','execution_time'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return next(
            new ApiError(
                'Invalid updates!',
              400
            )
          );
    }

    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return next(
                new ApiError(
                    'No Services fond!',
                  404
                )
              );
        }

        updates.forEach((update) => service[update] = req.body[update]);
        await service.save();
        res.status(200).send(service);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              400
            )
          );
    }
});
exports.deleteService = asyncHandler(async (req, res,next) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return next(
                new ApiError(
                    'No Services fond!',
                  404
                )
              );
        }
        res.status(200).send(service);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});
exports.getServiceBooked = asyncHandler(async (req, res,next) => {
    try {
        const { year } = req.params;
        const yearStart = new Date(year, 0, 1); // January 1st of the year
        const yearEnd = new Date(year, 11, 31, 23, 59, 59); // December 31st, end of the year

        // Aggregate bookings by service and count how many times each service was booked
        const serviceBookings = await Booking.aggregate([
            {
                $match: {
                    created_at: {
                        $gte: yearStart,
                        $lte: yearEnd,
                    },
                },
            },
            {
                $group: {
                    _id: '$service_name', 
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 }, // Sort by the number of bookings, descending
            },
        ]);

        res.status(200).json(serviceBookings);
    } catch (error) {
        console.error('Error fetching services booked for the year:', error);
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});