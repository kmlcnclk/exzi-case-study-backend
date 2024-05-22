import mongoose from "mongoose";

// Connect Database
const connectDatabase = () => {
  const MONGO_URI = process.env.MONGO_URI as string;

  mongoose
    .connect(MONGO_URI, {})
    .then(() => {
      console.log("Mongo DB Connection Successful");
    })
    .catch((err: any) => {
      console.error(err);
    });
};

export default connectDatabase;
