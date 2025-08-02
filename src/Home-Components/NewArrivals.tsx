import PuffLoader from "react-spinners/PuffLoader";
import { useGetAllProductsQuery } from "../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../Features/Apis/MediaApi";

export default function NewArrivals() {
  const { data: productData, isLoading: loadingProducts, isError: errorProducts } = useGetAllProductsQuery({});
  const { data: imageData, isLoading: loadingImages, isError: errorImages } = useGetAllImagesQuery({});

  console.log("Product API data:", productData);
  console.log("Image API data:", imageData);

  const products = Array.isArray(productData?.allProducts) ? productData.allProducts : [];
  const images = Array.isArray(imageData) ? imageData : [];

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

  // Optional: sort if you later use createdAt
  const latestProducts = products.slice(0, 4);

  const getImageForProduct = (productId: number) =>
    images.find((img) => img.productId === productId)?.url || "/placeholder.jpg";

  return (
    <section className="p-6 md:p-10 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🆕 New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestProducts.map((product: any) => (
          <div
            key={product.productId}
            className="rounded-xl overflow-hidden bg-gray-50 shadow hover:shadow-lg transition-all"
          >
            <img
              src={getImageForProduct(product.productId)}
              alt={product.title || "Product"}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 truncate">
                {product.title}
              </h3>
              <p className="text-blue-600 font-bold">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
