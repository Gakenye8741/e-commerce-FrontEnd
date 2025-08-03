import { useParams, useNavigate } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/Apis/ProductApi";

import PuffLoader from "react-spinners/PuffLoader";
import { useGetAllImagesQuery } from "../../Features/Apis/MediaApi";

interface Product {
  productId: number;
  title: string;
  price: string;
  subcategoryId: number;
}

interface Image {
  productId: number;
  url: string;
  alt?: string;
}

const ProductsBySubcategoryPage = () => {
  const { subcategoryId } = useParams();
  const subcategoryIdNum = Number(subcategoryId);
  const navigate = useNavigate(); // for navigation to product details

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

  const products: Product[] = Array.isArray(productData)
    ? productData
    : productData?.allProducts || [];

  const images: Image[] = Array.isArray(imageData)
    ? imageData
    : imageData?.allImages || [];

  if (loadingProducts || loadingImages) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#3B82F6" size={60} />
      </div>
    );
  }

  if (errorProducts || errorImages) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        ⚠️ Failed to load products or images.
      </div>
    );
  }

  const filteredProducts = products.filter(
    (product) => Number(product.subcategoryId) === subcategoryIdNum
  );

  if (!filteredProducts.length) {
    return (
      <div className="p-6 text-center text-gray-500 font-medium">
        No products found for this subcategory.
      </div>
    );
  }

  const getImageForProduct = (productId: number): string =>
    images.find((img) => img.productId === productId)?.url ||
    "https://dummyimage.com/300x200/ccc/000.png&text=No+Image";

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.productId}
            className="border rounded-lg shadow hover:shadow-md p-4 bg-white flex flex-col justify-between"
          >
            <img
              src={getImageForProduct(product.productId)}
              alt={product.title}
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <div className="text-center font-semibold mb-1">
              {product.title}
            </div>
            <div className="text-center text-sm text-gray-600 mb-2">
              Ksh{parseFloat(product.price).toFixed(2)}
            </div>
            <button
              onClick={() => navigate(`/products/${product.productId}`)}
              className="mt-auto bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              More Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsBySubcategoryPage;
