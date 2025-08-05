import React, { useEffect, useState } from "react";
import { useGetAllSubcategoriesQuery } from "../Features/Apis/SubCategoryApi";
import SubcategorySlider from "./SubcategorySlider";

interface Product {
  productId: number;
  title: string;
  price: number;
  images?: { url: string; alt: string }[];
}

interface SubcategoryWithProducts {
  subcategoryId: number | string;
  name: string;
  products?: Product[];
  categoryId: number | string;
}

const SubcategoriesHomepage: React.FC = () => {
  const {
    data: subcategories,
    isLoading: loadingSubcategories,
    isError: errorSubcategories,
  } = useGetAllSubcategoriesQuery();

  const [subcategoryData, setSubcategoryData] = useState<SubcategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || loadingSubcategories) return <p className="text-center text-white mt-10">Loading...</p>;
  if (errorSubcategories) return <p className="text-red-500 text-center mt-10">Failed to load subcategories.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-4 sm:p-8">
      <h1 className="text-white text-3xl sm:text-4xl font-bold mb-10 text-center">
        Featured Product Collections 💎
      </h1>

      {subcategoryData.map((subcategory) => {
        const products = subcategory.products?.slice(0, 5) || [];

        if (products.length === 0) return null;

        return (
          <SubcategorySlider
            key={subcategory.subcategoryId}
            products={products}
            subcategoryName={subcategory.name}
            subcategoryId={subcategory.subcategoryId}
            categoryId={subcategory.categoryId}
          />
        );
      })}
    </div>
  );
};

export default SubcategoriesHomepage;
