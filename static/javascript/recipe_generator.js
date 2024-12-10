document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recipe-form');
  const resultDiv = document.getElementById('recipe-result');
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the user input from the text field
    const leftoverInput = document.getElementById('leftover').value.trim();

    if (!leftoverInput) {
      resultDiv.innerHTML = '<p>Please enter a leftover ingredient.</p>';
      return;
    }

    // Fetch the recipe based on the user input
    fetch('/find-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leftover: leftoverInput }),
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
        resultDiv.innerHTML = '<p>Failed to fetch the recipe. Please try again later.</p>';
      });
  });
});
