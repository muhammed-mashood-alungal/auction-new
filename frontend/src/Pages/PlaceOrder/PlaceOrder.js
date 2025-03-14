import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../Components/CheckoutSteps/CheckoutSteps';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import { Store } from '../../Store';
import './PlaceOrder.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default function PlaceOrder() {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    pinCode: '',
    city: '',
    country: ''
  })
  const [isAddressEditing , setAddressEditing] = useState(true)
  const location = useLocation();
  const auction = location.state
  console.log(auction)
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 10000 ? round2(0) : round2(500);

  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const validateAddress=()=>{
    if(shippingAddress.address.trim() == ""){
      toast.error("Please Provide a Address")
      return false
    }
    if(shippingAddress.city.trim() == ""){
      toast.error("Please Provide a City")
      return false
    }
    if(shippingAddress.country.trim() == ""){
      toast.error("Please Provide a Country")
      return false
    }
    if(shippingAddress.fullName.trim() == ""){
      toast.error("Please Provide a Full Name")
      return false
    }
    if(shippingAddress.pinCode.trim() == ""){
      toast.error("Please Provide a pin Code")
      return false
    }
    if(isAddressEditing){
      toast.error("Please Click Ok to Cofirm Your Address")
      return false
    }
    return true
  }
  const placeOrderHandler = async () => {
    try {
      console.log('asdfasfd')
      
      if(!validateAddress()) return
      console.log('asdfasfd')
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: shippingAddress,
          itemPrice:auction.bids[auction.bids.length - 1]?.bidAmount,
          shippingPrice: 100,
          totalPrice: auction.bids[auction.bids.length - 1]?.bidAmount + 100,
          user: userInfo._id,
          auctionId:auction._id
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  // useEffect(() => {
  //   if (!cart.paymentMethod) {
  //     navigate('/payment');
  //   }
  // }, [cart, navigate]);

  const handleAddressChange = (e) => {
    const key = e.target.name
    const value = e.target.value

    console.log(key ," " , value)
    setShippingAddress(address =>{
      return {...address , [key] : value}
    }) 
  }
  return (
    <div className="areas">
      <ul className="circless">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Place Order-EcomBidding</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        {/* Preview Order */}
        <div className="flex flex-col w-full">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Preview Order
          </h1>

          <div className="flex-none w-full lg:w-auto">
            {/* Shipping Card */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Shipping
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Name: </strong>
                <input value={shippingAddress.fullName} onChange={handleAddressChange} name='fullName'  disabled={!isAddressEditing}/>
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Address: </strong>
                <input value={shippingAddress.address} onChange={handleAddressChange} name='address'  disabled={!isAddressEditing}/>
              </p>
              <p className="text-gray-700 mb-4">
                <strong>City: </strong>
                <input value={shippingAddress.city} onChange={handleAddressChange} name='city'  disabled={!isAddressEditing}/>
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Pin Code: </strong>
                <input value={shippingAddress.pinCode} onChange={handleAddressChange} name='pinCode'  disabled={!isAddressEditing}/>
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Country: </strong>
                <input value={shippingAddress.country} onChange={handleAddressChange} name='country'  disabled={!isAddressEditing}/>
              </p>
              <p className="text-cyan-500 hover:text-cyan-600" onClick={()=>setAddressEditing(!isAddressEditing)}>
              {isAddressEditing ? "OK" : "Edit"}
              </p>
           
            </div>

            {/* Payment Card */}
            {/* <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Payment
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
              <a href="/payment" className="text-cyan-500 hover:text-cyan-600">
                Edit
              </a>
            </div> */}

            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-700">Items</p>
                  <p className="text-gray-700">
                    {auction.bids[auction.bids.length-1].bidAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-gray-700">
                    {100}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">Order Total</p>
                  <p className="text-lg font-semibold">
                    <small>₹</small>
                    {(auction.bids[auction.bids.length-1].bidAmount + 100).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 duration-200 mt-4"
                  onClick={placeOrderHandler}
                >
                  Checkout
                </button>
                {loading && <Loading />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow lg:w-full lg:ml-8 lg:mt-8  mr-2 overflow-x-auto">
          <h1 className="text-2xl font-semibold text-gray-800 lg:mt-[-30px] lg:mb-4">
            Products
          </h1>

         
            <div
              className="bg-white rounded-lg shadow-md p-4 hover:px-8 mb-2 md:mb-2  duration-500"
            
            >
              <div className="flex items-center space-x-4 mb-0">
                <img
                  src={auction.imageUrl}
                  className="w-16 h-16 bg-gray-200 rounded-full"
                ></img>
                <div className="flex-grow text-center pt-4">
                  <Link
                    to={`/products/${auction._id}`}
                    className="text-gray-700 font-semibold"
                  >
                    {auction.title}
                  </Link>
                  <p>{auction.description}</p>
                 
                </div>
                <p className="text-gray-700 ml-auto">
                  Final Bid: <small>₹</small>
                  {(auction.bids[auction.bids.length-1].bidAmount).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
}
