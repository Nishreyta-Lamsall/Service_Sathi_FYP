import serviceModel from "../models/serviceModel.js";
import {v2 as cloudinary} from "cloudinary"
import jwt from "jsonwebtoken";

//API for adding services
const addService = async (req, res) => {
  try {
    const { name, category, about, price } = req.body;
    const imageFile = req.file;

    //checking for all data to add srevice
    if(!name || !category || !about || !price){
        return res.json({success:false, message:"Missing details"})
    }

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const existingService = await serviceModel.findOne({ name });
    if (existingService) {
      return res
        .status(400)
        .json({ success: false, message: "Service name must be unique" });
    }

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
    const imageUrl = imageUpload.secure_url

    const serviceData = {
        name,
        image:imageUrl,
        category,
        about,
        price
    }

    const newService = new serviceModel(serviceData)
    await newService.save()

    res.json({success:true,message:"Service Added"})

    // Proceed with saving the service to the database here
  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
};

//API for admin login
const loginAdmin = async (req,res)=>{
    try{

        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
             const token = jwt.sign(email+password,process.env.JWT_SECRET)
             res.json({success:true,token})
 
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }

}

export { addService, loginAdmin};
