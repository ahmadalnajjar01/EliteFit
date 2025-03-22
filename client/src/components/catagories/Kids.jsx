import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKidsProducts } from "../../Slices/kidsSlice";
import { addToCart } from "../../Slices/cartSlice";
import { addToFavorite, removeFromFavorite } from "../../Slices/favoriteSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Kids = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local states for filtering, sorting, and pagination
  const [isFiltering, setIsFiltering] = useState(false);
  const [priceRange, setPriceRange] = useState(500);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.kids);
  const favoriteItems = useSelector((state) => state.favorite.favorite);

  useEffect(() => {
    dispatch(fetchKidsProducts());
  }, [dispatch]);

  // Filter and sort products
  const filteredProducts = [...products]
    .filter((product) => product.price <= priceRange)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const toggleFilter = () => setIsFiltering(!isFiltering);

  // Calculate discount percentage
  const getDiscountPercentage = (oldPrice, currentPrice) => {
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Helper: Construct image URL with fallback
 const getImageUrl = (product) => {
   if (product.image) {
     // إذا كان الرابط يحتوي على "uploads" مسبقاً فلا تضيفه مرة أخرى
     if (product.image.startsWith("http")) {
       return product.image;
     } else if (product.image.includes("uploads")) {
       return `http://localhost:5000/${product.image.replace(/\\/g, "/")}`;
     } else {
       return `http://localhost:5000/uploads/${product.image.replace(
         /\\/g,
         "/"
       )}`;
     }
   }
   return "https://via.placeholder.com/300";
 };


  // Toast event handlers
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleFavoriteToggle = (product, isFav) => {
    if (isFav) {
      dispatch(removeFromFavorite(product.id));
      toast.info(`${product.name} removed from wishlist`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      dispatch(addToFavorite(product));
      toast.success(`${product.name} added to wishlist!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Toast Container */}
      <ToastContainer />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-300 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kids Collection
          </h1>
          <p className="text-green-100 text-lg md:w-2/3 leading-relaxed">
            Discover our fun and stylish collection for kids – perfect for every
            adventure.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFilter}
              className="bg-white px-4 py-2 rounded shadow-sm border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-funnel"
                viewBox="0 0 16 16"
              >
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
              </svg>
              <span>Filter</span>
            </button>
            <span className="text-gray-500">
              {filteredProducts.length} products
            </span>
          </div>

          <select
            className="bg-white px-4 py-2 rounded shadow-sm border border-gray-200 outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort By: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        {/* Filter Panel */}
        {isFiltering && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-center text-red-500">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && currentProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {currentProducts.map((product) => {
              const isFavorite = favoriteItems.some(
                (fav) => fav.id === product.id
              );
              const imageUrl = getImageUrl(product);
              const hasDiscount =
                product.oldPrice && product.oldPrice > product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 group border border-gray-100 cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${product.id}`, {
                      state: { item: product },
                    })
                  }
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
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
                      className="text-gray-800 font-medium text-sm md:text-base mb-1 truncate cursor-pointer hover:text-pink-600 transition"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(product, isFavorite);
                        }}
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
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
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
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No products available at the moment.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredProducts.length > 0 && (
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
                      ? "bg-pink-600 text-white"
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

export default Kids;
