import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../App';

interface SearchResult {
  id: string;
  text: string;
  product_link: string;
  image_url: string;
}

interface SearchPageProps {
  user: UserProfile;
  onLogout: () => void;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export default function SearchPage({ user, onLogout, toggleTheme, currentTheme }: SearchPageProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate fetching search results
    const loadResults = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate mock search results
        const mockResults: SearchResult[] = Array.from({ length: 12 }, (_, i) => ({
          id: `result-${i}`,
          text: `Search result ${i + 1}: Perfect match for your style preferences`,
          product_link: `https://example.com/product-${i}`,
          image_url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=500&h=600&fit=crop`,
        }));

        setResults(mockResults);
      } catch (err: any) {
        setError(err.message || 'Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Search Results
            </h1>
          </div>
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto py-8 px-4">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading search results...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Found {results.length} results
              </h2>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="w-full h-64 bg-gray-200 overflow-hidden">
                      <img
                        src={result.image_url}
                        alt="Search result"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-gray-800 text-sm mb-4">{result.text}</p>

                      <a
                        href={result.product_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gradient-to-r from-pink-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                      >
                        View Product
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
                      <button className="flex-1 py-2 text-gray-600 hover:text-pink-600 transition-colors text-sm">
                        ❤️ Like
                      </button>
                      <button className="flex-1 py-2 text-gray-600 hover:text-pink-600 transition-colors text-sm">
                        📤 Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <div className="text-center text-gray-600 py-12">
                  <p className="text-lg">No results found</p>
                  <p className="text-sm mt-2">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
