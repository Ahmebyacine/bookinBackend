const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { Booking } = require('../models/bookingModel'); 
const { Service } = require('../models/serviceModel');
const ApiError = require('../utils/ApiError');


exports.addBooking = asyncHandler(async (req, res,next) => {
    try {
        const { service_id, ...bookingData } = req.body;

        // Retrieve the service details
        const service = await Service.findById(service_id).select('name price execution_time');
        if (!service) {
            return next(
              new ApiError(
                'Service not found',
                404
              )
            );
        }

        // Create a booking with a snapshot of the service details
        const booking = new Booking({
            ...bookingData,
            service_id, 
            service_name: service.name,
            service_price: service.price,
            service_execution_time: service.execution_time,
        });

        await booking.save();
        res.status(200).send(booking);
    } catch (error) {
        return next(
          new ApiError(
            'Something went wrong while processing your request.',
            500
          )
        );
    }
});
exports.allBooking = asyncHandler(async (req, res,next) => {
    try {
        const bookings = await Booking.find(req.params)
        .populate(
            {
                path: 'user_id',
                select: 'name email phone'
            }
        )
        .populate({
                path: 'service_id',
                select: 'name price execution_time'
        });;
        res.status(200).send(bookings);
    } catch (error) {
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
});
exports.getBookingEpmloyed = asyncHandler(async (req, res,next) => {
    try {
        const  userId  = req.params.id;
        const bookings = await Booking.find({
            $or: [
                { status: 'Pending' },
                { confirmed_by: userId },
                {confirmed_by_admin: true}
            ]
        })
        .populate({
            path: 'user_id',
            select: 'name email phone'
        })
        .populate({
            path: 'service_id',
            select: 'name price execution_time'
        });

        res.status(200).send(bookings);
    } catch (error) {
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
});
exports.getBookingId = asyncHandler(async (req, res,next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
          return next(
            new ApiError(
              'Not Bookin fond !',
              404
            )
          );
        }
        res.status(200).send(booking);
    } catch (error) {
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
});
exports.getBookingUser = asyncHandler(async (req, res,next) => {
    try {
        const bookings = await Booking.find({ user_id: req.params.id });
        res.status(200).send(bookings);
    } catch (error) {
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
});
exports.updateBooking = asyncHandler(async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'user_id',
        'service_id', 
        'booking_date', 
        'execution_time', 
        'status', 'number', 
        'time',
        'confirmed_by',
        'confirmed_by_admin'
    ];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return next(
        new ApiError(
          'Something went wrong ... Invalid updates!',
          400
        )
      );
    }

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return next(
              new ApiError(
                'No Booking fond!',
                404
              )
            );
        }

        // Update each field
        updates.forEach((update) => booking[update] = req.body[update]);

        // Save the updated booking
        await booking.save();
        res.status(200).send(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return next(
          new ApiError(
            'Something went wrong while processing your request.',
            400
          )
        );
    }
});
exports.deleteBooking = asyncHandler(async (req, res,next) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
          return next(
            new ApiError(
              'No Booking fond!',
              404
            )
          );
        }
        res.status(200).send(booking);
    } catch (error) {
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
});
exports.getBookingStatistics  = asyncHandler(async (req, res,next) => {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Calculate total bookings for the current and previous month
        const totalCurrentMonth = await Booking.countDocuments({
            created_at: {
                $gte: currentMonthStart,
                $lt: nextMonthStart,
            },
        });

        const totalPreviousMonth = await Booking.countDocuments({
            created_at: {
                $gte: previousMonthStart,
                $lt: currentMonthStart,
            },
        });

        const changePercentage = totalPreviousMonth
            ? ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100
            : 100;

        const currentMonthBookings = await Booking.find({
            created_at: {
                $gte: currentMonthStart,
                $lt: nextMonthStart,
            },
        }).populate('service_id');

        const totalCurrentMonthValue = currentMonthBookings.reduce((acc, booking) => acc + booking.number * booking.service_price, 0);
        const averageCurrentMonthValue = totalCurrentMonthValue / currentMonthBookings.length || 0;

        const previousMonthBookings = await Booking.find({
            created_at: {
                $gte: previousMonthStart,
                $lt: currentMonthStart,
            },
        }).populate('service_id');

        const totalPreviousMonthValue = previousMonthBookings.reduce((acc, booking) => acc + booking.number * booking.service_id.price, 0);
        const averagePreviousMonthValue = totalPreviousMonthValue / previousMonthBookings.length || 0;

        const averageChangePercentage = averagePreviousMonthValue
            ? ((averageCurrentMonthValue - averagePreviousMonthValue) / averagePreviousMonthValue) * 100
            : 100;

        res.status(200).json({
            totalBookings: totalCurrentMonth+totalPreviousMonth,
            totalChangePercentage: changePercentage.toFixed(1),
            averageBookingValue: averageCurrentMonthValue.toFixed(2),
            averageChangePercentage: averageChangePercentage.toFixed(1),
        });
    } catch (error) {
        console.error('Error fetching booking statistics:', error);
        return next(
          new ApiError(
            'Something went wrong while processing your request.',
            500
          )
        );
    }
});
exports.getBookingStatisticsMonthly = asyncHandler(async (req, res,next) => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Initialize arrays to store monthly data
        const monthlyBookingCounts = [];
        const monthlyBookingValues = [];

        // Loop through each month (0 = January, 11 = December)
        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(currentYear, month, 1); // Start of the month
            const nextMonthStart = new Date(currentYear, month + 1, 1); // Start of the next month

            // Get the total bookings for the month
            const totalBookings = await Booking.countDocuments({
                created_at: {
                    $gte: monthStart,
                    $lt: nextMonthStart,
                },
            });

            // Get all bookings for the current month and calculate the total value
            const bookings = await Booking.find({
                created_at: {
                    $gte: monthStart,
                    $lt: nextMonthStart,
                },
            }).populate('service_id');

            const totalBookingValue = bookings.reduce((acc, booking) => acc + booking.number * booking.service_price, 0);

            // Push the data for the current month to the arrays
            monthlyBookingCounts.push(totalBookings);
            monthlyBookingValues.push(totalBookingValue);
        }

        // Respond with the booking statistics for each month
        res.status(200).json({
            monthlyBookingCounts,  // Array of total bookings for each month
            monthlyBookingValues,  // Array of total booking values for each month
        });
    } catch (error) {
        console.error('Error fetching booking statistics:', error);
        return next(
          new ApiError(
            'Something went wrong while processing your request.',
            500
          )
        );
    }
});
exports.getBookingStatisticsUser = asyncHandler(async (req, res,next) => {
    const  userId  = req.params.id;
    const getStartOfYear = () => new Date(new Date().getFullYear(), 0, 1);
   const getEndOfYear = () => new Date(new Date().getFullYear() + 1, 0, 1);
    
      try {
        const monthlyStats = await Booking.aggregate([
          // Match bookings confirmed by the specific user in the current year
          {
            $match: {
              confirmed_by: new mongoose.Types.ObjectId(userId),
              booking_date: {
                $gte: getStartOfYear(), // Start of the year
                $lt: getEndOfYear()     // End of the year
              }
            }
          },
          
          // Group by month and status to get totals
          {
            $group: {
              _id: {
                month: { $month: '$booking_date' },  
                status: '$status'                   
              },
              totalBookings: { $sum: 1 },          
              totalServiceValue: { $sum: '$service_price' }
            }
          },
          {
            $group: {
              _id: '$_id.month',
              statuses: {
                $push: {
                  status: '$_id.status',
                  totalBookings: '$totalBookings',
                  totalServiceValue: '$totalServiceValue'
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ]);
    
        // Reformat the results to match your desired output
        const formattedStats = monthlyStats.reduce((acc, curr) => {
          const monthName = new Date(0, curr._id - 1).toLocaleString('en-US', { month :'long'});
          acc[monthName] = { statuses: curr.statuses };
          return acc;
        }, {});
    
        const yearlyTotals = await Booking.aggregate([
            {
              $match: {
                confirmed_by: new mongoose.Types.ObjectId(userId),
                booking_date: {
                  $gte: getStartOfYear(),
                  $lt: getEndOfYear()
                }
              }
            },
            {
              $group: {
                _id: '$status', // Group by status
                totalBookings: { $sum: 1 }, // Count bookings for each status
                totalServiceValue: { $sum: '$service_price' } // Sum service prices for each status
              }
            },
            {
              $group: {
                _id: null, // Combine all statuses together
                statuses: {
                  $push: {
                    status: '$_id',
                    totalBookings: '$totalBookings',
                    totalServiceValue: '$totalServiceValue'
                  }
                },
                totalBookingsYear: { $sum: '$totalBookings' }, // Sum all bookings
                totalServiceValueYear: { $sum: '$totalServiceValue' } // Sum all service values
              }
            },
            {
              $addFields: {
                // Ensure "Confirmed" is included, and exclude "Pending"
                statuses: {
                  $concatArrays: [
                    {
                      $filter: {
                        input: '$statuses',
                        as: 'status',
                        cond: { $ne: ['$$status.status', 'Pending'] } // Exclude "Pending"
                      }
                    },
                    // Add "Confirmed" if it's missing or adjust totals if present
                    [
                      {
                        status: 'Confirmed',
                        totalBookings: {
                          $reduce: {
                            input: '$statuses',
                            initialValue: 0,
                            in: {
                              $cond: {
                                if: { $eq: ['$$this.status', 'Confirmed'] },
                                then: '$$this.totalBookings',
                                else: '$$value'
                              }
                            }
                          }
                        },
                        totalServiceValue: {
                          $reduce: {
                            input: '$statuses',
                            initialValue: 0,
                            in: {
                              $cond: {
                                if: { $eq: ['$$this.status', 'Confirmed'] },
                                then: '$$this.totalServiceValue',
                                else: '$$value'
                              }
                            }
                          }
                        }
                      }
                    ]
                  ]
                }
              }
            }
          ]);
          
        // Response combining both monthly and yearly data
        res.status(200).json({
          userId,
          monthlyStats: formattedStats,
          yearlyTotals: yearlyTotals[0] || { totalBookingsYear: 0, totalServiceValueYear: 0 }
        });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
          }
});