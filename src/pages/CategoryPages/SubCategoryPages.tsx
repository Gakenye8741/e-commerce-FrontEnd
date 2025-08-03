import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllSubcategoriesQuery } from '../../Features/Apis/SubCategoryApi';
import { useGetCategoryByIdQuery } from '../../Features/Apis/categoryApi';
import { PuffLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import sparkleSfx from '../../assets/preview.mp3';
import { useState } from 'react';

const SubcategoriesPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [play] = useSound(sparkleSfx, { volume: 0.4 });
  const [searchTerm, setSearchTerm] = useState('');

  if (!categoryId) {
    return (
      <p className="text-red-500 text-center mt-6 text-lg">
        No category selected.
      </p>
    );
  }

  const {
    data: subcategories,
    isLoading: isSubcategoriesLoading,
    isError: isSubcategoriesError,
  } = useGetAllSubcategoriesQuery();

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetCategoryByIdQuery(categoryId);

  const filtered = subcategories
    ?.filter((sub) => String(sub.categoryId) === String(categoryId))
    ?.filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

  if (isSubcategoriesLoading || isCategoryLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <PuffLoader size={60} color="#4A90E2" />
      </div>
    );
  }

  if (isSubcategoriesError || isCategoryError) {
    return (
      <p className="text-red-500 text-center mt-6 text-lg">
        Failed to load subcategories or category information.
      </p>
    );
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  return (
    <motion.div
      className="min-h-screen p-6 sm:p-8 bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Top Bar: Back & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          ⬅ Back to Categories
        </button>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg bg-fuchsia-300 text-black focus:outline-none w-full sm:w-64"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden mb-6">
        <motion.div
          className="whitespace-nowrap text-center text-lg sm:text-xl font-semibold text-pink-300"
          animate={{ x: ['100%', '-100%'] }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: 'linear',
          }}
        >
          🛍️ Welcome to our fabulous store! 🎉 Discover handpicked{' '}
          <span className="uppercase">{category?.name}</span> subcategories 👗👠
          — Happy shopping! 💖✨
        </motion.div>
      </div>

      {/* Title */}
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Explore <span className="text-blue-300 capitalize">{category?.name}</span> subcategories
      </motion.h2>

      <motion.p
        className="text-blue-100 text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Find the perfect products just for you 🎁
      </motion.p>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {filtered?.length ? (
          filtered.map((sub) => (
            <motion.div
              key={sub.subcategoryId}
              onClick={() =>
                navigate(`/products/subcategory/${sub.subcategoryId}`)
              }
              className="cursor-pointer bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              whileHover={{ rotate: 1 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => {
                triggerConfetti();
                play();
              }}
            >
              <img
                src={sub.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={sub.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white">
                  {sub.name}
                </h3>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-pink-200 col-span-full">
            No subcategories found.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubcategoriesPage;
