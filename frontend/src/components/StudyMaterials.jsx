import { useState, useRef, useEffect } from "react"
import { Book, Search, Filter, Sparkles, GraduationCap, Brain, BookOpen, Download, ArrowUpDown, X } from "lucide-react"
import "./StudyMaterials.css"
import PaymentGateway from "./PaymentGateway";

// Move FilterPopup and SortPopup outside main component
const FilterPopup = ({ filters, setFilters, onApply, onClose }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Stop event from bubbling up
  };

  return (
    <div className="sm-filter-popup" onClick={handleClick}>
      <div className="sm-filter-content">
        <div className="sm-filter-header">
          <h3>Filters</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        
        <div className="sm-filter-section">
          <h4>Price Range</h4>
          <select 
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
          >
            <option value="all">All Prices</option>
            <option value="0-500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000+">Above ₹1000</option>
          </select>
        </div>

        <div className="sm-filter-section">
          <h4>Subject</h4>
          <select 
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
          >
            <option value="all">All Subjects</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="mathematics">Mathematics</option>
            <option value="biology">Biology</option>
          </select>
        </div>

        <button className="sm-apply-filters" onClick={onApply}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const SortPopup = ({ sortBy, setSortBy, onClose }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Stop event from bubbling up
  };

  return (
    <div className="sm-sort-popup" onClick={handleClick}>
      <div className="sm-sort-content">
        <div className="sm-sort-header">
          <h3>Sort By</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="sm-sort-options">
          {[
            { value: "popular", label: "Most Popular" },
            { value: "newest", label: "Newest First" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "rating", label: "Highest Rated" }
          ].map(option => (
            <button
              key={option.value}
              className={`sm-sort-option ${sortBy === option.value ? 'active' : ''}`}
              onClick={() => {
                setSortBy(option.value);
                onClose();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Update main component
const StudyMaterials = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    priceRange: "all",
    subject: "all"
  })
  const [sortBy, setSortBy] = useState("popular")
  const categoriesRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handlePurchase = (material) => {
    setSelectedMaterial(material);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://stubits.onrender.com/api/materials/');
        const data = await response.json();
        
        if (response.ok) {
          setMaterials(data);
          setError(null);
        } else {
          setError('Failed to fetch materials');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const categories = [
    { id: "all", name: "All", icon: <Book /> },
    { id: "iitjee", name: "IIT-JEE", icon: <GraduationCap /> },
    { id: "neet", name: "NEET", icon: <Brain /> },
    { id: "boards", name: "Board Exams", icon: <BookOpen /> },
    { id: "other", name: "Other Exams", icon: <Book /> },
  ]

  const scroll = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleCategoryClick = (e, categoryId) => {
    e.preventDefault()
    setSelectedCategory(categoryId)
  }

  const handleFilterClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFilters(!showFilters);
  };

  const handleSortClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSort(!showSort);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterReset = () => {
    setFilters({
      priceRange: "all",
      subject: "all"
    })
  }

  const handleSortReset = () => {
    setSortBy("popular")
  }

  const handleApplyFilters = () => {
    setShowFilters(false)
  }

  const getFilteredAndSortedMaterials = () => {
    let filtered = [...materials]

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query)
      )
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter(item => {
        const price = item.price
        switch(filters.priceRange) {
          case "0-500":
            return price <= 500
          case "500-1000":
            return price > 500 && price <= 1000
          case "1000+":
            return price > 1000
          default:
            return true
        }
      })
    }

    // Subject filter
    if (filters.subject !== "all") {
      filtered = filtered.filter(item => 
        item.subject.toLowerCase() === filters.subject.toLowerCase()
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "rating":
          return b.rating - a.rating
        case "popular":
        default:
          return b.students - a.students
      }
    })

    return filtered
  }

  const getActiveFilters = () => {
    const active = []
    if (selectedCategory !== 'all') {
      active.push({
        type: 'category',
        value: selectedCategory,
        label: categories.find(c => c.id === selectedCategory)?.name
      })
    }
    if (filters.priceRange !== 'all') {
      active.push({
        type: 'price',
        value: filters.priceRange,
        label: filters.priceRange === '0-500' ? 'Under ₹500' 
          : filters.priceRange === '500-1000' ? '₹500 - ₹1000' 
          : 'Above ₹1000'
      })
    }
    if (filters.subject !== 'all') {
      active.push({
        type: 'subject',
        value: filters.subject,
        label: `Subject: ${filters.subject}`
      })
    }
    if (sortBy !== 'popular') {
      active.push({
        type: 'sort',
        value: sortBy,
        label: `Sort: ${sortBy.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
      })
    }
    return active
  }

  const removeFilter = (filter) => {
    switch(filter.type) {
      case 'category':
        setSelectedCategory('all')
        break
      case 'price':
        setFilters(prev => ({ ...prev, priceRange: 'all' }))
        break
      case 'subject':
        setFilters(prev => ({ ...prev, subject: 'all' }))
        break
      case 'sort':
        setSortBy('popular')
        break
      default:
        break
    }
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getCategoryDisplay = (category) => {
    const displayMap = {
      'iitjee': 'IIT-JEE',
      'neet': 'NEET',
      'boards': 'Boards',
      'other': 'Other'
    };
    return displayMap[category] || capitalizeFirstLetter(category);
  };

  const filteredMaterials = getFilteredAndSortedMaterials()

  return (
    <div className="sm-container">
      <section className="sm-hero">
        <div className="background-effects">
          <div className="gradient-bg"></div>
          <div className="grid-overlay"></div>
          <div className="glow-effect" 
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            }}
          />
        </div>

        <div className="sm-hero-content">
          <div className="sm-badge">
            <Sparkles className="sm-badge-icon" />
            Premium Study Materials
          </div>
          <h1 className="sm-title">
            Level Up Your <span className="gradient-text">Learning</span>
          </h1>
          <p className="sm-description">
            Access comprehensive study materials crafted by expert educators
          </p>
        </div>
      </section>

      <div className="sm-content">
        <div className="sm-search-section">
          <div className="sm-search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search study materials..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button
            className={`sm-filter-btn ${
              Object.values(filters).some((v) => v !== "all") ? "active" : ""
            }`}
            onClick={handleFilterClick}
          >
            <Filter />
          </button>
          <button
            className={`sm-sort-btn ${sortBy !== "popular" ? "active" : ""}`}
            onClick={handleSortClick}
          >
            <ArrowUpDown />
          </button>
        </div>

        {/* Add active filters section */}
        {getActiveFilters().length > 0 && (
          <div className="sm-active-filters">
            {getActiveFilters().map((filter, index) => (
              <button
                key={index}
                className="sm-filter-tag"
                onClick={() => removeFilter(filter)}
              >
                {filter.label}
                <X className="sm-filter-tag-icon" size={14} />
              </button>
            ))}
          </div>
        )}

        <div className="sm-categories-wrapper">
          <button className="sm-scroll-btn left" onClick={() => scroll("left")}>
            &lt;
          </button>
          <div className="sm-categories" ref={categoriesRef}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`sm-category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={(e) => handleCategoryClick(e, category.id)}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          <button
            className="sm-scroll-btn right"
            onClick={() => scroll("right")}
          >
            &gt;
          </button>
        </div>

        {showFilters && (
          <FilterPopup
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {showSort && (
          <SortPopup
            sortBy={sortBy}
            setSortBy={setSortBy}
            onClose={() => setShowSort(false)}
          />
        )}

        <div className="sm-materials-grid">
          {loading ? (
            <div className="sm-loading">
              <div className="sm-loading-spinner"></div>
              <p>Loading study materials...</p>
            </div>
          ) : error ? (
            <div className="sm-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <div key={material._id} className="sm-material-card">
                <div className="sm-card-content">
                  <div className="sm-card-header">
                    <h3>{material.title}</h3>
                    <span className="sm-category-tag">
                      {capitalizeFirstLetter(material.subject)}
                    </span>
                  </div>
                  <p className="sm-card-description">{material.description}</p>
                  <div className="sm-card-stats">
                    <div className="sm-stat">
                      <BookOpen className="sm-stat-icon" />
                      {material.pages} Pages
                    </div>
                    <div className="sm-stat">
                      <GraduationCap className="sm-stat-icon" />
                      {getCategoryDisplay(material.category)}
                    </div>
                  </div>
                  <div className="sm-card-footer">
                    <div className="sm-price">₹{material.price}</div>
                    <button 
                      className="sm-buy-btn"
                      onClick={() => handlePurchase(material)}
                    >
                      <Download className="sm-btn-icon" />
                      Get Access
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sm-no-results">
              <Search
                size={48}
                style={{
                  color: "var(--purple-400)",
                  marginBottom: "1.5rem",
                  opacity: 0.6,
                }}
              />
              <p>No materials found matching your criteria</p>
              <button
                className="sm-reset-btn"
                onClick={() => {
                  setSearchQuery("");
                  handleFilterReset();
                  handleSortReset();
                  setSelectedCategory("all");
                }}
              >
                Reset All Filters
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {showPayment && selectedMaterial && (
          <PaymentGateway
            material={selectedMaterial}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}

        <section className="sm-action">
          <div className="sm-action-container">
            <div className="sm-action-content">
              <h2 className="sm-action-title">
                Ready to <span className="gradient-text">Excel</span>?
              </h2>
              <p className="sm-action-desc">
                Get unlimited access to all study materials with our premium
                plan
              </p>
              <button className="sm-action-btn">
                <span>Get Premium Access</span>
                <GraduationCap />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudyMaterials