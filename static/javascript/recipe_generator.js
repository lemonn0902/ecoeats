document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recipe-form');
  const leftoverSelect = document.getElementById('leftover');
  const resultDiv = document.getElementById('recipe-result');

  // Fetch options for the dropdown
  fetch('/get-recipes')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      // Populate the dropdown with unique leftovers
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.leftover; // Ensure the key matches your backend's response
        option.textContent = item.leftover;
        leftoverSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading recipes:', error);
      alert('Failed to load the recipe data. Please try again later.');
    });

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedLeftover = leftoverSelect.value;

    fetch('/find-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leftover: selectedLeftover }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          resultDiv.innerHTML = `<p>${data.error}</p>`;
        } else {
          resultDiv.innerHTML = `<p><strong>Recipe:</strong> ${data.recipe}</p>`;
        }
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
        resultDiv.innerHTML = `<p>Failed to fetch the recipe. Please try again later.</p>`;
      });
  });
});
