import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  updateOptions,
  clearCart,
} from "../Slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Define available options; these can be static or come from product data/API.
  const availableSizes = ["select size", "XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = [
    "select color",
    "Black",
    "White",
    "Blue",
    "Red",
    "Green",
  ];

  // Check if all items have valid size and color selections
  const validCart = cartItems.every(
    (item) =>
      item.selectedSize &&
      item.selectedSize !== "select size" &&
      item.selectedColor &&
      item.selectedColor !== "select color"
  );

  // Handler for proceeding to checkout
  const handleProceedToCheckout = () => {
    if (validCart) {
      navigate("/checkout");
    } else {
      toast.error("Please select size and color for all items", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handler for removing item from cart
  const handleRemoveFromCart = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Handler for updating quantity
  const handleUpdateQuantity = (id, name, quantity, increment) => {
    dispatch(updateQuantity({ id, quantity }));
    toast.info(
      `${name} quantity ${
        increment ? "increased" : "decreased"
      } to ${quantity}`,
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };

  // Handler for updating options
  const handleUpdateOptions = (id, selectedSize, selectedColor) => {
    dispatch(updateOptions({ id, selectedSize, selectedColor }));
    toast.info("Product options updated", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handler for clearing cart
  const handleClearCart = () => {
    if (cartItems.length > 0) {
      dispatch(clearCart());
      toast.info("Cart has been cleared", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="font-sans bg-[#fff] text-black min-h-screen py-12">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-black mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-[#181818] rounded-xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-6">
              <svg
                className="w-24 h-24 text-[#F0BB78]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <p className="text-xl text-white/70 mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-[#F0BB78] text-black font-medium rounded-lg transition-all duration-300 hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transform hover:-translate-y-1"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-[#181818] rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-[#252525] border-b border-[#F0BB78]/20">
                  <h2 className="text-lg font-semibold text-white">
                    Items ({cartItems.length})
                  </h2>
                </div>

                <div className="divide-y divide-[#252525]">
                  {cartItems.map((item) => {
                    const imageUrl = item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5000/${item.image.replace(
                          /\\/g,
                          "/"
                        )}`;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start gap-6 p-6 hover:bg-[#252525] transition-colors duration-200"
                      >
                        <div className="w-32 h-32 flex-shrink-0 bg-[#252525] rounded-lg p-2">
                          <img
                            src={imageUrl}
                            className="w-full h-full object-contain"
                            alt={item.name}
                          />
                        </div>

                        <div className="flex-1 w-full">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-white/60 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Dropdown for selected size */}
                          <div className="mt-2 text-sm text-white/70">
                            <label className="mr-2 font-semibold">Size:</label>
                            <select
                              value={item.selectedSize || "select size"}
                              onChange={(e) => {
                                const newSize = e.target.value;
                                handleUpdateOptions(
                                  item.id,
                                  newSize,
                                  item.selectedColor || "select color"
                                );
                              }}
                              className="border border-[#F0BB78]/20 bg-[#252525] text-white rounded px-2 py-1"
                            >
                              {availableSizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Dropdown for selected color */}
                          <div className="mt-2 text-sm text-white/70">
                            <label className="mr-2 font-semibold">Color:</label>
                            <select
                              value={item.selectedColor || "select color"}
                              onChange={(e) => {
                                const newColor = e.target.value;
                                handleUpdateOptions(
                                  item.id,
                                  item.selectedSize || "select size",
                                  newColor
                                );
                              }}
                              className="border border-[#F0BB78]/20 bg-[#252525] text-white rounded px-2 py-1"
                            >
                              {availableColors.map((color) => (
                                <option key={color} value={color}>
                                  {color}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-[#F0BB78] transition-colors duration-200"
                              onClick={() =>
                                handleRemoveFromCart(item.id, item.name)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                              </svg>
                              Remove
                            </button>
                            <button
                              className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-[#F0BB78] transition-colors duration-200"
                              onClick={() => {
                                toast.success(`${item.name} saved for later`, {
                                  position: "top-right",
                                  autoClose: 3000,
                                });
                              }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                ></path>
                              </svg>
                              Save for later
                            </button>
                          </div>
                        </div>

                        <div className="ml-auto text-right pt-2 sm:pt-0">
                          <h4 className="text-lg font-bold text-white mb-3">
                            ${(item.price * item.quantity).toFixed(2)}
                          </h4>

                          <div className="inline-flex items-center border border-[#F0BB78]/20 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              className="px-3 py-2 text-white/60 hover:bg-[#252525] transition-colors"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  handleUpdateQuantity(
                                    item.id,
                                    item.name,
                                    item.quantity - 1,
                                    false
                                  );
                                }
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M20 12H4"
                                ></path>
                              </svg>
                            </button>
                            <span className="text-sm font-semibold px-4 py-2 bg-[#252525] text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="px-3 py-2 text-white/60 hover:bg-[#252525] transition-colors"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.name,
                                  item.quantity + 1,
                                  true
                                )
                              }
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 4v16m8-8H4"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-[#F0BB78] hover:text-white font-medium text-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Continue Shopping
                </Link>

                <button
                  className="text-sm text-white/60 hover:text-white font-medium"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-[#181818] rounded-xl shadow-lg p-6 lg:sticky lg:top-8">
                <h3 className="text-xl font-bold text-white border-b border-[#F0BB78]/20 pb-4">
                  Order Summary
                </h3>

                <ul className="text-white divide-y mt-4 divide-[#252525]">
                  <li className="flex justify-between text-sm py-3">
                    Subtotal (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items)
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between text-sm py-3">
                    Shipping
                    <span className="font-semibold text-[#F0BB78]">Free</span>
                  </li>
                  <li className="flex justify-between text-sm py-3">
                    Estimated Tax
                    <span className="font-semibold text-white/60">
                      Calculated at checkout
                    </span>
                  </li>
                </ul>

                <div className="border-t border-[#F0BB78]/20 mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className={`block mt-6 w-full text-center font-semibold py-3 px-4 rounded-lg transition-all duration-300 ${
                    validCart
                      ? "bg-[#F0BB78] text-black hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transform hover:-translate-y-1"
                      : "bg-[#252525] text-white/60 cursor-not-allowed"
                  }`}
                  title={
                    validCart
                      ? "Proceed to checkout"
                      : "Please select size and color for each item to proceed"
                  }
                >
                  {validCart
                    ? "Proceed to Checkout"
                    : "Select size and color to proceed"}
                </button>

                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-4 text-white/60">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" />
                    </svg>
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM6.5 17.5L14.01 14.01L17.5 6.5L9.99 9.99L6.5 17.5ZM12 10.9C12.61 10.9 13.1 11.39 13.1 12C13.1 12.61 12.61 13.1 12 13.1C11.39 13.1 10.9 12.61 10.9 12C10.9 11.39 11.39 10.9 12 10.9Z" />
                    </svg>
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 2H8C6.9 2 6 2.9 6 4V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V4C18 2.9 17.1 2 16 2ZM16 17H8V7H16V17Z" />
                    </svg>
                  </div>
                  <p className="text-xs text-center text-white/60 mt-2">
                    Secure checkout powered by trusted payment methods
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-[#252525] border border-[#F0BB78]/10 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#F0BB78] mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <h4 className="font-medium text-[#F0BB78]">
                      Need assistance?
                    </h4>
                    <p className="text-sm text-white/60 mt-1">
                      If you have any questions about your cart or the checkout
                      process, feel free to contact our customer support at{" "}
                      <a
                        href="mailto:support@example.com"
                        className="text-[#F0BB78] underline ml-1"
                      >
                        support@example.com
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
