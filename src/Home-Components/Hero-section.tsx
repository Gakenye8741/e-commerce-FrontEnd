import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import hero1 from "../assets/hero6.jpg";
import hero2 from "../assets/hero5.jpg";
import hero3 from "../assets/hero4.jpg";

const slides = [
  {
    image: hero1,
    title: "Premium Quality Products",
    description: "Shop the latest trends with affordable pricing",
  },
  {
    image: hero2,
    title: "Fast & Reliable Delivery",
    description: "We bring it right to your doorstep",
  },
  {
    image: hero3,
    title: "Secure Payments",
    description: "Checkout with confidence using secure gateways",
  },
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 10000); // 10 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 backdrop-blur-md bg-white/10">
            <motion.h1
              key={slides[index].title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-bold text-white drop-shadow-md mb-4"
            >
              {slides[index].title}
            </motion.h1>

            <motion.p
              key={slides[index].description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="text-lg md:text-xl text-white drop-shadow mb-6"
            >
              {slides[index].description}
            </motion.p>

            <motion.a
              key={slides[index].title + "-btn"}
              href="#shop"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
              className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Shop Now
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;
