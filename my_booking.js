document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'reg.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const welcomeText = document.querySelector('.welcome-text-right');
    if (welcomeText && user.name) {
        welcomeText.textContent = `Welcome ${user.name}`;
    }

    // Tab switching logic
    const tabs = document.querySelectorAll('.nav-link');
    const cards = document.querySelectorAll('.booking-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Filter cards
            const status = this.textContent.toLowerCase().replace(' ', '-'); // at-home, completed, upcoming
            filterBookings(status);
        });
    });

    fetchBookings();
});

async function fetchBookings() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/bookings/my', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.success) {
            renderBookings(data.bookings);
        } else {
            console.error('Failed to fetch bookings:', data.message);
        }
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}

function renderBookings(bookings) {
    const container = document.querySelector('.booking-cards-container');
    container.innerHTML = ''; // Clear existing static/skeleton cards

    if (bookings.length === 0) {
        container.innerHTML = '<div class="text-center mt-5"><h3>No bookings found.</h3></div>';
        return;
    }

    bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        // Determine status class and text based on booking status or dates
        let statusClass = 'status-confirmed';
        let statusText = booking.status || 'Confirmed';

        if (booking.status === 'cancelled') {
            statusClass = 'status-cancelled';
            statusText = 'Cancelled';
        } else if (new Date(booking.end_date) < new Date()) {
            statusClass = 'status-completed';
            statusText = 'Completed';
        }

        // Add data-tab attribute for filtering
        let tabCategory = 'upcoming';
        if (statusText === 'Completed') tabCategory = 'completed';
        else if (statusText === 'Confirmed' && new Date(booking.start_date) <= new Date()) tabCategory = 'at-home';

        card.setAttribute('data-tab', tabCategory);

        card.innerHTML = `
            <span class="status-badge ${statusClass}">${statusText}</span>
            <div class="booking-card-header">
                <h3>${booking.property_title}</h3>
            </div>
            <div class="booking-card-body">
                <div class="address-line"><strong>Address:</strong> ${booking.property_address}, ${booking.property_city}</div>
                <div class="info-line"><strong>Booking ID:</strong> #${booking.id}</div>
                <div class="info-line"><strong>From:</strong> ${new Date(booking.start_date).toLocaleDateString()} To ${new Date(booking.end_date).toLocaleDateString()}</div>
                <div class="info-line"><strong>Rent:</strong> ₹${booking.total_price}</div>
            </div>
            <div class="booking-card-footer">
                <button class="btn btn-outline-primary"><i class="fas fa-phone-alt"></i> Contact PG</button>
                ${statusText !== 'Cancelled' && statusText !== 'Completed' ?
                `<button class="btn btn-outline-danger" onclick="cancelBooking(${booking.id})"><i class="fas fa-times-circle"></i> Cancel</button>` : ''}
            </div>
        `;
        container.appendChild(card);
    });

    // Trigger initial filter based on active tab
    const activeTab = document.querySelector('.nav-link.active');
    if (activeTab) {
        const status = activeTab.textContent.toLowerCase().replace(' ', '-');
        filterBookings(status);
    }
}

function filterBookings(category) {
    const cards = document.querySelectorAll('.booking-card');
    cards.forEach(card => {
        if (category === 'at-home' && card.getAttribute('data-tab') === 'at-home') {
            card.style.display = 'block';
        } else if (category === 'completed' && card.getAttribute('data-tab') === 'completed') {
            card.style.display = 'block';
        } else if (category === 'upcoming' && card.getAttribute('data-tab') === 'upcoming') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function cancelBooking(id) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        // Call API to cancel
        alert('Cancellation logic to be implemented');
    }
}
