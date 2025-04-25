import mongoose from 'mongoose';
import 'dotenv/config.js';  

// Use environment variables for sensitive information
const url = process.env.MONGO_URI;

// Check if the URL is defined
mongoose.connect(url)
  .then(() => {

    // Log the connection URL
    console.log('NODEJS TO MongoDB Connection ESTABLISHED...');

  })
  .catch((err) => {

    // Log the error details if the connection fails
    console.error('Error in DB connection:', JSON.stringify(err, null, 2));
    process.exit(1);
});

export default mongoose;