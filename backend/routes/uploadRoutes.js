import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  upload.single('file'),
  async (req, res) => {
    try{
      cloudinary.config({
        cloud_name: "dnmkzc4lh",
        api_key: "971833415794524",
        api_secret: "wL7wUcULdXgc55qs4MC4fj-tCN8",
      });
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req);
      res.send(result);
    }catch(err){
      console.log("errror in upload ")
      console.log(err)
    }
   
  }
);
export default uploadRouter;
