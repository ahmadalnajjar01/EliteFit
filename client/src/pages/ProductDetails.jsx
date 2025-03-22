import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Slices/cartSlice";
import { addToFavorite } from "../Slices/favoriteSlice";

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const item = location.state?.item;

  // State for selected options
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2025-02-15",
      comment:
        "This product exceeded my expectations! The quality is outstanding and it fits perfectly.",
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "2025-02-10",
      comment:
        "Great product overall. The material is high quality but I wish there were more color options.",
      image: null,
    },
  ]);

  // Sample data (in a real app, this would come from the backend)
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Blue", "Red", "Green"];
  const productDetails = [
    { label: "Material", value: "100% Cotton" },
    { label: "Style", value: "Casual" },
    { label: "Season", value: "All Season" },
    { label: "Care", value: "Machine Wash Cold" },
  ];
  const aboutItems = [
    "Premium quality materials ensure durability and comfort",
    "Designed for everyday use with modern aesthetics",
    "Eco-friendly manufacturing process",
    "Suitable for various occasions",
    "Easy to clean and maintain",
  ];

  if (!item) {
    return <p className="text-center text-red-500 mt-10">Product not found</p>;
  }

  // Make sure image path is correct
  const imageUrl = item.image.startsWith("http")
    ? item.image
    : `http://localhost:5000/${item.image.replace(/\\/g, "/")}`;

  // Handle adding to cart with selected options
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        selectedSize,
        selectedColor,
      })
    );
  };

  // Handle submitting a review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: reviews.length + 1,
      name: "You", // In a real app, this would be the user's name
      rating,
      date: new Date().toISOString().split("T")[0],
      comment: reviewText,
      image: reviewImage ? URL.createObjectURL(reviewImage) : null,
    };
    setReviews([newReview, ...reviews]);
    setReviewText("");
    setRating(5);
    setReviewImage(null);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReviewImage(e.target.files[0]);
    }
  };

  return (
    <div className="font-[sans-serif] bg-gray-50">
      {/* 📌 Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* 🔹 Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white p-6 rounded-2xl shadow-lg">
              <img
                src={imageUrl}
                className="w-full h-full object-contain hover:scale-105 transition-transform"
                alt={item.name}
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-sm font-semibold">
                25% OFF
              </div>
            </div>
          </div>

          {/* 🔹 Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
            <p className="text-gray-600 mt-2">{item.description}</p>

            <div className="text-4xl font-bold text-gray-900">
              ${item.price}
              {item.oldPrice && (
                <span className="text-xl text-gray-500 line-through ml-2">
                  ${item.oldPrice}
                </span>
              )}
            </div>

            {/* 🔹 Size Selection */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 🔹 Color Selection */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <span className="text-white">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedColor}
              </p>
            </div>

            {/* 🔹 Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className="p-4 border-2 border-gray-200 hover:border-pink-400 rounded-xl transition-colors"
                onClick={() => dispatch(addToFavorite(item))}
              >
                <svg
                  className="w-6 h-6 text-gray-600 hover:text-pink-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 📌 Product Details Section */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <dl className="space-y-3">
                {productDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between pb-3 border-b border-gray-100"
                  >
                    <dt className="text-gray-600">{detail.label}</dt>
                    <dd className="font-medium text-gray-900">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">About This Item</h3>
              <ul className="space-y-2">
                {aboutItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 📌 Customer Reviews Section */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Review Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Your Review
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Add Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded-lg"
                />
                {reviewImage && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(reviewImage)}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {review.image ? (
                      <img
                        src={review.image}
                        alt={`${review.name}'s review`}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        {review.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="text-yellow-400">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="mt-4">{review.comment}</p>
                {review.image && (
                  <div className="mt-4">
                    <img
                      src={review.image}
                      alt="Review"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
