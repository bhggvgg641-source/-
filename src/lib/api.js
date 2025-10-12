const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const registerUser = async (userData) => {
    const formData = new FormData();
    for (const key in userData) {
        formData.append(key, userData[key]);
    }
    const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Failed to register user');
    }
    return response.json();
};

export const analyzeProfilePicture = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/analyze-profile-picture/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) {
        throw new Error('Failed to analyze profile picture');
    }
    return response.json();
};

export const getAIRecommendations = async (userId, page = 1, location = null) => {
    const response = await fetch(`${API_BASE_URL}/get-recommendations/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, page, location }),
    });
    if (!response.ok) {
        throw new Error('Failed to get AI recommendations');
    }
    return response.json();
};

export const advancedSearch = async (userId, filters, page = 1, location = null) => {
    const response = await fetch(`${API_BASE_URL}/advanced-search/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, filters, page, location }),
    });
    if (!response.ok) {
        throw new Error('Failed to perform advanced search');
    }
    return response.json();
};

// وظائف المنتجات (Products) - افتراضية، قد تحتاج إلى تعديلها لتناسب الواجهة الخلفية الفعلية
export const getProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products/all`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const getProductDetails = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return response.json();
};

// وظائف التجربة الافتراضية (Virtual Try-On) - افتراضية، قد تحتاج إلى تعديلها
export const virtualTryOn = async (userImageFile, product) => {
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
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to perform virtual try-on');
    }
    return response.json();
};

// وظائف الربح (Monetization) - افتراضية، قد تحتاج إلى تعديلها
export const getEarningsData = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/monetization/earnings?user_id=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch earnings data');
    }
    return response.json();
};

export const getReferralCode = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/monetization/referral_code?user_id=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch referral code');
    }
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
    if (!response.ok) {
        throw new Error('Failed to track referral');
    }
    return response.json();
};

