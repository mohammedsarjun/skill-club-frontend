import { FaTag } from 'react-icons/fa';

interface OfferCategoryProps {
  category?: {
    categoryId: string;
    categoryName: string;
  };
}

export const OfferCategory: React.FC<OfferCategoryProps> = ({ category }) => {
  if (!category) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 rounded-lg">
          <FaTag className="text-purple-600 text-xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Work Category</h3>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
          {category.categoryName}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          This project falls under the {category.categoryName} category
        </p>
      </div>
    </div>
  );
};
