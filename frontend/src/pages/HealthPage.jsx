import { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { 
  User, 
  Ruler, 
  Scale, 
  Activity, 
  Heart, 
  FileText, 
  Calendar,
  Loader2, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const HealthPage = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [bloodPressure, setBloodPressure] = useState('');
  const [diseases, setDiseases] = useState('');
  const [dailyActivities, setDailyActivities] = useState('');
  const [pregnancy, setPregnancy] = useState(false);
  const [period, setPeriod] = useState(false);
  const [healthSummary, setHealthSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sanitizeResponse = (text) => {
    if (typeof text === 'string') {
      let sanitizedText = text.replace(/[#-]+/g, '').trim();
      return sanitizedText;
    }
    return text;
  };

  const convertMarkdownToHTML = (markdownText) => {
    if (typeof markdownText === 'string') {
      return marked.parse(markdownText);
    } else if (Array.isArray(markdownText)) {
      return marked.parse(markdownText.join('\n'));
    }
    return '';
  };

  const handleSubmit = async () => {
    if (!age || !height || !weight || !dailyActivities) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const healthData = {
      age,
      height,
      weight,
      gender,
      blood_pressure: bloodPressure || null,
      diseases: diseases || null,
      daily_activities: dailyActivities,
      pregnancy,
      period,
    };

    try {
      const response = await axios.post('http://localhost:8000/health/health_summary', healthData);

      const sanitizedData = {
        ...response.data,
        food_suggestions: sanitizeResponse(response.data.food_suggestions),
        recommendations: sanitizeResponse(response.data.recommendations),
        additional_notes: sanitizeResponse(response.data.additional_notes),
      };

      sanitizedData.food_suggestions = convertMarkdownToHTML(sanitizedData.food_suggestions);
      sanitizedData.recommendations = convertMarkdownToHTML(sanitizedData.recommendations);
      sanitizedData.additional_notes = convertMarkdownToHTML(sanitizedData.additional_notes);

      setHealthSummary(sanitizedData);
    } catch (error) {
      console.error('Error fetching health summary:', error.response || error);
      setErrorMessage('Failed to fetch health summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, required, ...props }) => (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 block mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          {...props}
          className="block w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 ease-in-out
            placeholder:text-gray-400"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Health Insights Dashboard
          </h2>
          <p className="text-lg text-gray-600">
            Get personalized health recommendations based on your profile
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-8 flex items-center p-4 bg-red-50 rounded-xl border-l-4 border-red-500 animate-slideIn">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <InputField
                  icon={User}
                  label="Age"
                  required
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />

                <InputField
                  icon={Ruler}
                  label="Height (cm)"
                  required
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height"
                />

                <InputField
                  icon={Scale}
                  label="Weight (kg)"
                  required
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200 ease-in-out
                        appearance-none bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <InputField
                  icon={Heart}
                  label="Blood Pressure"
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="e.g., 120/80"
                />

                <InputField
                  icon={FileText}
                  label="Medical Conditions"
                  type="text"
                  value={diseases}
                  onChange={(e) => setDiseases(e.target.value)}
                  placeholder="List any medical conditions"
                />
              </div>
            </div>

            {/* Daily Activities */}
            <div className="mt-8">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Daily Activities<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={dailyActivities}
                  onChange={(e) => setDailyActivities(e.target.value)}
                  rows={3}
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200 ease-in-out
                    resize-none"
                  placeholder="Describe your typical daily activities"
                />
              </div>
            </div>

            {/* Female-specific Options */}
            {gender === 'female' && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-xl hover:bg-purple-100 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={pregnancy}
                    onChange={(e) => setPregnancy(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded-lg
                      focus:ring-purple-500 cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700 cursor-pointer">
                    Currently Pregnant
                  </label>
                </div>

                <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-xl hover:bg-purple-100 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={period}
                    onChange={(e) => setPeriod(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded-lg
                      focus:ring-purple-500 cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700 cursor-pointer">
                    Currently Menstruating
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                  py-4 px-6 rounded-xl text-lg font-semibold
                  hover:from-blue-700 hover:to-indigo-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Generating Insights...</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-5 w-5" />
                    <span>Generate Health Insights</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Health Summary */}
        {healthSummary && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl animate-fadeIn">
            <div className="px-6 py-8 sm:p-10">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                Your Health Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* BMI Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-3 mb-2">
                    <Scale className="h-6 w-6 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Body Mass Index (BMI)</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">
                    {healthSummary.bmi} ({healthSummary.bmi_category})
                  </p>
                  <p className="text-sm text-gray-600">Your BMI category: {healthSummary.bmi_category}</p>
                </div>

                {/* Calories Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-3 mb-2">
                    <Activity className="h-6 w-6 text-green-600" />
                    <p className="text-sm font-medium text-green-800">Recommended Daily Calories</p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{healthSummary.recommended_calories}</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                    Health Recommendations
                  </h4>
                  <div 
                    dangerouslySetInnerHTML={{ __html: healthSummary.recommendations }}
                    className="prose max-w-none bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthPage;
