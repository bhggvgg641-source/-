import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAIRecommendations } from '../lib/api'; // استيراد الدالة من api.js

const AIRecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // افتراض وجود user_id للمحاكاة، في تطبيق حقيقي سيأتي من سياق المستخدم المسجل
        const userId = 'user123'; 
        const data = await getAIRecommendations(userId);
        if (data.status === 'success') {
          setRecommendations(data.recommendations);
        } else {
          setError(data.message || 'فشل في جلب التوصيات.');
        }
      } catch (err) {
        setError('حدث خطأ أثناء الاتصال بالخادم: ' + err.message);
        console.error("Error fetching AI recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">جاري تحميل التوصيات الذكية...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>خطأ: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">توصيات الذكاء الاصطناعي</h1>

      {recommendations.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>لا توجد توصيات متاحة حالياً.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center space-x-4 rtl:space-x-reverse p-4 pb-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">موضة AI</CardTitle>
                  <p className="text-sm text-gray-500">يقترح لك:</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-700 mb-2">{product.description}</p>
                  <div className="flex items-center mb-3">
                    <Sparkles className="text-purple-500 mr-2" size={20} />
                    <span className="font-bold text-purple-600">{product.ai_match_percentage}% تطابق</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">السبب: {product.recommendation_reason}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{product.price} ر.س</span>
                    <Button>شاهد المنتج</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-around p-3 border-t">
                <Button variant="ghost" className="flex items-center text-gray-600">
                  <Heart size={20} className="mr-1" /> إعجاب
                </Button>
                <Button variant="ghost" className="flex items-center text-gray-600">
                  <MessageCircle size={20} className="mr-1" /> تعليق
                </Button>
                <Button variant="ghost" className="flex items-center text-gray-600">
                  <Share2 size={20} className="mr-1" /> مشاركة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationsPage;


