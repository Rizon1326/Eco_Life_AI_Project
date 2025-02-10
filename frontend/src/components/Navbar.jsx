import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/classify', label: 'Waste Classification' },
    { path: '/health', label: 'Health' },
    { path: '/food-recommendation', label: 'Food Recommendation' },
    { path: '/food-alternatives', label: 'Food Alternatives' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white'}
    `}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-emerald-400 
                rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20
                transform transition-transform duration-300 group-hover:scale-110"
              >
                <Leaf className="w-6 h-6 text-white transform -rotate-12" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                bg-clip-text text-transparent hidden sm:block transform transition-all duration-300
                group-hover:translate-x-1"
              >
                Eco<span className="text-green-600">Life</span>AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  flex items-center space-x-1 relative group
                  ${isActive(link.path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                  }`}
              >
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 
                    transform group-hover:translate-x-1 transition-all duration-300" 
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              transition-transform duration-300 active:scale-95"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium 
                  transition-all duration-300 flex items-center justify-between
                  ${isActive(link.path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                  }`}
              >
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;