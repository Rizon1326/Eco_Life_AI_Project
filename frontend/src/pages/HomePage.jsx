import { Link } from "react-router-dom";
import Chatbot from "../components/Chatbot"; // Import the Chatbot component

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the EcoLifeAI
        </h1>
        <p className="text-lg text-gray-600">
          This platform provides tools for waste classification, food
          recommendations, and health advice. Choose a section from below to
          explore more.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/classify"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 mb-4 text-purple-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Classify Waste
          </h2>
          <p className="text-gray-600 text-sm">
            Learn to properly classify waste
          </p>
        </Link>

        <Link
          to="/health"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 mb-4 text-purple-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Health Insights
          </h2>
          <p className="text-gray-600 text-sm">
            Get health and wellness insights
          </p>
        </Link>

        <Link
          to="/food-recommendation"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 mb-4 text-purple-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Food Recommendations
          </h2>
          <p className="text-gray-600 text-sm">Get food suggestions</p>
        </Link>

        <Link
          to="/food-alternatives"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 mb-4 text-purple-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Food Alternatives
          </h2>
          <p className="text-gray-600 text-sm">Find healthy alternatives</p>
        </Link>
      </div>

      {/* Add the Chatbot here */}
      <Chatbot />
    </div>
  );
};

export default HomePage;
