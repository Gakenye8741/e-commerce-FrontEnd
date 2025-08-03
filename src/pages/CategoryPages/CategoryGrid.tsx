// CategoriesGrid.tsx
import { useGetAllCategoriesQuery } from '../../Features/Apis/categoryApi';
import { useNavigate } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const CategoriesGrid = () => {
  const { data: categories, isLoading, isError } = useGetAllCategoriesQuery();
  const navigate = useNavigate();

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: 'free-snap',
    renderMode: 'performance',
    slides: {
      perView: 'auto',
      spacing: 12,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 4, spacing: 16 },
      },
      '(min-width: 768px)': {
        slides: { perView: 6, spacing: 20 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 8, spacing: 24 },
      },
    },
  });

  if (isLoading) return <p className="p-4 text-center">Loading categories...</p>;
  if (isError || !categories) return <p className="p-4 text-center">Failed to load categories</p>;

  return (
    <div className="w-full px-4">
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
        These are our product categories. Swipe to see more!
      </h2>

      <div className="flex justify-center">
        <div ref={sliderRef} className="keen-slider max-w-screen-xl">
          {categories.map((category) => (
            <div
              key={category.id}
              className="keen-slider__slide !w-[80px] flex flex-col items-center cursor-pointer"
              onClick={() => navigate(`/category/${category.categoryId}`)}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-16 h-16 object-cover rounded-full shadow-md hover:shadow-lg transition duration-200"
              />
              <div className="mt-1 text-xs text-center">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
