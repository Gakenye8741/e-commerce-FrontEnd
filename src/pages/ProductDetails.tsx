import { useParams, Link, useLocation } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import { useGetAllProductsQuery, useGetProductByIdQuery } from "../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../Features/Apis/MediaApi";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { addToCart } from "../utils/CartStorage";
import type { CartItem } from "../utils/CartTYpes";


interface Product {
  productId: number;
  title: string;
  description?: string;
  price?: string | number;
  brand?: string;
  category?: string;
}

interface Image {
  imageId: number;
  productId: number;
  url: string;
  alt?: string;
}

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const parsedId = parseInt(productId || "0", 10);

  const { data, isLoading: loadingProduct } = useGetProductByIdQuery(productId || "");
  const product: Product | undefined = data?.product;

  const { data: allProductsData } = useGetAllProductsQuery({});
  const { data: imageData, isLoading: loadingImages } = useGetAllImagesQuery({});

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const products: Product[] = Array.isArray(allProductsData)
    ? allProductsData
    : allProductsData?.allProducts || allProductsData?.data || [];

  const images: Image[] = Array.isArray(imageData)
    ? imageData
    : imageData?.allImages || imageData?.data || [];

  const productImages = images.filter((img) => img.productId === parsedId);

  const similarProducts = products
    .filter((p) => p.category === product?.category && p.productId !== parsedId)
    .slice(0, 4);

  const today = new Date();
  const minDelivery = new Date(today);
  const maxDelivery = new Date(today);
  minDelivery.setDate(today.getDate() + 2);
  maxDelivery.setDate(today.getDate() + 5);
  const deliveryRange = `${minDelivery.toDateString()} - ${maxDelivery.toDateString()}`;

  const getRandomRating = () => (Math.random() * 0.6 + 4).toFixed(1);
  const formatPrice = (price: string | number | undefined) =>
    price && !isNaN(Number(price)) ? Number(price).toFixed(2) : "N/A";

  if (loadingProduct || loadingImages) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#3B82F6" size={60} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        ⚠️ Product not found.
      </div>
    );
  }

  return (
    <>
    <Toaster position="top-right" />
      <Navbar />
      <motion.div
        className="max-w-5xl mx-auto px-6 py-10 mt-20 rounded-2xl shadow-lg bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] backdrop-blur-md text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {productImages.length > 1 ? (
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={3000}
                onClickItem={(index) => setSelectedImage(productImages[index].url)}
              >
                {productImages.map((img, idx) => (
                  <div key={idx}>
                    <img
                      src={img.url}
                      alt={img.alt || product.title}
                      className="h-64 object-cover rounded-xl cursor-pointer"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                src={productImages[0]?.url || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-64 object-cover rounded-xl cursor-pointer"
                onClick={() => setSelectedImage(productImages[0]?.url || "/placeholder.jpg")}
              />
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl text-blue-300 font-semibold">
              Ksh {formatPrice(product.price)}
            </p>
            <p className="text-yellow-300">⭐ {getRandomRating()} / 5.0</p>

            <div>
              <label className="font-medium">Quantity</label>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-200 text-black rounded">-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 bg-gray-200 text-black rounded">+</button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                try {
                  const item: CartItem = {
                    productId: product.productId,
                    title: product.title,
                    price: Number(product.price ?? 0), // ✅ Ensure number
                    quantity,
                    image: productImages[0]?.url || "/placeholder.jpg",
                  };
                  addToCart(item);
                  toast.success("✅ Added to cart!");
                } catch (err) {
                  console.error("Error adding to cart:", err);
                  toast.error("❌ Failed to add to cart.");
                }
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Add to Cart
            </motion.button>

            <div>
              <h3 className="text-xl font-semibold mb-1">Description</h3>
              <p>{product.description || "No description available for this product."}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-1">More Info</h3>
              <ul className="list-disc ml-5">
                {product.brand && <li>Brand: {product.brand}</li>}
                {product.category && <li>Category: {product.category}</li>}
                <li>SKU: #{product.productId}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-1">Estimated Delivery</h3>
              <p>
                📦 Between <strong>{deliveryRange}</strong>
              </p>
              <p className="text-sm text-gray-300">Business days only. May vary by location.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-1">Return Policy</h3>
              <p>
                Returns accepted within 7 days of delivery. Item must be unused and in original packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">🛍️ Similar Products in Category: {product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => {
                const img = images.find((i) => i.productId === p.productId)?.url || "/placeholder.jpg";
                return (
                  <motion.div
                    key={p.productId}
                    className="bg-white/10 rounded-xl overflow-hidden shadow hover:shadow-lg transition hover:scale-[1.02] flex flex-col"
                    whileHover={{ scale: 1.03 }}
                  >
                    <img src={img} alt={p.title} className="w-full h-48 object-cover" />
                    <div className="p-4 flex-grow">
                      <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                      <p className="text-blue-300 font-bold">
                        Ksh {formatPrice(p.price)}
                      </p>
                      <p className="text-yellow-300">⭐ {getRandomRating()} / 5.0</p>
                    </div>
                    <div className="px-4 pb-4">
                      <Link
                        to={`/products/${p.productId}`}
                        className="inline-block text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-center w-full"
                      >
                        View More
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* New Arrivals */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">🆕 New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...products]
              .sort((a, b) => b.productId - a.productId)
              .slice(0, 4)
              .map((p) => {
                const img = images.find((i) => i.productId === p.productId)?.url || "/placeholder.jpg";
                return (
                  <motion.div
                    key={p.productId}
                    className="bg-white/10 rounded-xl overflow-hidden shadow hover:shadow-lg transition hover:scale-[1.02] flex flex-col"
                    whileHover={{ scale: 1.03 }}
                  >
                    <img src={img} alt={p.title} className="w-full h-48 object-cover" />
                    <div className="p-4 flex-grow">
                      <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                      <p className="text-blue-300 font-bold">
                        Ksh {formatPrice(p.price)}
                      </p>
                      <p className="text-yellow-300">⭐ {getRandomRating()} / 5.0</p>
                    </div>
                    <div className="px-4 pb-4">
                      <Link
                        to={`/products/${p.productId}`}
                        className="inline-block text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-center w-full"
                      >
                        View More
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* Image Zoom Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img src={selectedImage} alt="Zoomed" className="max-h-[90%] max-w-[90%] rounded-lg" />
          </div>
        )}
      </motion.div>
    </>
  );
}
