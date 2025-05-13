document.addEventListener('DOMContentLoaded', () => {
    const artistSelect = document.getElementById('favorite-artist');
    const categorySelect = document.getElementById('category');
    const saveButton = document.getElementById('save-settings');
    const saveMessage = document.getElementById('save-message');

    // Load saved settings from local storage when the page loads
    chrome.storage.local.get(['favoriteArtist', 'category'], (result) => {
        if (result.favoriteArtist) {
            artistSelect.value = result.favoriteArtist;
        }
        if (result.category) {
            categorySelect.value = result.category;
        }
    });

    // Save settings when the user clicks the "Save Settings" button
    saveButton.addEventListener('click', () => {
        const selectedArtist = artistSelect.value;
        const selectedCategory = categorySelect.value;

        // Input validation to ensure a real selection is made
        if (!selectedArtist || !selectedCategory) {
            alert('Please select both a favorite artist and a category.');
            return;
        }

        // Save the settings to Chrome local storage
        chrome.storage.local.set({
            favoriteArtist: selectedArtist,
            category: selectedCategory,
        }, () => {
            // Display save message
            saveMessage.style.display = 'block';
            setTimeout(() => {
                saveMessage.style.display = 'none';
            }, 3000);
        });
    });
});
  
  
  
  