import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAIRecommendations } from '../lib/api';

const AIRecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [userAnalysis, setUserAnalysis] = useState('');

  const fetchRecommendations = async (page) => {
    try {
      setIsLoading(true);
      // افتراض وجود user_id للمحاكاة، في تطبيق حقيقي سيأتي من سياق المستخدم المسجل
      const userId = 1; // استخدام معرف رقمي بدلاً من نص
      const location = 'الرياض، السعودية'; // يمكن الحصول عليه من موقع المستخدم الجغرافي
      const data = await getAIRecommendations(userId, location, page);
      
      if (data.user_analysis) {
        setUserAnalysis(data.user_analysis);
      }
      
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations((prev) => [...prev, ...data.recommendations]);
        setHasNextPage(data.has_next_page);
        setCurrentPage(data.current_page);
      } else {
        setError('لا توجد توصيات متاحة حالياً.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالخادم: ' + err.message);
      console.error("Error fetching AI recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(1);
  }, []);

  const loadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchRecommendations(currentPage + 1);
    }
  };

  if (isLoading && recommendations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">جاري تحميل التوصيات الذكية...</p>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>خطأ: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">توصيات الذكاء الاصطناعي</h1>

      {userAnalysis && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-purple-700">تحليلك الشخصي:</h2>
          <p className="text-sm text-gray-700">{userAnalysis}</p>
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>لا توجد توصيات متاحة حالياً.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((post, index) => (
            <Card key={index} className="overflow-hidden">
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
                {post.image_url && (
                  <img src={post.image_url} alt="منتج" className="w-full h-80 object-cover" />
                )}
                <div className="p-4">
                  <p className="text-gray-700 mb-4">{post.text}</p>
                  {post.product_link && (
                    <div className="flex justify-between items-center">
                      <Button asChild>
                        <a href={post.product_link} target="_blank" rel="noopener noreferrer">
                          شاهد المنتج
                        </a>
                      </Button>
                    </div>
                  )}
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

          {hasNextPage && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={isLoading}>
                {isLoading ? 'جاري التحميل...' : 'تحميل المزيد'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationsPage;

