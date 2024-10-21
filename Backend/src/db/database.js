import mongoose from "mongoose";


const ConnetDB = async () => {
    try {
        const connectionString = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected:", connectionString.connection.host);
    } catch (error) {
        console.log('MONGODB error', error);
    }
};

export default ConnetDB;
