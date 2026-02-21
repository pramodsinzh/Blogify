import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true
})

const Subscription = mongoose.model("subscription", subscriptionSchema);

export default Subscription;
