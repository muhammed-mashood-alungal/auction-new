import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError } from '../../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './ChangePassword.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function ChangePassword() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [oldPass , setOldPass] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState(userInfo.seller?.name || '');
  const [sellerLogo, setSellerLogo] = useState(userInfo.seller?.logo || '');
  const [sellerDescription, setSellerDescription] = useState(
    userInfo.seller?.description || ''
  );

  const params = useParams();
  const { id: userId } = params;

  // eslint-disable-next-line no-unused-vars
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
     const passwordRegex =
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        if (!passwordRegex.test(password)) {
          toast.error(
            'Password must be at least 8 characters long and contain at least one uppercase,lowercase letter, and one special character.'
          );
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
          return;
        }
    try {
      const { data } = await axios.put(
        `/api/users/profile/change-pass/${userId}`,
        {
          oldPass,
          newPass : password
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    //   dispatch({
    //     type: 'UPDATE_SUCCESS',
    //   });
    //   ctxDispatch({ type: 'USER_SIGNIN', payload: data });
    //   localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Information Updated Successfully 👾');
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
   // signoutHandler();
  };

  function signoutHandler() {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  }

  return (
    <div>
      <Helmet>
        <title>Profile-EcomBidding</title>
      </Helmet>
      {/* component */}
      <div className="flex min-h-fit flex-col justify-center overflow-hidden bg-gray-100 py-6 sm:py-12">
        <div className="relative py-3 sm:mx-auto sm:max-w-xl">
          <div className="animate-spin-custom absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-cyan-300 to-cyan-500 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
          <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
            <div className="mx-auto max-w-md">
              <div>
                <h1 className="text-2xl font-semibold">
                 Change Password
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <form
                  className="space-y-4 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7"
                  onSubmit={submitHandler}
                >
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="oldPass"
                      name="oldPass"
                      type="text"
                      className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                      placeholder="Name"
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      required
                    />
                    <label
                      htmlFor="name"
                      className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Old Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label
                      htmlFor="email"
                      className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      New Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <label
                      htmlFor="email"
                      className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Confirm New Password
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      type="submit"
                      className="rounded-md mt-4 w-full bg-cyan-500 px-2 py-1 text-white duration-200 hover:bg-cyan-600"
                    >
                      Update
                    </button>
                    <div className="px-2 w-full text-sm text-center border rounded-md mt-2 bg-gray-100 text-gray-700">
                      User May be logged out in order to apply changes.
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
