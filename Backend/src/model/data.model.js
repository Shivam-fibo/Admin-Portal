import mongoose, {Schema} from "mongoose";

const  dataSchema =  new Schema({
    name: String,
    mail: String
})

export const Data = mongoose.model('Data', dataSchema)