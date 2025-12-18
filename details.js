function nextStep(currentStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + (currentStep + 1)).classList.add('active');
    updateProgressBar(currentStep + 1);
    
    if (currentStep === 3) {
        displayReview();
    }
}

function prevStep(currentStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + (currentStep - 1)).classList.add('active');
    updateProgressBar(currentStep - 1);
}

function updateProgressBar(step) {
    const progress = (step / 4) * 100;
    document.querySelector('.progress-bar').style.width = progress + '%';
}

function displayReview() {
    const reviewContent = document.getElementById('reviewContent');
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        occupation: document.getElementById('occupation').value,
        company: document.getElementById('company').value,
        notes: document.getElementById('notes').value
    };

    let reviewHTML = '<ul class="list-unstyled">';
    for (const [key, value] of Object.entries(formData)) {
        if (value) {
            reviewHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        }
    }
    reviewHTML += '</ul>';
    reviewContent.innerHTML = reviewHTML;
}

function submitForm() {
    // Here you would typically send the data to your server
    alert('Form submitted successfully!');
    // Reset form or redirect as needed
}

document.addEventListener('DOMContentLoaded', function() {
    const editIcon = document.querySelector('.edit-icon');
    const fullNameInput = document.getElementById('fullName');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');

    const fullNameDisplay = document.getElementById('fullNameDisplay');
    const phoneNumberDisplay = document.getElementById('phoneNumberDisplay');
    const emailDisplay = document.getElementById('emailDisplay');

    const editButtons = document.querySelector('.edit-buttons');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Store original values for cancel functionality
    let originalValues = {};

    // Function to enable editing mode
    function enableEditMode() {
        originalValues = {
            fullName: fullNameDisplay.textContent,
            phoneNumber: phoneNumberDisplay.textContent,
            email: emailDisplay.textContent
        };

        // Set input values. If the current display text is the placeholder, clear the input value.
        // Also, explicitly set the placeholder to '----------' to ensure it's visible if value is empty.
        fullNameInput.value = (fullNameDisplay.textContent.trim() === '----------') ? '' : fullNameDisplay.textContent.trim();
        fullNameInput.placeholder = '----------';

        phoneNumberInput.value = (phoneNumberDisplay.textContent.trim() === '----------') ? '' : phoneNumberDisplay.textContent.trim();
        phoneNumberInput.placeholder = '----------';

        emailInput.value = (emailDisplay.textContent.trim() === '----------') ? '' : emailDisplay.textContent.trim();
        emailInput.placeholder = '----------';

        fullNameInput.style.display = 'block';
        phoneNumberInput.style.display = 'block';
        emailInput.style.display = 'block';

        fullNameDisplay.style.display = 'none';
        phoneNumberDisplay.style.display = 'none';
        emailDisplay.style.display = 'none';
        
        fullNameInput.removeAttribute('readonly');
        phoneNumberInput.removeAttribute('readonly');
        emailInput.removeAttribute('readonly');

        editButtons.style.display = 'flex';
        editIcon.style.display = 'none';
    }

    // Function to disable editing mode
    function disableEditMode(saveChanges = false) {
        if (saveChanges) {
            // If input is empty after editing, save '----------' to display
            fullNameDisplay.textContent = fullNameInput.value.trim() === '' ? '----------' : fullNameInput.value.trim();
            phoneNumberDisplay.textContent = phoneNumberInput.value.trim() === '' ? '----------' : phoneNumberInput.value.trim();
            emailDisplay.textContent = emailInput.value.trim() === '' ? '----------' : emailInput.value.trim();
        } else {
            // Revert to original values on cancel
            fullNameDisplay.textContent = originalValues.fullName;
            phoneNumberDisplay.textContent = originalValues.phoneNumber;
            emailDisplay.textContent = originalValues.email;
        }

        fullNameInput.style.display = 'none';
        phoneNumberInput.style.display = 'none';
        emailInput.style.display = 'none';

        fullNameDisplay.style.display = 'block';
        phoneNumberDisplay.style.display = 'block';
        emailDisplay.style.display = 'block';

        fullNameInput.setAttribute('readonly', true);
        phoneNumberInput.setAttribute('readonly', true);
        emailInput.setAttribute('readonly', true);

        editButtons.style.display = 'none';
        editIcon.style.display = 'block';
    }

    // Event listeners
    editIcon.addEventListener('click', enableEditMode);

    saveBtn.addEventListener('click', function() {
        disableEditMode(true); // Pass true to save changes
    });

    cancelBtn.addEventListener('click', function() {
        disableEditMode(false); // Pass false to discard changes
    });

    // Create file input element once
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/jpg';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Function to handle image selection from gallery
    function handleGallerySelection() {
        // Reset the file input value to ensure the change event fires even if the same file is selected
        fileInput.value = '';
        // Trigger file selection
        fileInput.click();
    }

    // Handle file selection
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // Check if file is JPEG
            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Update main profile logo
                    const profileLogo = document.querySelector('.profile-logo');
                    const mainImg = document.createElement('img');
                    mainImg.src = e.target.result;
                    mainImg.style.width = '100%';
                    mainImg.style.height = '100%';
                    mainImg.style.borderRadius = '50%';
                    mainImg.style.objectFit = 'cover';
                    profileLogo.innerHTML = '';
                    profileLogo.appendChild(mainImg);

                    // Update header profile icon
                    const headerProfileContainer = document.querySelector('.logo-and-text-gap');
                    const headerImg = document.createElement('img');
                    headerImg.src = e.target.result;
                    headerImg.style.width = '100%';
                    headerImg.style.height = '100%';
                    headerImg.style.objectFit = 'cover';
                    headerProfileContainer.innerHTML = '';
                    headerProfileContainer.appendChild(headerImg);
                    
                    // Close the modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('photoModal'));
                    modal.hide();
                };
                
                reader.readAsDataURL(file);
            } else {
                // Show error message for non-JPEG files
                alert('Please select a JPEG image file.');
            }
        }
    });

    // Add event listener when the document is loaded
    const galleryButton = document.querySelector('.btn-outline-primary:first-of-type');
    
    // Add click event listener
    galleryButton.addEventListener('click', handleGallerySelection);

    // Handle avatar selection
    const avatarOptions = document.querySelectorAll('.avatar-option');
    
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Get the avatar image source
            const avatarSrc = this.querySelector('img').src;
            
            // Update main profile logo
            const profileLogo = document.querySelector('.profile-logo');
            const mainImg = document.createElement('img');
            mainImg.src = avatarSrc;
            mainImg.style.width = '100%';
            mainImg.style.height = '100%';
            mainImg.style.borderRadius = '50%';
            mainImg.style.objectFit = 'cover';
            profileLogo.innerHTML = '';
            profileLogo.appendChild(mainImg);

            // Update header profile icon
            const headerProfileContainer = document.querySelector('.logo-and-text-gap');
            const headerImg = document.createElement('img');
            headerImg.src = avatarSrc;
            headerImg.style.width = '100%';
            headerImg.style.height = '100%';
            headerImg.style.objectFit = 'cover';
            headerProfileContainer.innerHTML = '';
            headerProfileContainer.appendChild(headerImg);
            
            // Close both modals
            const avatarModal = bootstrap.Modal.getInstance(document.getElementById('avatarModal'));
            const photoModal = bootstrap.Modal.getInstance(document.getElementById('photoModal'));
            avatarModal.hide();
            photoModal.hide();
        });
    });
}); 