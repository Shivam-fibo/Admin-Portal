import { Data } from "../model/data.model.js";
const dataSave = async(req, res) =>{
    try {
         const { name, mail } = req.body;
        const newData = new Data({name, mail});
        await newData.save();
        res.status(201).json({ message: 'User saved successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error saving user', error });
    }
}
const getAllData = async(req, res) =>{
    try {
        const data = await Data.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
}
export {dataSave, getAllData}