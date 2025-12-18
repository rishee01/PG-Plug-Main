// Enhanced JavaScript functionality

// Modal elements
const messageModal = document.getElementById('messageModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Dropdown open on hover or click, close on mouseleave or click outside
let dropdownManuallyOpen = false;
const dropdownMenuLink = document.getElementById('dropdownMenuLink');
const dropdownMenu = document.querySelector('.dropdown-menu');
const profileContainer = dropdownMenuLink ? dropdownMenuLink.closest('.position-relative') : null;
let hoverTimeout;

// Handle dropdown menu items
const dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
            e.preventDefault();
            const text = this.textContent.trim();
            if (text.includes('Logout')) {
                alert('You have been successfully logged out.');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else if (text.includes('Help Centre')) {
                alert('Need assistance? Our dedicated support team is here to help you with any questions about bookings, accommodations, or general inquiries. Contact us anytime!');
            } else if (text.includes('About Us')) {
                alert('PGPlug is your trusted partner for finding the perfect student accommodation.');
            }
        }
        dropdownMenu.classList.remove('show');
    });
});

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

function showDropdown() {
    clearTimeout(hoverTimeout);
    dropdownMenu.classList.add('show');
    if (profileContainer) profileContainer.classList.add('active');
}
function hideDropdown() {
    if (!dropdownManuallyOpen) {
        hoverTimeout = setTimeout(() => {
            dropdownMenu.classList.remove('show');
            if (profileContainer) profileContainer.classList.remove('active');
        }, 80);
    }
}
if (profileContainer && dropdownMenu) {
    profileContainer.addEventListener('mouseenter', function() {
        if (!dropdownManuallyOpen) showDropdown();
    });
    profileContainer.addEventListener('mouseleave', function() {
        if (!dropdownManuallyOpen) hideDropdown();
    });
    dropdownMenu.addEventListener('mouseenter', function() {
        if (!dropdownManuallyOpen) showDropdown();
    });
    dropdownMenu.addEventListener('mouseleave', function() {
        if (!dropdownManuallyOpen) hideDropdown();
    });
    dropdownMenuLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (dropdownManuallyOpen) {
            dropdownManuallyOpen = false;
            dropdownMenu.classList.remove('show');
            if (profileContainer) profileContainer.classList.remove('active');
        } else {
            dropdownManuallyOpen = true;
            showDropdown();
        }
    });
    document.addEventListener('click', function(e) {
        if (!dropdownMenu.contains(e.target) && !profileContainer.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            if (profileContainer) profileContainer.classList.remove('active');
            dropdownManuallyOpen = false;
        }
    });
}
