import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
    },
    name: {
        type: String,
        required: [true, "Please enter Name"],
    },
    email: {
        type: String,
        //   value must be unique else mongoose will throw error
        unique: [true, "Email already exists"],
        required: [true, "Please enter Email"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Please add Photo"],
    },
    role: {
        type: String,
        //   enum for defining the range of values that are allowed
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter DOB"],
    },
}, {
    timestamps: true,
});
// we cannot take age as input from user, so we will calculate it using virtuals
// virtuals are the properties that are not stored in the database but are calculated using some other properties
// since age is increase with time so its always better to derive it from DOB
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
// directly we couldnt add virtual attributes to the model so we need to use the below code
// this code will add the virtual attributes to the model
export const User = mongoose.model("User", schema);
