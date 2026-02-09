// Load templates from JSON file
let templates = [];

// Helper function to get badge class based on category
function getCategoryBadgeClass(category) {
    const categoryLower = category.toLowerCase();
    return `badge-${categoryLower}`;
}

// Wait for DOM to be ready and templates to load
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const allTemplatesContainer = document.getElementById('allTemplates');
    const sortSelect = document.getElementById('sortSelect');

    // Fetch templates from JSON
    fetch('template.JSON')
        .then(response => response.json())
        .then(data => {
            templates = data.templates;
            displayAllTemplates();
        })
        .catch(error => {
            console.error('Error loading templates:', error);
            allTemplatesContainer.innerHTML = '<p class="text-danger">Error loading templates. Please refresh the page.</p>';
        });

    function displaySearchResults(results) {
        if (results.length === 0 && searchInput.value.length > 0) {
            searchResults.innerHTML = `
                <div class="search-result-item no-results">
                    <p class="text-muted">No templates found</p>
                </div>
            `;
            return;
        }

        if (results.length === 0) {
            searchResults.innerHTML = '';
            return;
        }

        searchResults.innerHTML = results.map((template, index) => `
            <div class="search-result-item" data-template-id="${template.id}" style="animation: fadeInUp 0.4s ease-out ${index * 0.1}s both;">
                <h6>${template.title}</h6>
                <p>${template.description}</p>
                <span class="badge ${getCategoryBadgeClass(template.category)}">${template.category}</span>
            </div>
        `).join('');
    }

    // Display all templates on page load or with category filter
    function displayAllTemplates(filterCategory = '') {
        let templatesToDisplay = templates;
        
        // Filter by category if selected
        if (filterCategory) {
            templatesToDisplay = templates.filter(template => 
                template.category.toLowerCase() === filterCategory.toLowerCase()
            );
        }
        
        if (templatesToDisplay.length === 0) {
            allTemplatesContainer.innerHTML = '<p class="text-center text-muted fs-5">No templates found in this category.</p>';
            return;
        }
        
        allTemplatesContainer.innerHTML = templatesToDisplay.map((template, index) => `
            <div class="template-card" data-template-id="${template.id}" style="animation: fadeInUp 0.4s ease-out ${index * 0.05}s both;">
                <div class="template-card-body">
                    <h5 class="template-card-title">${template.title}</h5>
                    <p class="template-card-description">${template.description}</p>
                    <span class="badge ${getCategoryBadgeClass(template.category)}">${template.category}</span>
                </div>
            </div>
        `).join('');
    }

    // Sort dropdown event listener
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            displayAllTemplates(selectedCategory);
        });
    }

    // Search event listener with character-by-character filtering
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter templates that contain ANY of the characters typed
        let results = templates.filter(template => {
            const titleLower = template.title.toLowerCase();
            const descLower = template.description.toLowerCase();
            const categoryLower = template.category.toLowerCase();
            const combined = titleLower + ' ' + descLower + ' ' + categoryLower;
            
            // Check if all characters in searchTerm appear in the template
            return searchTerm === '' || searchTerm.split('').some(char => combined.includes(char));
        });

        // Sort results to prioritize templates that start with the search term
        if (searchTerm.length > 0) {
            results.sort((a, b) => {
                const aStartsWith = a.title.toLowerCase().startsWith(searchTerm);
                const bStartsWith = b.title.toLowerCase().startsWith(searchTerm);
                
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return 0;
            });
        }

        displaySearchResults(results);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== searchInput && !e.target.closest('.search-results')) {
            searchResults.innerHTML = '';
        }
    });

    // Show results on focus
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length > 0) {
            const searchTerm = searchInput.value.toLowerCase();
            let results = templates.filter(template => {
                const titleLower = template.title.toLowerCase();
                const descLower = template.description.toLowerCase();
                const categoryLower = template.category.toLowerCase();
                const combined = titleLower + ' ' + descLower + ' ' + categoryLower;
                return searchTerm.split('').some(char => combined.includes(char));
            });
            
            // Sort results to prioritize templates that start with the search term
            results.sort((a, b) => {
                const aStartsWith = a.title.toLowerCase().startsWith(searchTerm);
                const bStartsWith = b.title.toLowerCase().startsWith(searchTerm);
                
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return 0;
            });
            
            displaySearchResults(results);
        }
    });

    // Handle clicking on search results and template cards
    document.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        const templateCard = e.target.closest('.template-card');
        
        let templateId = null;
        
        if (resultItem && resultItem.dataset.templateId) {
            templateId = parseInt(resultItem.dataset.templateId);
        } else if (templateCard && templateCard.dataset.templateId) {
            templateId = parseInt(templateCard.dataset.templateId);
        }
        
        if (templateId) {
            const selectedTemplate = templates.find(template => template.id === templateId);
            
            if (selectedTemplate) {
                // Store the selected template in localStorage to pass to the detail page
                localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
                // Navigate to the template detail page
                window.location.href = 'template-detail.html';
            }
        }
    });
});

