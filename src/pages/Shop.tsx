import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllSubcategoriesQuery } from "../Features/Apis/SubCategoryApi";
import Navbar from "../components/Navbar";
import { PuffLoader } from "react-spinners";

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

  // Track screen size for responsive product count
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch subcategory content
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

  if (loading || loadingSubcategories) {
    return <p className="text-center text-white mt-10">
      <PuffLoader />
    </p>;
  }

  if (errorSubcategories) {
    return <p className="text-red-500 text-center mt-10">Failed to load subcategories.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-4 sm:p-8">
        <h1 className="text-white text-3xl sm:text-4xl font-bold mt-20 text-center">
          🛍️ Browse Products by Subcategory
        </h1>

        {subcategoryData.map((subcategory, index) => {
          const products = subcategory.products || [];
          const maxToShow = windowWidth < 640 ? 4 : 8;
          const displayedProducts = products.slice(0, maxToShow);

          if (displayedProducts.length === 0) return null;

          return (
            <section key={subcategory.subcategoryId} className="mb-16">
              {/* Subcategory Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {subcategory.name}
                </h2>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-md text-white hover:scale-[1.02] transition"
                  >
                    {/* Product Image */}
                    <img
                      src={product.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                      alt={product.images?.[0]?.alt || product.title}
                      className="w-full h-36 sm:h-48 object-cover"
                    />

                    {/* Product Details */}
                    <div className="p-3 space-y-2">
                      <h3 className="text-md font-semibold truncate">{product.title}</h3>
                      <p className="text-blue-300 font-bold">
                        Ksh {Number(product.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => navigate(`/products/${product.productId}`)}
                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* See More Button (mobile only) */}
              <div className="mt-4 sm:hidden flex justify-center">
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
              {index !== subcategoryData.length - 1 && (
                <hr className="mt-10 border-gray-500/30" />
              )}
            </section>
          );
        })}
      </div>
    </>
  );
};

export default Shop;
