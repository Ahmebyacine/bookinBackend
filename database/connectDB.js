const mongoose = require('mongoose');

const connectDB = async () => {
    const dbUsername = 'ahmedbelaid1921';
    const dbPassword = 'CEGesX7bVqfcq2H2';
    const dbName = 'booking';
    const dbCluster = 'ourproject.ua3pvwu.mongodb.net';
    const dbParams = 'retryWrites=true&w=majority&appName=ourProject';
    
    const mongoURI = `mongodb+srv://${dbUsername}:${dbPassword}@${dbCluster}/${dbName}?${dbParams}`;
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Database error: ${err}`);
        process.exit(1);
    }
};

module.exports = {connectDB};