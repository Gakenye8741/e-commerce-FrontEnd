import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllSubcategoriesQuery } from "../Features/Apis/SubCategoryApi";
import Navbar from "../components/Navbar";

interface Product {
  productId: number;
  title: string;
  price: number;
  images?: { url: string; alt?: string }[];
}

interface SubcategoryWithProducts {
  subcategoryId: number | string;
  name: string;
  products?: Product[];
  categoryId: number | string;
}

const Shop: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: subcategories,
    isLoading: loadingSubcategories,
    isError: errorSubcategories,
  } = useGetAllSubcategoriesQuery();

  const [subcategoryData, setSubcategoryData] = useState<SubcategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAllSubcategoryContent = async () => {
      if (!subcategories) return;

      try {
        setLoading(true);
        const responses = await Promise.all(
          subcategories.map((subcategory) =>
            fetch(
              `https://e-commerce-backend-esgr.onrender.com/api/subcategory-content/${subcategory.subcategoryId}`
            ).then((res) => res.json())
          )
        );

        const subcategoriesWithProducts = responses.map((res) => res.subcategory);
        setSubcategoryData(subcategoriesWithProducts);
      } catch (error) {
        console.error("Error fetching subcategory content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSubcategoryContent();
  }, [subcategories]);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceMin("");
    setPriceMax("");
    setSelectedSubcategory("");
  };

  const filterProducts = (products: Product[]) => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriceMin = priceMin === "" || product.price >= priceMin;
      const matchesPriceMax = priceMax === "" || product.price <= priceMax;
      return matchesSearch && matchesPriceMin && matchesPriceMax;
    });
  };

  if (loading || loadingSubcategories) {
    return <p className="text-center text-white mt-10">Loading...</p>;
  }

  if (errorSubcategories) {
    return <p className="text-red-500 text-center mt-10">Failed to load subcategories.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-4 sm:p-8">
        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-10 text-center">
          🛍️ Browse Products by Subcategory
        </h1>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur p-4 rounded-lg mb-8 text-white space-y-4 sm:space-y-0 sm:flex sm:gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 rounded-md bg-white/20 text-white w-full sm:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Price"
            className="p-2 rounded-md bg-white/20 text-white w-full sm:w-auto"
            value={priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="p-2 rounded-md bg-white/20 text-white w-full sm:w-auto"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
          />
          <select
            className="p-2 rounded-md bg-white/20 text-white w-full sm:w-auto"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">All Subcategories</option>
            {subcategoryData.map((sub) => (
              <option key={sub.subcategoryId} value={sub.subcategoryId.toString()}>
                {sub.name}
              </option>
            ))}
          </select>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 text-white"
          >
            Reset
          </button>
        </div>

        {subcategoryData.map((subcategory) => {
          const products = subcategory.products || [];

          if (selectedSubcategory && selectedSubcategory !== subcategory.subcategoryId.toString()) {
            return null;
          }

          const filtered = filterProducts(products);
          const maxToShow = windowWidth < 640 ? 4 : 8;
          const displayedProducts = filtered.slice(0, maxToShow);

          if (displayedProducts.length === 0) return null;

          return (
            <section key={subcategory.subcategoryId} className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {subcategory.name}
                </h2>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedProducts.map((product) => {
                  const rating = (Math.random() * (4.6 - 4.0) + 4.0).toFixed(1);
                  const badge = Math.random() > 0.5 ? "Hot 🔥" : "New 🆕";

                  return (
                    <div
                      key={product.productId}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-md text-white hover:scale-[1.02] transition"
                    >
                      <img
                        src={product.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                        alt={product.images?.[0]?.alt || product.title}
                        className="w-full h-36 sm:h-48 object-cover"
                      />
                      <div className="p-3 space-y-2">
                        <h3 className="text-md font-semibold truncate">{product.title}</h3>
                        <p className="text-blue-300 font-bold">
                          Ksh {Number(product.price).toFixed(2)}
                        </p>
                        <div className="text-sm text-yellow-300">
                          ⭐ {rating} &nbsp;| <span className="text-pink-400">{badge}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/products/${product.productId}`)}
                          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* See More Button */}
              <div className="mt-4 flex justify-center sm:hidden">
                <button
                  onClick={() =>
                    navigate(`/products/subcategory/${subcategory.subcategoryId}`)
                  }
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg shadow"
                >
                  See More
                </button>
              </div>

              {/* Divider */}
              <hr className="mt-8 border-white/20" />
            </section>
          );
        })}
      </div>
    </>
  );
};

export default Shop;
