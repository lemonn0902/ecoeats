function filterFood() {
    // Get the freshness filter value
    const freshness = document.getElementById('freshness-filter').value;
    const maxDistance = document.getElementById('distance-filter').value;
    const selectedCity = document.getElementById('city-filter').value.toLowerCase(); // Get selected city from dropdown

    // Set default values if no filter is selected
    const defaultFreshness = freshness === '' ? Infinity : freshness;  // If no freshness filter, assume no restriction
    const defaultMaxDistance = maxDistance === '' ? Infinity : maxDistance;  // If no max distance filter, assume no restriction
    const defaultCity = selectedCity === "" ? '' : selectedCity;  // If no city selected, show all cities

    // Apply the filter logic here based on the freshness, max distance, and selected city
    const foodItems = document.querySelectorAll('.food-item');

    foodItems.forEach(item => {
        // Extract freshness value from the item
        const freshnessText = item.querySelector('.food-freshness').textContent;
        const freshnessValue = parseInt(freshnessText.replace('Freshness: ', '').replace(' hours', ''));

        // Extract distance value from the item
        const distanceText = item.querySelector('.food-distance').textContent;
        const distanceValue = parseInt(distanceText.replace(' km', ''));

        // Extract city value from the data-city attribute
        const itemCity = item.getAttribute('data-city').toLowerCase(); // Ensure the value is compared in lowercase

        // Apply filtering logic based on the filters applied
        const matchesFreshness = freshness === '' || freshnessValue <= defaultFreshness; // Freshness filter
        const matchesDistance = maxDistance === '' || distanceValue <= defaultMaxDistance; // Distance filter
        const matchesCity = defaultCity === '' || itemCity === defaultCity; // City filter (allow all cities if none selected)

        // Show item if it matches all the selected filters (intersection of filters)
        if (matchesFreshness && matchesDistance && matchesCity) {
            item.style.display = '';  // Show item
        } else {
            item.style.display = 'none';  // Hide item
        }
    });
}
