import React from 'react';

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const icons = {
    All: "🌍",
    Beaches: "🏖️",
    "Religious Sites": "🕌",
    Heritage: "🏛️",
    Restaurants: "🍽️",
    Nature: "🌳",
    "Agricultural Areas": "🌾",
  };

  return (
    <div className="category-wrapper">
      <div className="category-title">
        <h2>Explore by Category</h2>
        <p>Find places based on your interests</p>
      </div>

      <div className="category-list">
        <button
          className={selectedCategory === "" ? "category-btn active" : "category-btn"}
          onClick={() => setSelectedCategory("")}
        >
          🌍 All Places
        </button>

        {/* பாதுகாப்பான map function (? சேர்க்கப்பட்டுள்ளது) */}
        {categories?.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "category-btn active" : "category-btn"}
            onClick={() => setSelectedCategory(category)}
          >
            {icons[category] || "📍"} {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;