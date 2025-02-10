import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the EcoLifeAI</h1>
      <p>
        This platform provides tools for waste classification, food recommendations, and health advice. 
        Choose a section from the navigation menu to explore more.
      </p>
      <div className="home-links">
        <Link to="/classify">Classify Waste</Link>
        <Link to="/health">Health Insights</Link>
        <Link to="/food-recommendation">Food Recommendations</Link>
        <Link to="/food-alternatives">Food Alternatives</Link>
      </div>
    </div>
  );
};

export default Home;
