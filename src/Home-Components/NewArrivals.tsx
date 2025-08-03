import { useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import { useGetAllProductsQuery } from "../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../Features/Apis/MediaApi";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();

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
    <section className="p-6 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] rounded-2xl shadow-md mb-20">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8 text-white text-center"
      >
        🆕 New Arrivals
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {latestProducts.map((product, index) => (
          <motion.div
            key={product.productId}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-xl text-white cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={getImageForProduct(product.productId)}
              alt={product.title || "Product"}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold truncate">{product.title}</h3>
              <p className="text-blue-300 font-bold">
                Ksh {parseFloat(product.price).toFixed(2)}
              </p>
              <motion.button
                onClick={() => navigate(`/products/${product.productId}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
