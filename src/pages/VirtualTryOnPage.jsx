import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, Download, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { virtualTryOn } from '../lib/api'; // استيراد الدالة من api.js

const VirtualTryOnPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [userImage, setUserImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  // Mock product data (هذا يجب أن يأتي من API في تطبيق حقيقي)
  const product = {
    id: productId,
    name: 'فستان صيفي أنيق',
    brand: 'Zara',
    price: '$89',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop'
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userImage) return;
    
    setIsProcessing(true);
    setResult(null); // مسح النتيجة السابقة

    try {
      // تحويل base64 إلى Blob/File إذا كان userImage هو base64
      let imageFile = userImage;
      if (userImage.startsWith("data:")) {
        const response = await fetch(userImage);
        const blob = await response.blob();
        imageFile = new File([blob], "user_image.png", { type: blob.type });
      }

      const tryOnResult = await virtualTryOn(imageFile, product);
      if (tryOnResult && tryOnResult.status === 'success') {
        setResult(tryOnResult.try_on_image_url);
      } else {
        console.error("Virtual try-on failed:", tryOnResult?.message || "Unknown error");
        setResult(null); // في حالة الفشل، لا تعرض نتيجة
      }
    } catch (error) {
      console.error("Error during virtual try-on:", error);
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseProfileImage = () => {
    // Use saved profile image
    const savedUser = localStorage.getItem('fashionAI_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserImage(user.avatar);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">التجربة الافتراضية</h1>
          <p className="text-sm text-gray-600">جرب المنتج قبل الشراء</p>
        </div>
      </div>

      {/* Product Info */}
      <Card className="p-4 mb-6">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-16 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.brand}</p>
            <Badge variant="secondary">{product.price}</Badge>
          </div>
        </div>
      </Card>

      {/* Image Upload Section */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Camera size={20} className="mr-2" />
          اختر صورتك
        </h3>

        {!userImage ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">ارفع صورة واضحة لك</p>
              <div className="space-y-2">
                <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload size={16} className="mr-2" />
                  رفع صورة جديدة
                </Button>
                <Button variant="outline" onClick={handleUseProfileImage} className="w-full">
                  <Camera size={16} className="mr-2" />
                  استخدام صورة الملف الشخصي
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">نصائح للحصول على أفضل نتيجة:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• استخدم صورة واضحة وبإضاءة جيدة</li>
                <li>• تأكد من ظهور الجسم كاملاً في الصورة</li>
                <li>• ارتد ملابس بسيطة وضيقة</li>
                <li>• قف في وضعية مستقيمة</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={userImage} 
                alt="صورتك"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserImage(null)}
                className="absolute top-2 right-2"
              >
                تغيير الصورة
              </Button>
            </div>

            <Button 
              onClick={handleTryOn}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  جرب المنتج الآن
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-white animate-pulse" size={32} />
            </div>
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
              الذكاء الاصطناعي يعمل...
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
              جاري تحليل صورتك وتطبيق المنتج عليها
            </p>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Sparkles size={20} className="mr-2 text-purple-500" />
            النتيجة النهائية
          </h3>
          
          <div className="space-y-4">
            <img 
              src={result} 
              alt="النتيجة"
              className="w-full h-80 object-cover rounded-lg"
            />
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button className="flex-1">
                <Download size={16} className="mr-2" />
                حفظ الصورة
              </Button>
              <Button variant="outline" className="flex-1">
                <RefreshCw size={16} className="mr-2" />
                إعادة المحاولة
              </Button>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">رأي الذكاء الاصطناعي:</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                هذا المنتج يناسبك بنسبة 95%! اللون يتماشى مع لون بشرتك والقياس مناسب لنوع جسمك.
                ننصح بشرائه لأنه سيبدو رائعاً عليك.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VirtualTryOnPage;


