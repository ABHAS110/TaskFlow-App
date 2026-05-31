const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;
  let mongoUri = process.env.MONGO_URI;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries}/${maxRetries} failed: ${error.message}`);

      if (retries === maxRetries) {
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
          console.warn('⚠️  Could not connect to external MongoDB database.');
          console.log('⏳ Spinning up automated in-memory MongoDB server for local development...');
          try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            console.log(`🧠 In-Memory MongoDB Server started: ${mongoUri}`);
            
            const conn = await mongoose.connect(mongoUri);
            console.log(`✅ Connected to In-Memory MongoDB: ${conn.connection.host}`);
            return conn;
          } catch (memError) {
            console.error(`💀 Failed to start in-memory MongoDB server: ${memError.message}`);
            process.exit(1);
          }
        } else {
          console.error('💀 Max retries reached. Exiting process.');
          process.exit(1);
        }
      }

      const delay = 1000;
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

module.exports = connectDB;

