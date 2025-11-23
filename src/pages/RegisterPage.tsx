import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { UserProfile } from '../App';

interface RegisterPageProps {
  onRegister: (user: UserProfile) => void;
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Physical Attributes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null as File | null,
    profilePicturePreview: '',
  });

  // Step 2: Physical Attributes
  const [physicalInfo, setPhysicalInfo] = useState({
    skinTone: '',
    bodyType: '',
    weight: '',
    height: '',
    age: '',
    stylePreference: '',
    additionalInfo: '',
  });

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePhysicalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPhysicalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBasicInfo(prev => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate basic info
    if (!basicInfo.username || !basicInfo.email || !basicInfo.password || !basicInfo.profilePicture) {
      setError('Please fill in all required fields');
      return;
    }

    if (basicInfo.password !== basicInfo.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate physical info
      if (!physicalInfo.skinTone || !physicalInfo.bodyType || !physicalInfo.weight || !physicalInfo.height || !physicalInfo.age) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create user object
      const newUser: UserProfile = {
        id: Date.now().toString(),
        username: basicInfo.username,
        email: basicInfo.email,
        profilePicture: basicInfo.profilePicturePreview,
        skinTone: physicalInfo.skinTone,
        bodyType: physicalInfo.bodyType,
        weight: parseFloat(physicalInfo.weight),
        height: parseFloat(physicalInfo.height),
        age: parseInt(physicalInfo.age),
        stylePreference: physicalInfo.stylePreference,
        additionalInfo: physicalInfo.additionalInfo,
      };

      // Save to localStorage
      const existingUsers = JSON.parse(localStorage.getItem('fashionAIUsers') || '[]');
      existingUsers.push({ ...newUser, password: basicInfo.password });
      localStorage.setItem('fashionAIUsers', JSON.stringify(existingUsers));

      // Call onRegister callback
      onRegister(newUser);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {step === 1 ? (
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                Fashion AI
              </h1>
              <h2 className="text-xl font-semibold text-gray-800 mt-4">Create Your Account</h2>
              <p className="text-gray-600 text-sm mt-2">Step 1 of 2: Basic Information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={basicInfo.username}
                  onChange={handleBasicInfoChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={basicInfo.email}
                  onChange={handleBasicInfoChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={basicInfo.password}
                  onChange={handleBasicInfoChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={basicInfo.confirmPassword}
                  onChange={handleBasicInfoChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="hidden"
                    id="profilePicture"
                  />
                  <label htmlFor="profilePicture" className="cursor-pointer">
                    {basicInfo.profilePicturePreview ? (
                      <div>
                        <img src={basicInfo.profilePicturePreview} alt="Preview" className="w-24 h-24 rounded-lg mx-auto mb-2 object-cover" />
                        <p className="text-sm text-gray-600">Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600">📷 Click to upload your photo</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Next: Physical Attributes
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/" className="text-pink-600 font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800">Complete Your Profile</h2>
              <p className="text-gray-600 text-sm mt-2">Step 2 of 2: Physical Attributes</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Tone *</label>
                <select
                  name="skinTone"
                  value={physicalInfo.skinTone}
                  onChange={handlePhysicalInfoChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select skin tone</option>
                  <option value="fair">Fair</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="olive">Olive</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Body Type *</label>
                <select
                  name="bodyType"
                  value={physicalInfo.bodyType}
                  onChange={handlePhysicalInfoChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select body type</option>
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic</option>
                  <option value="average">Average</option>
                  <option value="curvy">Curvy</option>
                  <option value="plus">Plus Size</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={physicalInfo.weight}
                    onChange={handlePhysicalInfoChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm) *</label>
                  <input
                    type="number"
                    name="height"
                    value={physicalInfo.height}
                    onChange={handlePhysicalInfoChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="170"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={physicalInfo.age}
                  onChange={handlePhysicalInfoChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Style Preference</label>
                <input
                  type="text"
                  name="stylePreference"
                  value={physicalInfo.stylePreference}
                  onChange={handlePhysicalInfoChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Casual, Formal, Sporty"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Info</label>
                <textarea
                  name="additionalInfo"
                  value={physicalInfo.additionalInfo}
                  onChange={handlePhysicalInfoChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="Any other details about your style..."
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
