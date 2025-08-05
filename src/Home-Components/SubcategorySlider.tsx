import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Product {
  productId: number;
  title: string;
  price: number | string;
  images?: { url: string; alt?: string }[];
}

interface Props {
  products: Product[];
  subcategoryName: string;
  subcategoryId: number | string; // ✅ Make sure this exists in the parent component
  categoryId: number | string;
}

const SubcategorySlider: React.FC<Props> = ({
  products,
  subcategoryName,
  subcategoryId, // ✅ Fix: Ensure this is destructured
}) => {
  const [sliderConfig, setSliderConfig] = useState({
    slides: {
      perView: 1.2,
      spacing: 12,
    },
    loop: false,
  });

  const [sliderRef] = useKeenSlider<HTMLDivElement>(sliderConfig);
  const navigate = useNavigate();

  const [showInlineSeeMore, setShowInlineSeeMore] = useState(false);

  useEffect(() => {
    const updateSliderConfig = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setSliderConfig({
          slides: { perView: 4, spacing: 20 },
          loop: false,
        });
        setShowInlineSeeMore(products.length > 4);
      } else if (width >= 640) {
        setSliderConfig({
          slides: { perView: 2.2, spacing: 16 },
          loop: false,
        });
        setShowInlineSeeMore(products.length > 2);
      } else {
        setSliderConfig({
          slides: { perView: 1.2, spacing: 12 },
          loop: false,
        });
        setShowInlineSeeMore(products.length > 2);
      }
    };

    updateSliderConfig();
    window.addEventListener("resize", updateSliderConfig);
    return () => window.removeEventListener("resize", updateSliderConfig);
  }, [products.length]);

  return (
    <section className="mb-20 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-3"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {subcategoryName}
        </h2>

        <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/products/subcategory/${subcategoryId}`) 
              }
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition w-40"
            >
              See More
            </motion.button>
      </motion.div>

      {/* Scroll Hint */}
      {products.length > 1 && (
        <motion.p
          className="text-sm text-gray-300 mb-2 pl-1 sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          👉 Swipe or scroll to see more
        </motion.p>
      )}

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {products.map((product, index) => (
          <motion.div
            key={product.productId}
            className="keen-slider__slide px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-xl text-white hover:scale-[1.02] transition-transform duration-300">
              <img
                src={product.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                alt={product.images?.[0]?.alt || product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                <p className="text-blue-300 font-bold">
                  Ksh {Number(product.price || 0).toFixed(2)}
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
            </div>
          </motion.div>
        ))}

        {/* Inline See More Button */}
        {showInlineSeeMore && (
          <motion.div
            className="keen-slider__slide px-2 flex items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/products/subcategory/${subcategoryId}`) // ✅ FIXED: Proper subcategoryId reference
              }
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition w-full"
            >
              See More
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SubcategorySlider;
