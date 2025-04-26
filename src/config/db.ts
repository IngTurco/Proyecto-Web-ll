import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI!;
if (!uri) {
  console.error('❌ Falta MONGODB_URI en .env');
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  }
};
