import mongoose from 'mongooose';

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: {
        type: [orderItemSchema],
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    //creating restrective field for order process,deliverd,shipped
    status: {
        type: String,
        enum: ['PENDING', 'CANCLED', 'DELIVERED'],
        default: 'PENDING',
    }
},{timestamps: true});

export const Order = mongoose.model('Order',orderSchema);
