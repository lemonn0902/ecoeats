function filterFood() {
  // Get the freshness filter value
  const freshness = document.getElementById('freshness-filter').value;
  const maxDistance = document.getElementById('distance-filter').value;

  // Apply the filter logic here based on the freshness and max distance
  // Example: Loop through the food items and show/hide based on the freshness
  const foodItems = document.querySelectorAll('.food-item');
  
  foodItems.forEach(item => {
      const freshnessText = item.querySelector('.food-freshness').textContent;
      const freshnessValue = parseInt(freshnessText.replace('Freshness: ', '').replace(' hours', ''));

      const distanceText = item.querySelector('.food-distance').textContent;
      const distanceValue = parseInt(distanceText.replace(' km', ''));

      // Apply filtering based on freshness and distance
      if ((freshness === 'all' || freshnessValue <= freshness) && (maxDistance === '' || distanceValue <= maxDistance)) {
          item.style.display = '';
      } else {
          item.style.display = 'none';
      }
  });
}
