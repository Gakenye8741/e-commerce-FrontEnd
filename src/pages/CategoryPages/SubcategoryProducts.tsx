import { useParams, useNavigate } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../../Features/Apis/MediaApi";

import PuffLoader from "react-spinners/PuffLoader";
import { motion } from "framer-motion";
import { useState } from "react";
import { useGetSubcategoryByIdQuery } from "../../Features/Apis/SubCategoryApi";

interface Product {
  productId: number;
  title: string;
  price: string;
  subcategoryId: number;
  rating?: number; // optional if not always available
}

interface Image {
  productId: number;
  url: string;
  alt?: string;
}

const ProductsBySubcategoryPage = () => {
  const { subcategoryId } = useParams();
  const subcategoryIdNum = Number(subcategoryId);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  const {
    data: productData,
    isLoading: loadingProducts,
    isError: errorProducts,
  } = useGetAllProductsQuery(null);

  const {
    data: imageData,
    isLoading: loadingImages,
    isError: errorImages,
  } = useGetAllImagesQuery(null);

  const {
    data: subcategoryData,
    isLoading: loadingSubcategory,
    isError: errorSubcategory,
  } = useGetSubcategoryByIdQuery(subcategoryIdNum);

  const products: Product[] = Array.isArray(productData)
    ? productData
    : productData?.allProducts || [];

  const images: Image[] = Array.isArray(imageData)
    ? imageData
    : imageData?.allImages || [];

  if (loadingProducts || loadingImages || loadingSubcategory) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#3B82F6" size={60} />
      </div>
    );
  }

  if (errorProducts || errorImages || errorSubcategory) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        ⚠️ Failed to load data. Please try again.
      </div>
    );
  }

  // Filter by subcategory
  let filteredProducts = products.filter(
    (product) => Number(product.subcategoryId) === subcategoryIdNum
  );

  // Apply search filter
  if (searchTerm.trim()) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply price filters
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => parseFloat(product.price) >= parseFloat(minPrice)
    );
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => parseFloat(product.price) <= parseFloat(maxPrice)
    );
  }

  // Apply rating filter
  if (minRating) {
    filteredProducts = filteredProducts.filter(
      (product) => (product.rating ?? 0) >= parseInt(minRating)
    );
  }

  // Sort
  if (sortOption === "price-asc") {
    filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortOption === "price-desc") {
    filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (sortOption === "name") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  const getImageForProduct = (productId: number): string =>
    images.find((img) => img.productId === productId)?.url ||
    "https://dummyimage.com/300x200/ccc/000.png&text=No+Image";

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] text-white">
      {/* 🛍️ Marquee */}
      <div className="overflow-hidden mb-6">
        <motion.div
          className="whitespace-nowrap text-xl font-semibold text-center text-pink-300"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          ✨ Explore amazing deals in the {subcategoryData?.name || "selected"} category — Shop Smart, Live Better!
        </motion.div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        Welcome to the <span className="text-blue-300">{subcategoryData?.name}</span> Category
      </h1>

      {/* 🔍 Search, Sort, and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder:text-gray-300 border border-white/20 focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name A → Z</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 placeholder:text-gray-300 focus:outline-none"
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 placeholder:text-gray-300 focus:outline-none"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20"
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">Min Rating</option>
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{`${star}+ Stars`}</option>
          ))}
        </select>
      </div>

      {/* ❌ No Results */}
      {!filteredProducts.length && (
        <div className="p-6 text-center text-gray-300 font-medium">
          No products found matching your filters.
        </div>
      )}

      {/* 🛍️ Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.productId}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-md hover:shadow-xl transition transform hover:scale-105 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={getImageForProduct(product.productId)}
              alt={product.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <div className="text-center font-semibold">{product.title}</div>
            <div className="text-center text-sm text-gray-200">
              Ksh{parseFloat(product.price).toFixed(2)}
            </div>
            {product.rating && (
              <div className="text-center text-yellow-400 text-sm mt-1">
                ⭐ {product.rating} / 5
              </div>
            )}
            <button
              onClick={() => navigate(`/products/${product.productId}`)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
            >
              More Details
            </button>
          </motion.div>
        ))}
      </div>

      {/* 🧭 Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-50">
        <button
          className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Scroll to top"
        >
          ⬆️
        </button>
        <button
          className="w-12 h-12 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition flex items-center justify-center"
          onClick={() => alert('Contact support')}
          title="Contact support"
        >
          📞
        </button>
      </div>
    </div>
  );
};

export default ProductsBySubcategoryPage;
