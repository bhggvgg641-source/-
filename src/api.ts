const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("VITE_API_URL is not defined. Check your .env files.");
}

// 1. تسجيل المستخدم
export const registerUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

// 2. تحليل الصورة الشخصية
export const analyzeProfilePicture = async (userId: string, imageFile: File) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('profile_picture', imageFile);

  const response = await fetch(`${API_URL}/analyze-profile-picture/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Profile analysis failed');
  }
  return response.json();
};

// 3. جلب التوصيات (Feed) - GET
export const getRecommendations = async (userId: string, page: number = 1) => {
  const response = await fetch(`${API_URL}/ai_recommendations/feed?user_id=${userId}&page=${page}`, {
    method: 'GET',
  });
  if (response.status === 404) {
    // 404 يعني لا توجد بيانات مخزنة مؤقتًا، يجب أن نطلب من الواجهة الأمامية إرسال POST
    return null; 
  }
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  return response.json();
};

// 4. توليد التوصيات (Feed) - POST
export const generateRecommendations = async (userId: string, location: string = "Not provided") => {
  const response = await fetch(`${API_URL}/ai_recommendations/feed/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, location }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate recommendations');
  }
  return response.json();
};

// 5. البحث المتقدم
export const advancedSearch = async (userId: string, filters: any, page: number = 1) => {
  const response = await fetch(`${API_URL}/advanced-search/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, filters, page }),
  });
  if (!response.ok) {
    throw new Error('Advanced search failed');
  }
  return response.json();
};
