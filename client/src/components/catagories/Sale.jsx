import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Slices/cartSlice";
import { addToFavorite, removeFromFavorite } from "../../Slices/favoriteSlice";

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteItems = useSelector((state) => state.favorite.favorite);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/sale-products")
      .then((response) => {
        console.log("✅ API Response:", response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching new arrivals:", error);
        setError("Failed to load new arrivals");
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate discount percentage if an oldPrice exists
  const getDiscountPercentage = (oldPrice, price) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sale</h1>
          <p className="text-indigo-100 text-lg md:w-2/3 leading-relaxed">
            Explore the latest fashion trends and find your perfect style.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-center text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && currentProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {currentProducts.map((product) => {
              const isFavorite = favoriteItems.some(
                (fav) => fav.id === product.id
              );

              const imageUrl =
                product.image && product.image.startsWith("http")
                  ? product.image
                  : product.image
                  ? `http://localhost:5000/${product.image.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/300"; // fallback image URL

              const hasDiscount =
                product.oldPrice && product.oldPrice > product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 group border border-gray-100"
                >
                  {/* Product Image */}
                  <div
                    className="relative overflow-hidden"
                    onClick={() =>
                      navigate(`/product/${product.id}`, {
                        state: { item: product },
                      })
                    }
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {getDiscountPercentage(product.oldPrice, product.price)}
                        % OFF
                      </div>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        className="bg-white text-gray-800 p-2 rounded-full shadow-lg mx-2 hover:bg-gray-100 transition"
                        title="Quick view"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`, {
                            state: { item: product },
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      className="text-gray-800 font-medium text-sm md:text-base mb-1 truncate cursor-pointer hover:text-indigo-600 transition"
                      onClick={() =>
                        navigate(`/product/${product.id}`, {
                          state: { item: product },
                        })
                      }
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm mb-3 line-clamp-1">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-900 font-bold">
                          ${product.price}
                        </span>
                        {hasDiscount && (
                          <span className="text-gray-400 text-sm line-through">
                            ${product.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        type="button"
                        className={`p-2 rounded-full transition-colors duration-200 flex-shrink-0 ${
                          isFavorite
                            ? "bg-pink-100 text-pink-600"
                            : "bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-500"
                        }`}
                        title={
                          isFavorite
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        onClick={() =>
                          isFavorite
                            ? dispatch(removeFromFavorite(product.id))
                            : dispatch(addToFavorite(product))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={() => dispatch(addToCart(product))}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-bag-plus"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                          />
                          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && currentProducts.length === 0 && (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sale;
