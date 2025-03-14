import express from 'express';
import Order from '../models/orderModel.js';

import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

import expressAsyncHandler from 'express-async-handler';
import Auction from '../models/auctionModel.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.post(
  '/',

  expressAsyncHandler(async (req, res) => {
    try {
      console.log(req.body)
      const newOrder = new Order({

        auctionId: req.body.auctionId,
        sellerId: req.body.sellerId,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemPrice: req.body.itemPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.body.user,

      })

      const order = await newOrder.save();
      await Auction.findByIdAndUpdate(req.body.auctionId , {$set : {isOrderPlaced : true}})
      res.status(201).send({
        message: 'New Order Created',
        order: order.toObject({ getters: true }),
      });
    } catch (err) {
      console.log(err)
    }

  })
);

orderRouter.get(
  '/summary',

  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try{
      const order = await Order.findById(req.params.id).populate('auctionId')
      if (order) {
        console.log(order)
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      } 
    }catch(err){
      console.log(err)
    }
   
  })
);
orderRouter.get(
  '/mine/:userId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({user : req.params.userId}).populate('user')
    if (orders) {
      res.send(orders)
    } else {
      res.status(404).send({ message: 'Orders Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.findByIdAndDelete(req.params.id);
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid Successfully', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/change-status-to/:status',

  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (order) {
        const status = req.params.status
        order.status = status
        if (status == 'delivered') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
          order.paymentResult=  'Paid'
          order.isPaid = true
          order.paidAt =  Date.now()
        }else{
          order.isDelivered = false;
          order.deliveredAt =null;
          order.paymentResult = "Not Paid"
          order.isPaid = false
        }

        await order.save();
        res.send({ message: 'Order Status Changed' });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    } catch (err) { 
      console.log(err)
    }

  })
);

export default orderRouter;
