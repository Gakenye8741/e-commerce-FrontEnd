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

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false); // 🔹 new state

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
      <div className="min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-4 sm:p-8 text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mt-16 text-center">
          🛍️ Browse Products by Subcategory
        </h1>

        {/* 🔹 Toggle Button for Small Screens */}
        <div className="mb-4 md:hidden flex justify-center">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* 🔹 Sidebar - Visible on large screens OR if showFilters is true */}
          {(showFilters || window.innerWidth >= 1024) && (
            <aside className="lg:w-1/4 bg-white/10 p-4 rounded-lg backdrop-blur space-y-4 md:block">
              <h2 className="text-xl font-semibold">Filters</h2>
              <input
                type="text"
                placeholder="Search products..."
                className="p-2 w-full rounded-md bg-white/20 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="number"
                placeholder="Min Price"
                className="p-2 w-full rounded-md bg-white/20 text-white"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="p-2 w-full rounded-md bg-white/20 text-white"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
              />
              <select
                className="p-2 w-full rounded-md bg-white/20 text-white"
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
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
              >
                Reset
              </button>
            </aside>
          )}

          {/* 🔹 Main Content */}
          <main className="lg:w-3/4 overflow-auto max-h-[calc(100vh-8rem)] pr-2 space-y-16">
            {subcategoryData.map((subcategory) => {
              const products = subcategory.products || [];

              if (
                selectedSubcategory &&
                selectedSubcategory !== subcategory.subcategoryId.toString()
              ) {
                return null;
              }

              const filtered = filterProducts(products);
              if (filtered.length === 0) return null;

              return (
                <section key={subcategory.subcategoryId}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">{subcategory.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filtered.map((product) => {
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

                  <hr className="mt-8 border-white/20" />
                </section>
              );
            })}
          </main>
        </div>
      </div>
    </>
  );
};

export default Shop;
