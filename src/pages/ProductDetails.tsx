import { useParams, Link } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import { useGetAllProductsQuery } from "../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../Features/Apis/MediaApi";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Product {
  productId: number;
  title: string;
  description?: string;
  price: string;
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
  const parsedId = parseInt(productId || "0", 10);

  const { data: productData, isLoading: loadingProducts } = useGetAllProductsQuery({});
  const { data: imageData, isLoading: loadingImages } = useGetAllImagesQuery({});

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const products: Product[] = Array.isArray(productData)
    ? productData
    : productData?.allProducts || productData?.data || [];

  const images: Image[] = Array.isArray(imageData)
    ? imageData
    : imageData?.allImages || imageData?.data || [];

  const product = products.find((p) => p.productId === parsedId);
  const productImages = images.filter((img) => img.productId === parsedId);

  const similarProducts = products
    .filter((p) => p.category === product?.category && p.productId !== parsedId)
    .slice(0, 4);

  const today = new Date();
  const minDelivery = new Date(today);
  minDelivery.setDate(today.getDate() + 2);
  const maxDelivery = new Date(today);
  maxDelivery.setDate(today.getDate() + 5);
  const deliveryRange = `${minDelivery.toDateString()} - ${maxDelivery.toDateString()}`;

  if (loadingProducts || loadingImages) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <PuffLoader color="#3B82F6" size={60} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-red-400 text-center font-semibold bg-black min-h-screen">
        ⚠️ Product not found.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] px-4 py-10">
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl animate-fade-in text-white">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
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

            {/* Product Info */}
            <div className="space-y-5">
              <h1 className="text-3xl font-bold text-white">{product.title}</h1>
              <p className="text-2xl text-blue-400 font-semibold">
                Ksh {parseFloat(product.price).toFixed(2)}
              </p>

              {/* Quantity Selector */}
              <div>
                <label className="font-medium text-gray-300">Quantity</label>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-700 rounded">-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 bg-gray-700 rounded">+</button>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-500 transition">
                Add to Cart
              </button>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Description</h3>
                <p className="text-gray-300">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {/* More Info */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">More Info</h3>
                <ul className="text-gray-300 list-disc ml-5">
                  {product.brand && <li>Brand: {product.brand}</li>}
                  {product.category && <li>Category: {product.category}</li>}
                  <li>SKU: #{product.productId}</li>
                </ul>
              </div>

              {/* Delivery Estimate */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Estimated Delivery</h3>
                <p className="text-gray-300">
                  📦 Between <strong>{deliveryRange}</strong>
                </p>
                <p className="text-sm text-gray-400">Business days only. May vary by location.</p>
              </div>

              {/* Return Policy */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Return Policy</h3>
                <p className="text-gray-300">
                  Returns accepted within 7 days of delivery. Item must be unused and in original packaging.
                </p>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">🛍️ Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((p) => {
                  const img = images.find((i) => i.productId === p.productId)?.url || "/placeholder.jpg";
                  return (
                    <Link
                      to={`/products/${p.productId}`}
                      key={p.productId}
                      className="bg-white/10 rounded-xl overflow-hidden shadow hover:shadow-lg transition hover:scale-[1.02]"
                    >
                      <img src={img} alt={p.title} className="w-full h-48 object-cover" />
                      <div className="p-4 text-white">
                        <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                        <p className="text-blue-400 font-bold">
                          Ksh {parseFloat(p.price).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Zoom Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fade-in"
              onClick={() => setSelectedImage(null)}
            >
              <img src={selectedImage} alt="Zoomed" className="max-h-[90%] max-w-[90%] rounded-lg" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
