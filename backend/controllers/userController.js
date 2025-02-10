import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary';
import serviceModel from "../models/serviceModel.js";
import bookingModel from "../models/bookingModel.js";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if all required fields are present
    if (!name || !password || !confirmPassword || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    // Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user data object
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // Save new user to the database
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate authentication token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesnt exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if ((!name, !phone, !address, !dob, !gender)) {
      return res.json({ success: false, meaage: "Data missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if(imageFile){
      // Upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageURL = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId, {image:imageURL})
    }

    res.json({success:true, message:"Profile Updated"})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api for booking
const bookService = async(req,res)=>{
   try {
    const {userId, serviceId, slotDate, slotTime} = req.body

    const serviceData = await serviceModel.findById(serviceId)

    if(!serviceData.available){
      return res.json({success:false, message:"Service not available"})
    }
    let slots_booked = serviceData.slots_booked

    //checking for slot availability
    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slotTime)){
         return res.json({ success: false, message: "Service Provider not available" });
      }else{
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
    delete serviceData.slots_booked

    const bookingData = {
      userId,
      serviceId,
      userData,
      serviceData,
      amount: serviceData.price,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newBooking = new bookingModel(bookingData)
    await newBooking.save()

    //save new Slots Data in serviceData
    await serviceModel.findByIdAndUpdate(serviceId, {slots_booked})

    res.json({success:true,message:"Service Booked"})

   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
}

//Api to get user appointments for my-bookings page
const listService = async(req,res)=>{
  try {
    const {userId} = req.body
    const bookings = await bookingModel.find({userId})

    res.json({success:true, bookings})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const cancelBooking = async (req, res) => {
  try {
    const { userId, bookingId } = req.body;
    const bookingData = await bookingModel.findById(bookingId);

    // Verify user
    if (!bookingData || bookingData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Cannot delete booking!" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, {
      cancelled: true,
      userCancelled: true, // ✅ Mark as cancelled by user
    });

    // Fetch service details
    const servicesData = await serviceModel.findById(bookingData.serviceId);
    if (!servicesData) {
      return res.json({ success: false, message: "Service not found!" });
    }

    // Remove booked slot
    const { slotDate, slotTime } = bookingData;
    let slots_booked = servicesData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
      if (slots_booked[slotDate].length === 0) delete slots_booked[slotDate];
    }

    await serviceModel.findByIdAndUpdate(bookingData.serviceId, {
      slots_booked,
    });

    res.json({ success: true, message: "Booking Cancelled by User" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookService, listService, cancelBooking};
