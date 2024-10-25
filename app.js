const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database/connectDB');
const bookingRoute = require('./routes/bookingRoute');
const userRoute = require('./routes/userRoute');
const servicesRoute = require('./routes/servicesRoute');
const authRoute = require('./routes/authRoute');
const globalError = require('./middlewares/errorMiddleware');
const ApiError = require('./utils/ApiError');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use(authRoute);
app.use(servicesRoute);
app.use(userRoute);
app.use(bookingRoute);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);


const port =process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});