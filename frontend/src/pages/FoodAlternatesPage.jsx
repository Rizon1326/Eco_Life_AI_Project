import { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, ChevronRight, Leaf, DollarSign, Apple } from 'lucide-react';

const FoodAlternatesPage = () => {
  const [foodList, setFoodList] = useState([]);
  const [alternatives, setAlternatives] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setFoodList(event.target.value.split(',').map(item => item.trim()));
    setError(null);
  };

  const handleFetchAlternatives = async () => {
    if (foodList.length === 0 || (foodList.length === 1 && foodList[0] === '')) {
      setError('Please enter at least one food item');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/food-alternatives', {
        food_list: foodList,
      });
      setAlternatives(response.data);
    } catch (error) {
      setError('Failed to fetch alternatives. Please try again.');
      console.error('Error fetching food alternatives:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-indigo-600 mb-4">
            Smart Food Alternatives
          </h2>
          <p className="text-gray-600 text-lg">
            Discover healthier and more sustainable food alternatives
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <label 
              htmlFor="foodInput" 
              className="block text-lg font-medium mb-2 text-gray-700"
            >
              Enter foods (comma separated)
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="foodInput"
                type="text"
                placeholder="e.g., apple, banana, chicken"
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  transition duration-200 ease-in-out
                  placeholder:text-gray-400"
              />
            </div>
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleFetchAlternatives}
              disabled={loading}
              className="inline-flex items-center justify-center
                bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                disabled:bg-indigo-300 text-white font-semibold
                py-4 px-8 rounded-xl text-lg transition duration-200
                transform hover:scale-105 active:scale-100
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Finding Alternatives...
                </>
              ) : (
                <>
                  <Apple className="mr-2 h-5 w-5" />
                  Get Alternatives
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {alternatives && (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-3xl font-bold text-center text-indigo-600 mb-8">
              Your Food Alternatives
            </h3>
            
            {alternatives.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden
                  transform transition duration-300 hover:shadow-xl"
              >
                {/* Original Food Header */}
                <div className="bg-indigo-600 px-6 py-4">
                  <h4 className="text-xl font-semibold text-white flex items-center">
                    <ChevronRight className="mr-2 h-5 w-5" />
                    Alternatives for {item.original_food.name}
                  </h4>
                </div>

                {/* Alternatives List */}
                <div className="p-6">
                  <div className="space-y-4">
                    {item.alternatives.map((alt, idx) => (
                      <div 
                        key={idx}
                        className="group bg-gray-50 rounded-lg p-5 hover:bg-gray-100
                          transition duration-200 ease-in-out"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Name and Amount */}
                          <div className="flex items-center space-x-3">
                            <Apple className="h-5 w-5 text-indigo-500" />
                            <div>
                              <span className="font-semibold text-gray-900">
                                {alt.name}
                              </span>
                              <span className="ml-2 text-gray-600">
                                ({alt.amount_grams}g)
                              </span>
                            </div>
                          </div>

                          {/* Cost Ratio */}
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <span className="text-gray-700">
                              Cost Ratio: {alt.cost_ratio}
                            </span>
                          </div>

                          {/* Nutrients */}
                          <div className="flex items-center space-x-2">
                            <Leaf className="h-5 w-5 text-green-500" />
                            <span className="text-gray-700 truncate" title={alt.key_matching_nutrients.join(', ')}>
                              {alt.key_matching_nutrients.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodAlternatesPage;