import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../App';

interface TryOnPageProps {
  user: UserProfile;
  onLogout: () => void;
}

export default function TryOnPage({ user, onLogout }: TryOnPageProps) {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would process the image
      console.log('Processing image for virtual try-on...');
    } catch (err: any) {
      setError(err.message || 'Try-on failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Virtual Try-On
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
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Photo</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-pink-500 transition-colors">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="tryOnImage"
                />
                <label htmlFor="tryOnImage" className="cursor-pointer">
                  {uploadedImage ? (
                    <div>
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-64 rounded-lg object-cover mb-4"
                      />
                      <p className="text-sm text-gray-600">Click to change photo</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl mb-4">📸</p>
                      <p className="text-gray-600 font-semibold">Click to upload your photo</p>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleTryOn}
                disabled={!uploadedImage || loading}
                className="w-full mt-6 bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Try On'}
              </button>
            </div>

            {/* Information Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex gap-4">
                    <div className="text-2xl">📸</div>
                    <div>
                      <p className="font-semibold">Upload Your Photo</p>
                      <p className="text-sm text-gray-600">Choose a clear photo of yourself</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-2xl">👕</div>
                    <div>
                      <p className="font-semibold">Select Clothing</p>
                      <p className="text-sm text-gray-600">Pick items from our recommendations</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-2xl">✨</div>
                    <div>
                      <p className="font-semibold">See the Result</p>
                      <p className="text-sm text-gray-600">Visualize how you'll look</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Your Profile</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Skin Tone:</strong> {user.skinTone}</p>
                  <p><strong>Body Type:</strong> {user.bodyType}</p>
                  <p><strong>Height:</strong> {user.height} cm</p>
                  <p><strong>Weight:</strong> {user.weight} kg</p>
                  <p><strong>Style:</strong> {user.stylePreference || 'Not specified'}</p>
                </div>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-pink-900 mb-4">💡 Tips</h3>
                <ul className="text-sm text-pink-800 space-y-2">
                  <li>• Use a well-lit photo for best results</li>
                  <li>• Wear form-fitting clothes for accuracy</li>
                  <li>• Face the camera directly</li>
                  <li>• Include your full body in the frame</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold">Processing your photo...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
