import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
        default: 0,
    },
    address: {
        type: String,
        required: true,
    },
    //doctor may work on more than one hospital so using array
    worksInHospital: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
    }],
    age: {
        type: Number,
        required: true,
    },
},{timestamps: true});

export const Doctor = mongoose.model('Doctor', doctorSchema);