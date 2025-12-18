document.getElementById('addPropertyForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first');
        window.location.href = 'reg.html';
        return;
    }

    const formData = new FormData(this);
    // Convert amenities string to array
    const amenities = formData.get('amenities').split(',').map(item => item.trim());
    formData.set('amenities', JSON.stringify(amenities));

    try {
        const response = await fetch('/api/properties', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Property listed successfully!');
            window.location.href = 'interface.html';
        } else {
            alert(data.message || 'Failed to list property');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});
