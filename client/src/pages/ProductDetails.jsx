import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { addToCart } from "../Slices/cartSlice";
import { addToFavorite } from "../Slices/favoriteSlice";

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const item = location.state?.item;

  // State for selected options
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");

  // States for handling reviews
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // State for report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [commentToReport, setCommentToReport] = useState(null);

  // Sample data for sizes and colors
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Blue", "Red", "Green"];

  if (!item) {
    return <p className="text-center text-red-500 mt-10">Product not found</p>;
  }

  // Build product image URL
  const imageUrl = item.image.startsWith("http")
    ? item.image
    : `http://localhost:5000/${item.image.replace(/\\/g, "/")}`;

  // Add product to cart with selected options
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        selectedSize,
        selectedColor,
      })
    );
    toast.success("Product added to cart", {
      position: "top-right",
      duration: 3000,
      style: {
        background: "#4CAF50",
        color: "white",
      },
    });
  };

  // Add product to favorites
  const handleAddToFavorite = () => {
    dispatch(addToFavorite(item));
    toast.success("Product added to favorites", {
      position: "top-right",
      duration: 3000,
      style: {
        background: "#FF6B6B",
        color: "white",
      },
    });
  };

  // Handle image upload for review
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB", {
          position: "top-right",
          style: {
            background: "#FF6347",
            color: "white",
          },
        });
        return;
      }

      setReviewImage(file);
      toast.success("Image uploaded successfully", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#4CAF50",
          color: "white",
        },
      });
    }
  };

  // Fetch reviews for the product
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(
        `http://localhost:5000/api/comments/${item.id}`
      );
      const data = await response.json();
      if (response.ok) {
        setReviews(data.comments);
      } else {
        toast.error("Failed to load reviews", {
          position: "top-right",
          style: {
            background: "#FF6347",
            color: "white",
          },
        });
        console.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching reviews", {
        position: "top-right",
        style: {
          background: "#FF6347",
          color: "white",
        },
      });
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Submit a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", reviewText);

    if (reviewImage) {
      formData.append("image", reviewImage);
    }
    formData.append("productId", item.id);

    try {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      // Clear form and refresh reviews
      setReviewText("");
      setRating(5);
      setReviewImage(null);

      // Notify user and refresh reviews
      toast.success("Review submitted successfully", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#4CAF50",
          color: "white",
        },
      });

      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to submit review", {
        position: "top-right",
        style: {
          background: "#FF6347",
          color: "white",
        },
      });
      console.error("Error submitting review:", error);
    }
  };

  // Open report modal
  const openReportModal = (commentId) => {
    setCommentToReport(commentId);
    setReportReason("");
    setShowReportModal(true);
  };

  // Close report modal
  const closeReportModal = () => {
    setShowReportModal(false);
    setCommentToReport(null);
    setReportReason("");
  };

  // Submit report
  const submitReport = async () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for the report", {
        position: "top-right",
        style: {
          background: "#FF6347",
          color: "white",
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Please login to report comments");
      }

      const response = await fetch(
        "http://localhost:5000/api/comment-reports/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commentId: Number(commentToReport),
            reason: reportReason,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(data.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#4CAF50",
          color: "white",
        },
      });

      closeReportModal();
      return data;
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        style: {
          background: "#FF6347",
          color: "white",
        },
      });
      console.error("Reporting error:", {
        error: error.message,
        commentId: commentToReport,
        time: new Date().toISOString(),
      });
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [item.id]);

  return (
    <div className="font-[sans-serif] bg-gray-50">
      <Toaster />
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
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

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {item.firstName}
            </h1>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <div className="text-4xl font-bold text-gray-900">
              ${item.price}
              {item.oldPrice && (
                <span className="text-xl text-gray-500 line-through ml-2">
                  ${item.oldPrice}
                </span>
              )}
            </div>
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
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="p-4 border-2 border-gray-200 hover:border-pink-400 rounded-xl transition-colors"
                onClick={handleAddToFavorite}
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

        {/* Customer Reviews Section */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Write a Review
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-3xl text-yellow-400 mr-1 focus:outline-none"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    {rating} out of 5
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Your Review
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your detailed experience with this product..."
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Add Photo (Optional, Max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {reviewImage && (
                  <div className="mt-2 flex items-center">
                    <img
                      src={URL.createObjectURL(reviewImage)}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg mr-4"
                    />
                    <button
                      type="button"
                      onClick={() => setReviewImage(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 ease-in-out"
              >
                Submit Review
              </button>
            </form>
          </div>

          {loadingReviews ? (
            <div className="text-center text-gray-600">Loading reviews...</div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      <div className="text-yellow-400 mt-1">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                        <span className="text-sm text-gray-600 ml-2">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>

                  {review.reviewImage && (
                    <div className="mt-4">
                      <img
                        src={
                          review.reviewImage.startsWith("http")
                            ? review.reviewImage
                            : `http://localhost:5000${review.reviewImage}`
                        }
                        alt="Review"
                        className="h-64 w-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  <button
                    className="text-sm text-red-500 hover:text-red-700 mt-4 flex items-center"
                    onClick={() => openReportModal(review.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Report Comment
              </h3>
              <button
                onClick={closeReportModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Reason for reporting
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please provide details about why you're reporting this comment..."
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeReportModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
