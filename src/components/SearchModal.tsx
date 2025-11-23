import { useState } from 'react';
import type { UserProfile } from '../App';

interface SearchModalProps {
  user: UserProfile;
  onClose: () => void;
}

const PRODUCT_TYPES = [
  'Jacket',
  'Pants',
  'Shorts',
  'Shirt',
  'T-Shirt',
  'Dress',
  'Skirt',
  'Accessories',
  'Hat',
  'Shoes',
];

const MODELS = [
  'Sporty',
  'Modern',
  'Metallic',
  'Fashion',
  'Classic',
  'Traditional',
  'Casual',
  'Elegant',
  'Luxury',
  'Bohemian',
];

const COLORS = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Pink',
  'Black',
  'White',
  'Gray',
  'Brown',
  'Purple',
  'Orange',
  'Beige',
];

export default function SearchModal({ user, onClose }: SearchModalProps) {
  const [filters, setFilters] = useState({
    productType: '',
    model: '',
    color: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field] === value ? '' : value, // Toggle selection
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would send the search query to the backend
      console.log('Search filters:', filters);
      console.log('User profile:', user);

      // Close modal after search
      onClose();
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Advanced Search</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSearch} className="p-6 space-y-6">
          {/* User Profile Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Your Profile</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Skin Tone:</strong> {user.skinTone}</p>
              <p><strong>Body Type:</strong> {user.bodyType}</p>
              <p><strong>Style:</strong> {user.stylePreference || 'Not specified'}</p>
            </div>
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Product Type</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {PRODUCT_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleFilterChange('productType', type)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    filters.productType === type
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Style Model</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {MODELS.map(model => (
                <button
                  key={model}
                  type="button"
                  onClick={() => handleFilterChange('model', model)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    filters.model === model
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleFilterChange('color', color)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    filters.color === color
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading || (!filters.productType && !filters.model && !filters.color)}
            className="w-full bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          {/* Note */}
          <p className="text-xs text-gray-600 text-center">
            Select one or more filters to refine your search
          </p>
        </form>
      </div>
    </div>
  );
}
