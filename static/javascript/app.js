// Sample food data
const foodItems = [
  { name: "Wedding Platter", category: "Wedding Food", freshness: 6, distance: 3, description: "A platter of assorted meats and vegetables." },
  { name: "Bakery Cake", category: "Bakery Items", freshness: 12, distance: 1, description: "Freshly baked chocolate cake." },
  { name: "Leftover Pizza", category: "Leftover Food", freshness: 3, distance: 5, description: "Slices of pizza from last night's party." },
  { name: "Wedding Snacks", category: "Wedding Food", freshness: 2, distance: 7, description: "Finger foods like samosas and kebabs." },
  { name: "Croissants", category: "Bakery Items", freshness: 8, distance: 4, description: "Freshly baked buttery croissants." },
  { name: "Leftover Soup", category: "Leftover Food", freshness: 1, distance: 2, description: "Hot vegetable soup from a restaurant." }
];

// Function to display food items
function displayFood(items) {
  const foodList = document.getElementById("food-items");
  foodList.innerHTML = "";  // Clear previous list

  items.forEach(item => {
      const foodItem = document.createElement("li");
      foodItem.innerHTML = `
          <strong>${item.name}</strong> (${item.category})<br>
          Fresh for: ${item.freshness} hours | Distance: ${item.distance} km<br>
          <em>${item.description}</em>
      `;
      foodList.appendChild(foodItem);
  });
}

// Function to filter food items
function filterFood() {
  const freshnessFilter = document.getElementById("freshness-filter").value;
  const distanceFilter = document.getElementById("distance-filter").value;

  // Filter food based on freshness and distance
  const filteredFood = foodItems.filter(item => {
      const freshnessMatches = freshnessFilter === "all" || item.freshness <= freshnessFilter;
      const distanceMatches = !distanceFilter || item.distance <= distanceFilter;
      return freshnessMatches && distanceMatches;
  });

  displayFood(filteredFood);  // Display the filtered items
}

// Display all food on page load
window.onload = function() {
  displayFood(foodItems);
};
