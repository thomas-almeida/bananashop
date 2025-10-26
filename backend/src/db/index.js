import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
export async function connectDB() {
  try {
    await mongoose.connect(DB_URI);
    console.log(">>> DB CONNECTED ✉️");
  } catch (error) {
    console.log(error);
  }
}