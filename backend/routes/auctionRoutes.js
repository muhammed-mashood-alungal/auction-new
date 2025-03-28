import express from 'express';
import Auction from '../models/auctionModel.js';
import { io } from '../index.js';
import { isAdmin, isAuth, isSeller } from '../utils.js';

const auctionRouter = express.Router();

auctionRouter.post('/', isSeller, async (req, res) => {
  try {
    const { title, description, startingBid, imageUrl, endDate  , seller} = req.body;
     console.log(seller)
    const newAuction = new Auction({
      title,
      description,
      startingBid,
      currentBid: startingBid,
      imageUrl,
      endDate,
      seller
    });

    const createdAuction = await newAuction.save();
    res
      .status(201)
      .json({ createdAuction, message: 'Auction Created Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

auctionRouter.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find({isDeleted :false});
    res.json(auctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific auction
auctionRouter.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.json(auction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

auctionRouter.post('/:id/bids', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const { bidder, bidAmount } = req.body;

    if (bidAmount <= auction.currentBid) {
      return res
        .status(400)
        .json({ message: 'Bid amount must be greater than current bid' });
    }

    if (auction.endDate === 0) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    auction.bids.push({ bidder: bidder, bidAmount: bidAmount });
    auction.currentBid = bidAmount;
    auction.bids.bidder = bidder;
     
    const updatedAuction = await auction.save();
    io.emit('bid', updatedAuction); // emit the 'bid' event with the updated auction
    res.json(updatedAuction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE auction by ID
auctionRouter.delete('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    auction.isDeleted = true
    await auction.save()
    if (!auction) {
      return res.status(404).send({ error: 'Auction not found' });
    }
    res.send({ auction, message: 'Auction Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

export default auctionRouter;
