import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    auctionId : {type : mongoose.Types.ObjectId , required : true , ref:'Auction'},
    sellerId : {type : mongoose.Types.ObjectId ,ref:'User' },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true }, 
      pinCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentResult: {
      type : String,
      enum : ["Paid" , "Not Paid"]
    },
    itemPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status :{type:String , enum : ['delivered' , 'pending'  , 'shipped' ]}
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
