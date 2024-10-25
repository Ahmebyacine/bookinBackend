const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User } = require('../models/userModel');
const ApiError = require('../utils/ApiError');


exports.addUser = asyncHandler(async (req, res,next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              400
            )
          );
    }
});
exports.allUser = asyncHandler(async (req, res,next) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});
exports.getUserId = asyncHandler(async (req, res,next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(
                new ApiError(
                  'No User fond!',
                  404
                )
              );
        }
        res.status(200).send(user);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});
exports.updateUser = asyncHandler(async (req, res,next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'phone','role'];
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
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(
                new ApiError(
                  'No User fond!',
                  404
                )
              );
        }

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              400
            )
          );
    }
});
exports.deleteUser = asyncHandler(async (req, res,next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(
                new ApiError(
                  'No User fond!',
                  404
                )
              );
        }
        res.status(200).send(user);
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});
exports.statisticsUsers = asyncHandler(async (req, res,next) => {
    try {
        const currentDate = new Date();
        const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        // Get the number of users created this month
        const currentMonthCount = await User.countDocuments({
            created_at: { $gte: startOfCurrentMonth }
        });

        // Get the number of users created last month
        const lastMonthCount = await User.countDocuments({
            created_at: { $gte: startOfLastMonth, $lt: startOfCurrentMonth }
        });

        // Calculate the percentage change
        let percentageChange = 0;
        if (lastMonthCount > 0) {
            percentageChange = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
        }

        res.json({
            currentMonthCount,
            percentageChange: percentageChange.toFixed(2)
        });
    } catch (error) {
        return next(
            new ApiError(
              'Something went wrong while processing your request.',
              500
            )
          );
    }
});
exports.changePassword = asyncHandler(async (req, res,next) => {
  try{
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new ApiError(
        'No User fond!',
        404
      )
    );
  }

  const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!isMatch) {
    return next(
      new ApiError(
        'Incorrect old password',
        404
      )
    );
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  // Update the password in the database
  user.password = hashedPassword;
  await user.save();
  res.status(200).send({message:"password Update succesful!"});
} catch (error) {
  console.error(error);
  return next(
      new ApiError(
        'Something went wrong while processing your request.',
        500
      )
    );
}
});
exports.updateUserPublic = asyncHandler(async (req, res,next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone'];
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
      const user = await User.findById(req.user._id);
      if (!user) {
          return next(
              new ApiError(
                'No User fond!',
                404
              )
            );
      }

      updates.forEach((update) => user[update] = req.body[update]);
      await user.save();
      res.status(200).send(user);
  } catch (error) {
      return next(
          new ApiError(
            'Something went wrong while processing your request.',
            400
          )
        );
  }
});
exports.getLoggedUser = asyncHandler(async (req, res,next) => {
  try {
      const user = await User.findById(req.user._id);
      if (!user) {
          return next(
              new ApiError(
                'No User fond!',
                404
              )
            );
      }
      res.status(200).send(user);
  } catch (error) {
      return next(
          new ApiError(
            'Something went wrong while processing your request.',
            500
          )
        );
  }
});