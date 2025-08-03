import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllSubcategoriesQuery } from '../../Features/Apis/SubCategoryApi';

const SubcategoriesPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data: subcategories, isLoading, isError } = useGetAllSubcategoriesQuery();

  const filtered = subcategories?.filter(
    (sub) => sub.categoryId.toString() === categoryId
  );

  if (isLoading) return <p>Loading subcategories...</p>;
  if (isError) return <p>Failed to load subcategories</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subcategories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {filtered?.map((sub) => (
          <div
            key={sub.subcategoryId}
            className="cursor-pointer shadow hover:shadow-lg rounded-lg overflow-hidden"
            onClick={() => navigate(`/products/subcategory/${sub.subcategoryId}`)}
          >
            <img
              src={sub.imageUrl || 'https://via.placeholder.com/150'}
              alt={sub.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2 text-center">{sub.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoriesPage;
