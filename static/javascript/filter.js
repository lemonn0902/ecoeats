function filterFood() {
  // Get the freshness and distance filter values
  const freshnessFilter = document.getElementById('freshness-filter').value;
  const distanceFilter = document.getElementById('distance-filter').value;

  // Get all the food items in the list
  const foodItems = document.querySelectorAll('#food-items .food-item');

  // Loop through each food item
  foodItems.forEach(item => {
      // Get the freshness and distance of the current food item
      const freshness = item.querySelector('.food-freshness').textContent.split(":")[1].trim(); // Extract the number
      const distance = item.querySelector('.food-distance').textContent.split(" ")[0]; // Extract the number

      // Convert freshness and distance to integers for comparison
      const freshnessNumber = parseInt(freshness);
      const distanceNumber = parseInt(distance);

      // Determine whether the item should be displayed
      let displayItem = true;

      // Check the freshness filter
      if (freshnessFilter !== "all" && freshnessNumber > parseInt(freshnessFilter)) {
          displayItem = false;
      }

      // Check the distance filter
      if (distanceFilter && distanceNumber > parseInt(distanceFilter)) {
          displayItem = false;
      }

      // Show or hide the item based on the filter conditions
      item.style.display = displayItem ? 'block' : 'none';
  });
}
