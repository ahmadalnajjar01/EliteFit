import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { clearCart } from "../Slices/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);

  // التحقق من أن لكل عنصر في السلة حجمًا ولونًا صالحين
  const validCart = cartItems.every(
    (item) =>
      item.selectedSize &&
      item.selectedSize !== "select size" &&
      item.selectedColor &&
      item.selectedColor !== "select color"
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePayment = async () => {
    // 1) تحقق من خيارات الحجم واللون
    if (!validCart) {
      Swal.fire({
        icon: "warning",
        title: "Missing Options",
        text: "Please select size and color for each item before proceeding.",
      });
      return;
    }

    // 2) تحقق من ملء كل الحقول المطلوبة
    const requiredFields = [
      "name",
      "email",
      "address",
      "city",
      "state",
      "postalCode",
    ];
    const isFormValid = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );

    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all the required fields before proceeding.",
      });
      return;
    }

    setLoading(true);

    try {
      // جلب التوكن من localStorage
      const token = localStorage.getItem("token");

      // تحضير الـ payload بما يتوافق مع المطلوب:
      // productIds -> مصفوفة من معرفات المنتجات
      // total -> إجمالي السعر
      // size -> مصفوفة بجميع الـ selectedSize من كل عنصر
      // color -> مصفوفة بجميع الـ selectedColor من كل عنصر
      const payload = {
        productIds: cartItems.map((item) => item.id),
        total: totalAmount,
        size: cartItems.map((item) => item.selectedSize),
        color: cartItems.map((item) => item.selectedColor),
      };

      const response = await fetch(
        "http://localhost:5000/api/orders/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      setLoading(false);
      Swal.fire({
        title: "Order Created!",
        text: "Your order has been placed successfully. A confirmation email will be sent soon.",
        icon: "success",
        confirmButtonText: "Continue Shopping",
        confirmButtonColor: "#4F46E5",
      }).then(() => {
        dispatch(clearCart());
        navigate("/");
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while processing your order.",
      });
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete your purchase securely
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="space-y-8">
                {/* Shipping Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                      1
                    </span>
                    Shipping Information
                  </h2>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                      2
                    </span>
                    Payment Method
                  </h2>
                  <div className="mt-6 space-y-4">
                    <div
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => handlePaymentMethodChange("card")}
                    >
                      <input
                        type="radio"
                        id="card-payment"
                        name="payment-method"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        checked={paymentMethod === "card"}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor="card-payment"
                        className="ml-3 flex items-center cursor-pointer"
                      >
                        <span className="font-medium text-gray-900">
                          Credit / Debit Card
                        </span>
                        <div className="ml-auto flex space-x-2">
                          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                            VISA
                          </div>
                          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                            MC
                          </div>
                          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                            AMEX
                          </div>
                        </div>
                      </label>
                    </div>

                    <div
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "paypal"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => handlePaymentMethodChange("paypal")}
                    >
                      <input
                        type="radio"
                        id="paypal-payment"
                        name="payment-method"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        checked={paymentMethod === "paypal"}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor="paypal-payment"
                        className="ml-3 flex items-center cursor-pointer"
                      >
                        <span className="font-medium text-gray-900">
                          PayPal
                        </span>
                        <div className="ml-auto">
                          <div className="h-8 w-20 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                            PAYPAL
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Complete Order Button */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      loading
                        ? "bg-indigo-400 cursor-wait"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Complete Order - ${totalAmount.toFixed(2)}</>
                    )}
                  </button>
                  <p className="mt-3 text-xs text-center text-gray-500">
                    By completing your purchase, you agree to our{" "}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                {cartItems.length > 0 && (
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-4 flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <p>Subtotal</p>
                    <p>${totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <p>Shipping</p>
                    <p className="text-green-600">Free</p>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <p>Total</p>
                    <p>${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0"
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
                  <h4 className="font-medium text-indigo-600">
                    Need help completing your order?
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    If you have questions about payment or shipping, please
                    contact our support at{" "}
                    <a
                      href="mailto:help@shop.com"
                      className="text-indigo-500 underline"
                    >
                      help@shop.com
                    </a>{" "}
                    or call us at{" "}
                    <span className="font-medium">+1 234 567 890</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
