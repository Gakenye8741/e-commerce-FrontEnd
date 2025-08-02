import { useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import { useGetAllProductsQuery } from "../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../Features/Apis/MediaApi";

interface Product {
  productId: number;
  title: string;
  price: string;
}

interface Image {
  imageId: number;
  productId: number;
  url: string;
  alt?: string;
}

export default function NewArrivals() {
  const navigate = useNavigate(); // <-- React Router hook for navigation

  const {
    data: productData,
    isLoading: loadingProducts,
    isError: errorProducts,
  } = useGetAllProductsQuery({});

  const {
    data: imageData,
    isLoading: loadingImages,
    isError: errorImages,
  } = useGetAllImagesQuery({});

  const products: Product[] = Array.isArray(productData)
    ? productData
    : productData?.allProducts || productData?.data || [];

  const images: Image[] = Array.isArray(imageData)
    ? imageData
    : imageData?.allImages || imageData?.data || [];

  if (loadingProducts || loadingImages) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#3B82F6" size={60} />
      </div>
    );
  }

  if (errorProducts || errorImages || !products.length) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        ⚠️ No new arrivals found.
      </div>
    );
  }

  const latestProducts = products.slice(0, 4);

  const getImageForProduct = (productId: number): string =>
    images.find((img) => img.productId === productId)?.url || "/placeholder.jpg";

  return (
    <section className="p-6 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]  rounded-2xl shadow-md mb-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🆕 New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestProducts.map((product) => (
          <div
            key={product.productId}
            className="rounded-xl overflow-hidden bg-gray-50 shadow hover:shadow-lg transition-all"
          >
            <img
              src={getImageForProduct(product.productId)}
              alt={product.title || "Product"}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-700 truncate">
                {product.title}
              </h3>
              <p className="text-blue-600 font-bold">
                Ksh{parseFloat(product.price).toFixed(2)}
              </p>
              <button
                onClick={() => navigate(`/products/${product.productId}`)}
                className="btn btn-sm btn-outline btn-primary w-full mt-2"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
