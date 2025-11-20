const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// وظائف المصادقة (Authentication)
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// وظائف المنتجات (Products)
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products/all`);
  return response.json();
};

export const getProductDetails = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);
  return response.json();
};

// وظائف الذكاء الاصطناعي والتوصيات (AI Recommendations)
export const getAIRecommendations = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/ai_recommendations/feed?user_id=${userId}`);
  return response.json();
};

export const analyzeStyle = async (userImageBase64) => {
  const response = await fetch(`${API_BASE_URL}/ai_recommendations/style_analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_image_url: userImageBase64 }),
  });
  return response.json();
};

// وظائف البحث الذكي (Smart Search)
export const smartSearch = async (query, filters = {}) => {
  const params = new URLSearchParams({ query, ...filters });
  const response = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`);
  return response.json();
};

// وظائف التجربة الافتراضية (Virtual Try-On)
export const virtualTryOn = async (userImageFile, product) => {
  // تحويل الصورة إلى base64 لإرسالها إلى الخلفية
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  let userImageBase64 = null;
  if (userImageFile) {
    userImageBase64 = await toBase64(userImageFile);
  }

  const response = await fetch(`${API_BASE_URL}/virtual_tryons/try_on`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_image: userImageBase64,
      product_id: product.id,
      // يمكنك إضافة المزيد من بيانات المنتج هنا إذا لزم الأمر
    }),
  });
  return response.json();
};

// وظائف الربح (Monetization)
export const getEarningsData = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/monetization/earnings?user_id=${userId}`);
  return response.json();
};

export const getReferralCode = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/monetization/referral_code?user_id=${userId}`);
  return response.json();
};

export const trackReferral = async (referralCode) => {
  const response = await fetch(`${API_BASE_URL}/monetization/track_referral`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ referral_code: referralCode }),
  });
  return response.json();
};


