import { useState, useEffect } from 'react';
import { Search, Mic, Camera, XCircle, Filter, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { smartSearch } from '../lib/api'; // استيراد الدالة من api.js

const SmartSearchPage = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([
    'فساتين سهرة',
    'أزياء رجالية كاجوال',
    'أحذية رياضية نسائية',
    'ملابس أطفال صيفية',
  ]);

  useEffect(() => {
    // تحميل سجل البحث من التخزين المحلي
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);

    // إضافة البحث إلى السجل
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5); // حفظ آخر 5 عمليات بحث
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    try {
      const searchData = await smartSearch(query, filters);
      setResults(searchData.products || []);
    } catch (error) {
      console.error("Error during smart search:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleVoiceSearch = () => {
    // Placeholder for voice search functionality
    alert('البحث الصوتي غير متاح حالياً.');
  };

  const handleImageSearch = () => {
    // Placeholder for image search functionality
    alert('البحث بالصور غير متاح حالياً.');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">البحث الذكي</h1>

      {/* Search Input */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
        <Input
          type="text"
          placeholder="ابحث عن أزياء، أنماط، ألوان..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search size={20} />
        </Button>
        <Button variant="outline" size="icon" onClick={handleVoiceSearch}>
          <Mic size={20} />
        </Button>
        <Button variant="outline" size="icon" onClick={handleImageSearch}>
          <Camera size={20} />
        </Button>
      </div>

      {/* Filters (Placeholder) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">الفلاتر</h2>
        <Button variant="ghost" size="sm">
          <Filter size={16} className="mr-2" />
          تطبيق الفلاتر
        </Button>
      </div>
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">الكل</Badge>
          <Badge variant="outline">فساتين</Badge>
          <Badge variant="outline">قمصان</Badge>
          <Badge variant="outline">أحذية</Badge>
          <Badge variant="outline">أزرق</Badge>
          <Badge variant="outline">صيفي</Badge>
        </div>
      </Card>

      {/* Trending Searches */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold flex items-center mb-3">
          <TrendingUp size={20} className="mr-2 text-blue-500" />
          عمليات البحث الشائعة
        </h2>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((term, index) => (
            <Button key={index} variant="outline" onClick={() => setQuery(term)}>
              {term}
            </Button>
          ))}
        </div>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold flex items-center justify-between mb-3">
            سجل البحث
            <Button variant="ghost" size="sm" onClick={handleClearHistory}>
              <XCircle size={16} className="mr-2" />
              مسح الكل
            </Button>
          </h2>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((term, index) => (
              <Button key={index} variant="secondary" onClick={() => setQuery(term)}>
                {term}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isLoading ? (
        <div className="text-center text-gray-500">
          <Search size={24} className="animate-bounce mx-auto mb-2" />
          جاري البحث...
        </div>
      ) : results.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">النتائج ({results.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <p className="text-sm font-bold mt-1">{product.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (query && !isLoading) ? (
        <div className="text-center text-gray-500">
          <p>لا توجد نتائج لبحثك.</p>
        </div>
      ) : null}
    </div>
  );
};

export default SmartSearchPage;


