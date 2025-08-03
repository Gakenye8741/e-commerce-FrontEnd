// ...Imports
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../../Features/Apis/MediaApi";
import { useGetSubcategoryByIdQuery } from "../../Features/Apis/SubCategoryApi";
import PuffLoader from "react-spinners/PuffLoader";
import { motion } from "framer-motion";
import { useState} from "react";

// ...Interfaces
interface Product {
  productId: number;
  title: string;
  price: string;
  subcategoryId: number;
  rating?: number;
}
interface Image {
  productId: number;
  url: string;
  alt?: string;
}

const ProductsBySubcategoryPage = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();
  const subcategoryIdNum = Number(subcategoryId);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  // Queries
  const { data: productData, isLoading: loadingProducts, isError: errorProducts } = useGetAllProductsQuery(null);
  const { data: imageData, isLoading: loadingImages, isError: errorImages } = useGetAllImagesQuery(null);
  const { data: subcategoryData, isLoading: loadingSubcategory, isError: errorSubcategory } = useGetSubcategoryByIdQuery(subcategoryIdNum);

  const products: Product[] = Array.isArray(productData) ? productData : productData?.allProducts || [];
  const images: Image[] = Array.isArray(imageData) ? imageData : imageData?.allImages || [];

  // Loader & Error Handling
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

  // Filtering
  let filteredProducts = products.filter(
    (product) => product.subcategoryId === subcategoryIdNum
  );

  if (searchTerm.trim()) {
    filteredProducts = filteredProducts.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => parseFloat(p.price) >= parseFloat(minPrice)
    );
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => parseFloat(p.price) <= parseFloat(maxPrice)
    );
  }
  if (minRating) {
    filteredProducts = filteredProducts.filter(
      (p) => (p.rating ?? 0) >= parseInt(minRating)
    );
  }

  // Sorting
  switch (sortOption) {
    case "price-asc":
      filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "name":
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  const getImageForProduct = (productId: number) =>
    images.find((img) => img.productId === productId)?.url ||
    "https://dummyimage.com/300x200/ccc/000.png&text=No+Image";

  // JSX
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] text-white">
      {/* Announcement */}
      <div className="overflow-hidden mb-6">
        <motion.div
          className="whitespace-nowrap text-xl font-semibold text-center text-pink-300"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          ✨ Explore amazing deals in the {subcategoryData?.name || "selected"} category — Shop Smart, Live Better!
        </motion.div>
      </div>

      {/* Title + Back */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-blue-300">{subcategoryData?.name}</span> Category
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          ⬅ Go Back
        </button>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden mb-4">
        <button
          className="bg-blue-600 px-4 py-2 rounded text-white"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 relative">
        {/* Sidebar */}
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: showSidebar || window.innerWidth >= 768 ? 0 : "-100%", opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`z-40 bg-black/30 md:bg-transparent backdrop-blur-lg p-4 rounded-xl md:p-0 absolute md:static top-0 left-0 h-full w-3/4 md:w-1/4 md:block ${
            showSidebar ? "block" : "hidden"
          }`}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder:text-gray-300 border border-white/20 focus:outline-none"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20"
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name A → Z</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 placeholder:text-gray-300 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 placeholder:text-gray-300 focus:outline-none"
            />
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20"
            >
              <option value="">Min Rating</option>
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>{`${star}+ Stars`}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortOption("");
                setMinPrice("");
                setMaxPrice("");
                setMinRating("");
              }}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {!filteredProducts.length ? (
            <div className="p-6 text-center text-gray-300 font-medium">
              No products found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.productId}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-md hover:shadow-xl transition transform hover:scale-105 flex flex-col"
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
                    className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    More Details
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Buttons */}
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
          onClick={() => alert("Contact support")}
          title="Contact support"
        >
          📞
        </button>
      </div>
    </div>
  );
};

export default ProductsBySubcategoryPage;
