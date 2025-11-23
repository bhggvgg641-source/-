import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../App';
import SearchModal from '../components/SearchModal';

interface Post {
  id: string;
  text: string;
  product_link: string;
  image_url: string;
  likes: number;
  comments: number;
}

interface FeedPageProps {
  user: UserProfile;
  onLogout: () => void;
}

export default function FeedPage({ user, onLogout }: FeedPageProps) {
  const navigate = useNavigate();
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const POSTS_PER_BATCH = 5;

  // Simulate fetching posts from backend
  const fetchPosts = useCallback(async (page: number) => {
    setIsLoadingMore(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock posts
      const newPosts: Post[] = Array.from({ length: POSTS_PER_BATCH }, (_, i) => ({
        id: `post-${page}-${i}`,
        text: `This stylish outfit is perfect for your ${user.stylePreference || 'casual'} style! The colors complement your ${user.skinTone} skin tone beautifully.`,
        product_link: `https://example.com/product-${page}-${i}`,
        image_url: `https://images.unsplash.com/photo-${1500000000000 + page * 1000 + i}?w=500&h=600&fit=crop`,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
      }));

      setAllPosts(prev => [...prev, ...newPosts]);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setIsLoadingMore(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchPosts(1).then(() => {
      setLoading(false);
    });
  }, [fetchPosts]);

  // Update visible posts based on scroll
  useEffect(() => {
    const newVisibleCount = currentPage * POSTS_PER_BATCH;
    setVisiblePosts(allPosts.slice(0, newVisibleCount));

    // Pre-fetch next batch if we're close to the end
    if (allPosts.length < (currentPage + 1) * POSTS_PER_BATCH && !isLoadingMore) {
      fetchPosts(currentPage + 1);
    }
  }, [currentPage, allPosts, isLoadingMore, fetchPosts]);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 500;

    if (isNearBottom && !isLoadingMore && visiblePosts.length === currentPage * POSTS_PER_BATCH) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, visiblePosts.length, isLoadingMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Fashion AI
          </h1>
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Advanced Search"
            >
              🔍
            </button>

            {/* Try On Button */}
            <button
              onClick={() => navigate('/try-on')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Virtual Try On"
            >
              👕
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                onClick={handleLogout}
                title="Logout"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Feed Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-2xl mx-auto py-8 px-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-8">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                >
                  {/* Post Image */}
                  <div className="w-full h-96 bg-gray-200 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt="Fashion recommendation"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-800 mb-4 leading-relaxed">{post.text}</p>

                    {/* Product Link */}
                    <a
                      href={post.product_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-pink-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      View Product
                    </a>
                  </div>

                  {/* Engagement Section */}
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex gap-4 mb-3 text-sm text-gray-600">
                      <span>❤️ {post.likes} likes</span>
                      <span>💬 {post.comments} comments</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 text-gray-600">
                      <button className="flex items-center gap-2 hover:text-pink-600 transition-colors flex-1 justify-center py-2 hover:bg-gray-50 rounded">
                        <span>❤️</span>
                        <span>Like</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-pink-600 transition-colors flex-1 justify-center py-2 hover:bg-gray-50 rounded">
                        <span>💬</span>
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-pink-600 transition-colors flex-1 justify-center py-2 hover:bg-gray-50 rounded">
                        <span>📤</span>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 py-12">
                <p className="text-lg">No posts available</p>
              </div>
            )}
          </div>

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <SearchModal
          user={user}
          onClose={() => setShowSearchModal(false)}
        />
      )}

      {/* CSS for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
