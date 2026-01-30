// Sample templates data
const templates = [
    {
        id: 1,
        title: "Parent-Teacher Meeting Request",
        category: "meeting",
        description: "Request a meeting to discuss your child's progress."
    },
    {
        id: 2,
        title: "Academic Concern",
        category: "academic",
        description: "Address academic concerns or request additional support."
    },
    {
        id: 3,
        title: "Positive Feedback",
        category: "feedback",
        description: "Share appreciation for a teacher's efforts."
    },
    {
        id: 4,
        title: "Absence Excuse",
        category: "attendance",
        description: "Formally excuse your child from school."
    },
    {
        id: 5,
        title: "Grade Inquiry",
        category: "academic",
        description: "Politely inquire about grades or feedback."
    },
    {
        id: 6,
        title: "Extracurricular Interest",
        category: "activities",
        description: "Express interest in clubs or activities."
    }
];

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

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
            <span class="badge bg-primary">${template.category}</span>
        </div>
    `).join('');
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

// Handle clicking on search results
document.addEventListener('click', (e) => {
    const resultItem = e.target.closest('.search-result-item');
    if (resultItem && resultItem.dataset.templateId) {
        const templateId = parseInt(resultItem.dataset.templateId);
        const selectedTemplate = templates.find(template => template.id === templateId);
        
        if (selectedTemplate) {
            // Store the selected template in localStorage to pass to the detail page
            localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
            // Navigate to the template detail page
            window.location.href = 'template-detail.html';
        }
    }
});