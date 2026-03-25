import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    image: { type: String, default: "" },
}, { timestamps: true })
const User = mongoose.model("User", userSchema)
export default User;