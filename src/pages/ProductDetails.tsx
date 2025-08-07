// File: ProductDetails.tsx

import { useParams, Link, useLocation } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import { useGetAllProductsQuery, useGetProductByIdQuery } from "../Features/Apis/ProductApi";
import { useGetAllImagesQuery } from "../Features/Apis/MediaApi";
import { useGetReviewsByProductIdQuery, useCreateReviewMutation } from "../Features/Apis/ReviewApi";
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

interface Review {
  reviewId: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const parsedId = parseInt(productId || "0", 10);

  const { data, isLoading: loadingProduct } = useGetProductByIdQuery(productId || "");
  const product: Product | undefined = data?.product;

  const { data: allProductsData } = useGetAllProductsQuery({});
  const { data: imageData, isLoading: loadingImages } = useGetAllImagesQuery({});

  const {
    data: productReviews,
    isLoading: loadingReviews,
    refetch,
  } = useGetReviewsByProductIdQuery(parsedId);

  const [createReview] = useCreateReviewMutation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const dummyUserId = 1; // Replace with actual auth logic

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

  const formatPrice = (price: string | number | undefined) =>
    price && !isNaN(Number(price)) ? Number(price).toFixed(2) : "N/A";

  const handleReviewSubmit = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    try {
      await createReview({
        userId: dummyUserId,
        productId: parsedId,
        rating: newRating,
        comment: newComment,
      }).unwrap();
      toast.success("Review submitted successfully!");
      setNewComment("");
      setNewRating(5);
      refetch();
    } catch (err) {
      console.error("Review Error:", err);
      toast.error("Failed to submit review.");
    }
  };

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
        {/* Product Images */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {productImages.length > 1 ? (
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={3000}
                onClickItem={(idx) => setSelectedImage(productImages[idx].url)}
              >
                {productImages.map((img, i) => (
                  <div key={i}>
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

          {/* Product Details */}
          <div className="space-y-5">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl text-blue-300 font-semibold">Ksh {formatPrice(product.price)}</p>

            {/* Quantity Selection */}
            <div>
              <label className="font-medium">Quantity</label>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-200 text-black rounded">-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1 bg-gray-200 text-black rounded">+</button>
              </div>
            </div>

            {/* Add to Cart */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                try {
                  const item: CartItem = {
                    productId: product.productId,
                    title: product.title,
                    price: Number(product.price ?? 0),
                    quantity,
                    image: productImages[0]?.url || "/placeholder.jpg",
                  };
                  addToCart(item);
                  toast.success("✅ Added to cart!");
                } catch (err) {
                  console.error(err);
                  toast.error("❌ Failed to add to cart.");
                }
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Add to Cart
            </motion.button>

            {/* Description & Info */}
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

            {/* Delivery & Returns */}
            <div>
              <h3 className="text-xl font-semibold mb-1">Estimated Delivery</h3>
              <p>📦 Between <strong>{deliveryRange}</strong></p>
              <p className="text-sm text-gray-300">Business days only. May vary by location.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Return Policy</h3>
              <p>Returns accepted within 7 days of delivery. Item must be unused and in original packaging.</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">🗣️ Customer Reviews</h2>
          {loadingReviews ? (
            <p>Loading reviews...</p>
          ) : productReviews?.length > 0 ? (
            <div className="space-y-4 mb-6">
              {productReviews.map((review: Review) => (
                <div key={review.reviewId} className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <p className="font-semibold text-yellow-300">⭐ {review.rating} / 5</p>
                  <p className="text-white">{review.comment}</p>
                  <p className="text-sm text-gray-300">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet for this product.</p>
          )}

          {/* Submit Review */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">📝 Leave a Review</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Rating</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded bg-white/20 text-white border border-white/30"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} - {["Excellent", "Good", "Average", "Poor", "Terrible"][5 - r]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded bg-white/10 text-white border border-white/20"
                  placeholder="Write your review..."
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={handleReviewSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Review
              </motion.button>
            </div>
          </div>
        </div>

        {/* Similar + New Products */}
        <div className="mt-16">
          {similarProducts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">🧩 Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {similarProducts.map((p) => {
                  const img = images.find((i) => i.productId === p.productId);
                  return (
                    <Link
                      key={p.productId}
                      to={`/products/${p.productId}`}
                      className="bg-white/10 rounded-lg overflow-hidden hover:scale-105 transform transition"
                    >
                      <img
                        src={img?.url || "/placeholder.jpg"}
                        alt={p.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3 text-white">
                        <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                        <p className="text-blue-300">Ksh {formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* New Arrivals */}
          <div>
            <h2 className="text-2xl font-bold mb-4">🆕 New Arrivals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...products].slice(-4).reverse().map((p) => {
                const img = images.find((i) => i.productId === p.productId);
                return (
                  <Link
                    key={p.productId}
                    to={`/products/${p.productId}`}
                    className="bg-white/10 rounded-lg overflow-hidden hover:scale-105 transform transition"
                  >
                    <img
                      src={img?.url || "/placeholder.jpg"}
                      alt={p.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3 text-white">
                      <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                      <p className="text-blue-300">Ksh {formatPrice(p.price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Zoom Modal */}
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
