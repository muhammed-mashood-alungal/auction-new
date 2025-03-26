import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../../Store';

export default function Navbar() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const searchClicked = (e) => {
    navigate(text ? `/search/?query=${text}` : '/');
    setText('');
  };

  const handleTextChange = (value) => {
    setText(value);
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // for profile dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdmin, setIsOpenAdmin] = useState(false);

  // eslint-disable-next-line

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isOpenAdmin]);

  function handleDocumentClick(e) {
    if (
      e.target.closest('#dropdownUserAvatarButton') ||
      e.target.closest('#dropdownAvatar')
    ) {
      return;
    }
    setIsOpen(false);
    setIsOpenAdmin(false);
  }

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function toggleDropdownAdmin() {
    setIsOpenAdmin(!isOpenAdmin);
  }

  function signoutHandler() {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOutsideClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <ToastContainer position="bottom-center" limit={1} />
      <header className="text-gray-600 body-font shadow-lg">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            to="/auction"
            className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 mb-0 md:mb-0"
          >
            <span className="ml-3 text-3xl font-bold">
              <span className="text-cyan-500">Ecom</span>Bidding
            </span>
          </Link>
        
          <nav className="flex lg:w-2/5 flex-wrap lg:justify-end items-center text-base md:ml-auto">
            <Link to="/about" className="relative inline-flex items-center">
              <span className="relative inline-flex items-center rounded px-2.5 py-1.5 font-medium">
                <span className="ml-1.5 text-base text-gray-600 hover:text-gray-900">
                  About
                </span>
              </span>
            </Link>
            <Link to="/auction" className="relative inline-flex items-center">
              <span className="relative inline-flex items-center rounded px-2.5 py-1.5 font-medium">
                <span className="ml-1.5 text-base text-gray-600 hover:text-gray-900">
                  Auction
                </span>
              </span>
            </Link>
{/* 
            {userInfo && userInfo.isSeller && (
              <div className="mr-4">
                <button
                  id="dropdownUserAvatarButton"
                  data-dropdown-toggle="dropdownAvatar"
                  className="flex items-center mr-2 hover:text-gray-900 focus:outline-none cursor-pointer"
                  onClick={handleMenuClick}
                >
                  Seller &nbsp;
                  <i className="fas fa-angle-down"></i>
                </button>
                {isMenuOpen && (
                  <div
                    onClick={handleOutsideClick}
                    className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg right-4 mt-2 w-auto left-auto"
                  >
                    <div className="px-4 py-3 text-sm text-gray-900 mt-1 whitespace-normal">
                      {userInfo.seller?.name && (
                        <span className="bg-blue-500 text-white px-2">
                          {userInfo.seller?.name}
                        </span>
                      )}
                      <div className="font-medium truncate">
                        {userInfo.email}
                      </div>
                    </div>
                    <ul
                      className="py-2 text-sm text-gray-700"
                      aria-labelledby="dropdownUserAvatarButton"
                    >
                      
                    </ul>
                  </div>
                )}
              </div>
            )} */}

            {userInfo && userInfo.isAdmin && (
              <div className="hover:text-gray-900 mr-6">
                <button
                  id="dropdownUserAvatarButton"
                  data-dropdown-toggle="dropdownAvatar"
                  className="flex items-center mr-2 hover:text-gray-900 focus:outline-none cursor-pointer"
                  onClick={toggleDropdownAdmin}
                >
                  Admin &nbsp;
                  <i className="fas fa-angle-down"></i>
                </button>
                {isOpenAdmin && (
                  <div
                    id="dropdownAvatar"
                    className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg right-0 mt-2 w-48 sm:left-auto"
                  >
                    <div className="px-4 py-3 text-sm text-gray-900 mt-1">
                      <span className="bg-red-500 text-white px-2">
                        {userInfo.name}
                      </span>
                      <div className="font-medium truncate">
                        {userInfo.email}
                      </div>
                    </div>
                  
                    <div className="py-2">
                      <Link
                        to="/admin/users"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Manage Users
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Manage Orders
                      </Link>
                     
                    </div>
                  </div>
                )}
              </div>
            )}

            {userInfo ? (
              <div className="relative group">
                <button
                  id="dropdownUserAvatarButton"
                  data-dropdown-toggle="dropdownAvatar"
                  className="flex items-center mr-2 hover:text-gray-900 focus:outline-none cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img
                    className="w-8 h-8 rounded-full hover:scale-110 duration-200"
                    src="https://i.pravatar.cc/150?img=3"
                    alt="profilepic"
                  />
                </button>
                {isOpen && (
                  <div
                    id="dropdownAvatar"
                    className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg right-0 mt-2 w-48 sm:left-auto sm:right-0"
                  >
                    <div className="px-4 py-3 text-sm text-gray-900">
                      <div>{userInfo.name}</div>
                      <div className="font-medium truncate">
                        {userInfo.email}
                      </div>
                    </div>
                    <ul
                      className="py-2 text-sm text-gray-700"
                      aria-labelledby="dropdownUserAvatarButton"
                    >
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                      </li>
                    </ul>
                    <div className="py-2">
                      <Link
                        to="#signout"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={signoutHandler}
                      >
                        Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="mr-5 hover:text-gray-900">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
