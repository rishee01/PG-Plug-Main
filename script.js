// Enhanced JavaScript functionality
const locationInput = document.getElementById('locationInput');
const searchBar = document.getElementById('searchBar');
const searchBtn = document.getElementById('searchBtn');
const nearbyBtn = document.getElementById('nearbyBtn');
const academicYearSelect = document.getElementById('academicYear');
const monthSelect = document.getElementById('month');
const guestCountSelect = document.getElementById('guestCount');
const searchSections = document.querySelectorAll('.bar > div:not(.search-btn)');

// Modal elements
const messageModal = document.getElementById('messageModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Location dropdown functionality
const locationDropdown = document.getElementById('locationDropdown');
const locationOptions = document.querySelectorAll('.location-option');

// Location suggestions functionality
const suggestionsList = document.getElementById('suggestionsList');

// Predefined list of locations
const locations = [
    'Mumbai, Maharashtra, India',
    'Delhi, Delhi, India', 
    'Bangalore, Karnataka, India', 
    'Chennai, Tamil Nadu, India', 
    'Hyderabad, Telangana, India', 
    'Kolkata, West Bengal, India',
    'Pune, Maharashtra, India'
];

// Function to show custom message modal
function showMessageModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    messageModal.classList.add('visible');
}

// Function to hide custom message modal
function hideMessageModal() {
    messageModal.classList.remove('visible');
}

// Event listener for modal close button
modalCloseBtn.addEventListener('click', hideMessageModal);
// Event listener for clicking outside the modal content to close it
messageModal.addEventListener('click', (e) => {
    if (e.target === messageModal) {
        hideMessageModal();
    }
});

function deactivateAllSections() {
    searchSections.forEach(section => {
        section.classList.remove('active-section');
    });
    searchBar.classList.remove('active');
}

// Enhanced section interactions
searchSections.forEach(section => {
    const input = section.querySelector('input, select');

    if (input) {
        input.addEventListener('focus', () => {
            deactivateAllSections();
            section.classList.add('active-section');
            searchBar.classList.add('active');
        });

        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (!section.contains(document.activeElement)) {
                    section.classList.remove('active-section');
                    if (!Array.from(searchSections).some(s => s.classList.contains('active-section'))) {
                        searchBar.classList.remove('active');
                    }
                }
            }, 100);
        });
    }

    section.addEventListener('click', () => {
        deactivateAllSections();
        section.classList.add('active-section');
        searchBar.classList.add('active');

        if (input) input.focus();
    });
});

// Search button functionality
searchBtn.addEventListener('click', () => {
    const searchData = {
        location: locationInput.value.trim(),
        academicYear: academicYearSelect.value,
        month: monthSelect.value,
        guests: guestCountSelect.value
    };

    if (!searchData.location) {
        showMessageModal('Missing Information', 'Please enter a location to search.');
        return;
    }

    // Here you would typically make an API call or navigate to results page
    console.log('Search initiated with:', searchData);
    showMessageModal('Search Initiated', `Searching for ${searchData.guests} guest(s) in ${searchData.location} during ${searchData.month} of ${searchData.academicYear}`);
});

// Function to get address from coordinates using reverse geocoding
async function getAddressFromCoords(latitude, longitude) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
            {
                headers: {
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            }
        );
        const data = await response.json();
        
        // Get city and state names
        const city = data.address.city || 
                    data.address.town || 
                    data.address.suburb || 
                    data.address.county ||
                    'Unknown city';
        
        const state = data.address.state || 'Unknown state';
        
        // Clean up the location names to ensure they're in English
        const cleanCity = city.replace(/[^\x00-\x7F]/g, '').trim();
        const cleanState = state.replace(/[^\x00-\x7F]/g, '').trim();
        
        // Combine city and state
        return `${cleanCity}, ${cleanState}`;
    } catch (error) {
        console.error('Error getting location name:', error);
        return 'Unknown location';
    }
}

// Nearby button functionality
nearbyBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showMessageModal('Error', 'Geolocation is not supported by your browser');
        return;
    }

    showMessageModal('Locating...', 'Please wait while we get your location');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const locationName = await getAddressFromCoords(latitude, longitude);
                
                // Update the location input with the found location
                locationInput.value = locationName;
                
                // Activate the location section
                deactivateAllSections();
                document.querySelector('.location').classList.add('active-section');
                searchBar.classList.add('active');
                
                hideMessageModal();
                showMessageModal('Location Found', `Your location: ${locationName}`);
            } catch (error) {
                console.error('Error:', error);
                hideMessageModal();
                showMessageModal('Error', 'Could not determine your location. Please try again.');
            }
        },
        (error) => {
            hideMessageModal();
            let errorMessage = 'Could not get your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please allow location access and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
            }
            showMessageModal('Error', errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});

// Smooth animations on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Toggle dropdown visibility
locationInput.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    locationDropdown.classList.toggle('hidden');
});

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!locationInput.closest('.location').contains(e.target)) {
        locationDropdown.classList.add('hidden');
    }
});

// Handle location selection
locationOptions.forEach(option => {
    option.addEventListener('click', () => {
        const cityName = option.querySelector('p:first-child').textContent;
        const stateName = option.querySelector('p:last-child').textContent;
        locationInput.value = `${cityName}, ${stateName}`;
        locationDropdown.classList.add('hidden');
    });
});

// Filter locations based on input
locationInput.addEventListener('input', () => {
    const searchText = locationInput.value.toLowerCase();
    locationOptions.forEach(option => {
        const locationText = option.textContent.toLowerCase();
        if (locationText.includes(searchText)) {
            option.style.display = 'flex';
        } else {
            option.style.display = 'none';
        }
    });
    locationDropdown.style.display = 'block';
});

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Function to show suggestions
function showSuggestions(searchText) {
    // Clear previous suggestions
    suggestionsList.innerHTML = '';
    suggestionsList.classList.remove('hidden');

    // Filter locations based on input
    const filteredLocations = locations.filter(location => 
        location.toLowerCase().includes(searchText.toLowerCase())
    );

    // Create suggestion items
    filteredLocations.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location;
        li.addEventListener('click', () => {
            locationInput.value = location;
            suggestionsList.classList.add('hidden');
        });
        suggestionsList.appendChild(li);
    });

    // Hide suggestions if no results
    if (filteredLocations.length === 0) {
        suggestionsList.classList.add('hidden');
    }
}

// Event listener for input
locationInput.addEventListener('input', (e) => {
    const searchText = e.target.value;
    if (searchText.length > 0) {
        showSuggestions(searchText);
    } else {
        suggestionsList.classList.add('hidden');
    }
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!locationInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.classList.add('hidden');
    }
});
