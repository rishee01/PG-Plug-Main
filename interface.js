// Header functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Bootstrap dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
    const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const welcomeText = document.querySelector('.welcome-text-right');

    if (user && user.name) {
        if (welcomeText) welcomeText.textContent = `Welcome ${user.name}`;
    } else {
        // Redirect to login if not logged in (optional, or show login button)
        // window.location.href = 'reg.html';
    }

    // Search functionality
    const searchButton = document.querySelector('.search-button');
    const locationInput = document.getElementById('location');
    const academicYearSelect = document.getElementById('academic-year');
    const monthsSelect = document.getElementById('months');
    const guestsSelect = document.getElementById('guests');

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            const filters = {
                city: locationInput.value,
                // Add other filters if API supports them
            };
            fetchProperties(filters);
        });
    }

    // Initial fetch
    fetchProperties();

    // Handle dropdown menu items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === 'Logout') {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'reg.html';
            } else if (!href || href === '#') {
                e.preventDefault();
            }
        });
    });

    // Logo click functionality
    const logo = document.querySelector('.logo-text');
    if (logo) {
        logo.addEventListener('click', function () {
            window.location.href = 'interface.html';
        });
    }
});

async function fetchProperties(filters = {}) {
    try {
        let url = '/api/properties';
        const params = new URLSearchParams();
        if (filters.city) params.append('city', filters.city);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            renderProperties(data.properties);
        } else {
            console.error('Failed to fetch properties:', data.message);
        }
    } catch (error) {
        console.error('Error fetching properties:', error);
    }
}

function renderProperties(properties) {
    const mainContent = document.querySelector('.main-content');
    // Clear existing content but keep the wave/background elements if they are outside the list
    // The HTML structure has .red-card directly in .main-content.
    // I need to remove existing .red-card elements or clear .main-content carefully.

    // Let's select all .red-card and remove them
    const existingCards = mainContent.querySelectorAll('.red-card');
    existingCards.forEach(card => card.remove());

    if (properties.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'text-center mt-5';
        noResults.innerHTML = '<h3>No properties found matching your criteria.</h3>';
        mainContent.appendChild(noResults);
        return;
    }

    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'red-card animate-fade-in';

        const imageUrl = property.images && property.images.length > 0
            ? `/uploads/${property.images[0]}`
            : 'https://via.placeholder.com/300x200?text=No+Image';

        card.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 32px; height: 100%;">
            <div style="width: 300px; height: 200px; overflow: hidden; border-radius: 8px;">
                <img src="${imageUrl}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="width: 100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
              <h3 style="margin-bottom: 8px; font-weight: bold;">${property.title}</h3>
              <p style="margin-bottom: 8px; color: #666;">${property.address}, ${property.city}, ${property.state}</p>
              <div style="margin-bottom: 16px; color: #f39c12;">
                <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="far fa-star"></i>
                <span style="color: #666; margin-left: 5px;">(4.0)</span>
              </div>
              <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                ${property.amenities.slice(0, 3).map(amenity =>
            `<span class="badge bg-light text-dark border">${amenity}</span>`
        ).join('')}
              </div>
              <div style="display: flex; align-items: flex-end; width: 100%; justify-content: space-between; margin-top: auto;">
                <div>
                    <span style="font-size: 24px; font-weight: bold;">₹${property.price}</span>
                    <span style="color: #666;">/month</span>
                </div>
                <div style="display: flex; align-items: flex-end;">
                  <button class="btn btn-outline-dark" onclick="viewDetails(${property.id})">View Details</button>
                  <button class="btn btn-success" style="margin-left: 18px;" onclick="bookNow(${property.id})">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        `;
        mainContent.appendChild(card);
    });
}

function viewDetails(id) {
    window.location.href = `details.html?id=${id}`;
}

function bookNow(id) {
    // Implement booking logic or redirect to booking page
    // For now, just alert
    alert(`Booking feature for property ${id} coming soon!`);
}

