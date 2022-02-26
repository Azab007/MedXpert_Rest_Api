const { default: mongoose } = require("mongoose");
const Doctor = require("../models/Doctor.js");
const Drug = require("../models/Drug.js");
const Patient = require("../models/Patient.js")

exports.register =async (req, res) => {
//    const user = new Drug({
//        Inc_id:mongoose.Types.ObjectId("621a2990ae1c5683924bae99"),
//        drugName: "catafast",
//        price: 10.6,
//        interactions: [{drug_id: mongoose.Types.ObjectId("621a2990ae1c5683924bae99"), description: "asdasdasd", level: "asasda"}],
//        restrictions: [{condition_name:"sugar", description: "asdasd" }],
       
//    });
   try {
       const user = await Drug.findById("621a2990ae1c5683924bae99");
       user.clinicians.push(mongoose.Types.ObjectId("621a2b7eb3f0e348f19bed10"));
       await user.save();
       res.status(200).json(user);
       
   } catch (error) {
       console.log(error)
   }
}