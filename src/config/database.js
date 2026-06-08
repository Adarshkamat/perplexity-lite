import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("Connected to Database");
            });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectToDB;