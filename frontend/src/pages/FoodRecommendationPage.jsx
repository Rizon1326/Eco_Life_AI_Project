import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Activity, User, Apple, AlertTriangle, Info, Loader2 } from 'lucide-react';

const FoodRecommendationPage = () => {
  const [diseases, setDiseases] = useState('');
  const [bmi, setBmi] = useState('');
  const [specificFood, setSpecificFood] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    if (!bmi) {
      setError('BMI is required');
      return false;
    }
    if (isNaN(bmi) || bmi < 10 || bmi > 50) {
      setError('Please enter a valid BMI between 10 and 50');
      return false;
    }
    return true;
  };

  

  const fetchRecommendations = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/food-recommendation', {
        diseases,
        bmi,
        specific_food: specificFood,
      });
      setRecommendations(response.data);
    } catch (error) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error('Error fetching food recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Personalized Food Recommendations
          </h2>
          <p className="text-gray-600 text-lg">
            Get tailored dietary advice based on your health profile
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            {/* Diseases Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Conditions
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="E.g., diabetes, hypertension (optional)"
                  value={diseases}
                  onChange={(e) => setDiseases(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition duration-200"
                />
              </div>
            </div>

            {/* BMI Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BMI (Body Mass Index)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  placeholder="Enter your BMI"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition duration-200"
                />
              </div>
            </div>

            {/* Specific Food Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Food
              </label>
              <div className="relative">
                <Apple className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter a specific food (optional)"
                  value={specificFood}
                  onChange={(e) => setSpecificFood(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition duration-200"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl
                transition duration-200 transform hover:scale-105 active:scale-100
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Generating Recommendations...</span>
                </>
              ) : (
                <>
                  <Info className="h-5 w-5" />
                  <span>Get Recommendations</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {recommendations && (
          <div className="space-y-8 animate-fadeIn">
            {/* Dietary Recommendations */}
            {recommendations.recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Dietary Recommendations
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {recommendations.recommendations.join("\n")}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Food Restrictions */}
            {recommendations.alerts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Food Restrictions
                </h3>
                <div className="prose max-w-none text-red-600">
                  <ReactMarkdown>
                    {recommendations.alerts.join("\n")}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Specific Food Intake */}
            {Object.keys(recommendations.specific_food_intake).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                  <Apple className="h-5 w-5 mr-2" />
                  Specific Food Intake Recommendations
                </h3>
                <div className="grid gap-4">
                  {Object.entries(recommendations.specific_food_intake).map(([food, intake], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg
                        hover:bg-gray-100 transition duration-200"
                    >
                      <span className="font-medium text-gray-700">{food}</span>
                      <span className="text-blue-600 font-semibold">{intake}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodRecommendationPage;
