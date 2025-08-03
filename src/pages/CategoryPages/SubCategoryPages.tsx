import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllSubcategoriesQuery } from '../../Features/Apis/SubCategoryApi';
import { useGetCategoryByIdQuery } from '../../Features/Apis/categoryApi';
import { PuffLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
import sparkleSfx from '../../assets/preview.mp3'; // Your local MP3 file

// 👇 Inline canvas-confetti types
// @ts-ignore
import rawConfetti from 'canvas-confetti';
const confetti: typeof import('canvas-confetti') = rawConfetti;

// ✅ Define subcategory and category types
interface Subcategory {
  subcategoryId: number;
  name: string;
  imageUrl?: string;
  categoryId: number;
  description?: string;
}

interface Category {
  categoryId: number;
  name: string;
  description?: string;
}

const SubcategoriesPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const [play] = useSound(sparkleSfx, { volume: 0.4 });

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
  } = useGetAllSubcategoriesQuery() as {
    data?: Subcategory[];
    isLoading: boolean;
    isError: boolean;
  };

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetCategoryByIdQuery(categoryId) as {
    data?: Category;
    isLoading: boolean;
    isError: boolean;
  };

  const filtered = subcategories?.filter(
    (sub) => String(sub.categoryId) === categoryId
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

  // 🎉 Trigger Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  return (
    <motion.div
      className="p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* 🌈 Marquee */}
      <div className="overflow-hidden mb-6">
        <motion.div
          className="whitespace-nowrap text-center text-lg sm:text-xl font-semibold text-pink-600"
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

      {/* 🎯 Title & Description */}
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Explore <span className="text-blue-600 capitalize">{category?.name}</span> subcategories
      </motion.h2>

      <motion.p
        className="text-gray-600 text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Find the perfect products just for you 🎁
      </motion.p>

      {/* 🧩 Product Grid with Animation */}
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
        {filtered?.map((sub) => (
          <motion.div
            key={sub.subcategoryId}
            onClick={() => navigate(`/products/subcategory/${sub.subcategoryId}`)}
            className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05, rotate: 1 }}
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
              <h3 className="text-lg font-semibold text-gray-800">
                {sub.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SubcategoriesPage;
