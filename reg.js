// API Base URL
const API_URL = 'http://localhost:3000/api/auth';

function showSignup(e) {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

function showLogin(e) {
    e.preventDefault();
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function showForgotPassword(e) {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.remove('hidden');
}

// Login Form Handling
const loginForm = document.querySelector('#login-form form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        try {
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect based on role
                if (data.user.role === 'owner') {
                    // window.location.href = 'owner_dashboard.html'; // To be created
                    window.location.href = 'interface.html'; // Temporary
                } else if (data.user.role === 'admin') {
                    // window.location.href = 'admin.html'; // To be created
                    window.location.href = 'interface.html'; // Temporary
                } else {
                    window.location.href = 'interface.html';
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

function sendOTP() {
    const phone = document.getElementById('phoneNumber').value;
    const otpMsg = document.getElementById('otpMsg1');

    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
        otpMsg.textContent = 'Please enter a valid 10-digit Indian mobile number.';
        otpMsg.className = 'message error';
        return;
    }

    // Simulate OTP for now since backend doesn't support SMS yet
    otpMsg.textContent = 'Sending OTP...';
    otpMsg.className = 'message';

    setTimeout(() => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log('Generated OTP:', otp);

        // Store form data
        const signupForm = document.getElementById('signupStep1');
        const name = signupForm.querySelector('input[placeholder="Full Name"]').value;
        const email = signupForm.querySelector('input[placeholder="Email"]').value;
        const password = signupForm.querySelector('input[placeholder="Password"]').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

        sessionStorage.setItem('signupData', JSON.stringify({ name, email, password, phoneNumber }));
        sessionStorage.setItem('otp', otp);

        otpMsg.textContent = `OTP sent! (Simulated: ${otp})`;
        otpMsg.className = 'message success';

        document.getElementById('signupStep1').classList.add('hidden');
        document.getElementById('otpVerification').classList.remove('hidden');
    }, 1000);
}

document.getElementById('otpVerification').addEventListener('submit', function (e) {
    e.preventDefault();

    const enteredOtp = document.getElementById('otpInput').value;
    const storedOtp = sessionStorage.getItem('otp');
    const otpMsg2 = document.getElementById('otpMsg2');

    if (enteredOtp === storedOtp) {
        const signupData = JSON.parse(sessionStorage.getItem('signupData'));
        const { name, email, password, phoneNumber } = signupData;

        otpMsg2.textContent = 'Creating account...';
        otpMsg2.className = 'message';

        fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phoneNumber })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    otpMsg2.textContent = 'Account created successfully! You can now log in.';
                    otpMsg2.className = 'message success';
                    // Store token if returned (optional, usually require login after register)
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    setTimeout(showLogin, 1500);
                } else {
                    otpMsg2.textContent = data.message || 'Failed to create account.';
                    otpMsg2.className = 'message error';
                }
            })
            .catch((error) => {
                console.error('Registration error:', error);
                otpMsg2.textContent = 'Error creating account. Please try again.';
                otpMsg2.className = 'message error';
            });
    } else {
        otpMsg2.textContent = "Incorrect OTP. Try again.";
        otpMsg2.className = 'message error';
    }
});

function sendResetOTP() {
    const email = document.getElementById('forgotPasswordStep1').querySelector('input[type="email"]').value;
    const phone = document.getElementById('resetPhoneNumber').value;
    const otpMsg = document.getElementById('resetOtpMsg1');

    if (!email || !phone) {
        otpMsg.textContent = 'Please enter both email and phone number.';
        otpMsg.className = 'message error';
        return;
    }

    // Simulate OTP
    otpMsg.textContent = 'Sending OTP...';
    otpMsg.className = 'message';

    setTimeout(() => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated reset OTP:', otp);

        sessionStorage.setItem('resetOtp', otp);
        sessionStorage.setItem('resetEmail', email);

        otpMsg.textContent = `OTP sent! (Simulated: ${otp})`;
        otpMsg.className = 'message success';

        document.getElementById('forgotPasswordStep1').classList.add('hidden');
        document.getElementById('resetOtpVerification').classList.remove('hidden');
    }, 1000);
}

document.getElementById('resetOtpVerification').addEventListener('submit', function (e) {
    e.preventDefault();

    const enteredOtp = document.getElementById('resetOtpInput').value;
    const storedOtp = sessionStorage.getItem('resetOtp');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = sessionStorage.getItem('resetEmail');
    const otpMsg2 = document.getElementById('resetOtpMsg2');

    if (newPassword !== confirmPassword) {
        otpMsg2.textContent = 'Passwords do not match.';
        otpMsg2.className = 'message error';
        return;
    }

    if (enteredOtp === storedOtp) {
        otpMsg2.textContent = 'Resetting password...';
        otpMsg2.className = 'message';

        fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, newPassword })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    otpMsg2.textContent = 'Password reset successful! You can now login.';
                    otpMsg2.className = 'message success';
                    setTimeout(showLogin, 1500);
                } else {
                    otpMsg2.textContent = data.message || 'Failed to reset password.';
                    otpMsg2.className = 'message error';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                otpMsg2.textContent = 'Error resetting password. Please try again.';
                otpMsg2.className = 'message error';
            });
    } else {
        otpMsg2.textContent = 'Incorrect OTP. Try again.';
        otpMsg2.className = 'message error';
    }
});

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthText = document.getElementById('password-strength-text');
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;

    if (strengthBar) {
        let strengthPercentage = (strength / 5) * 100;
        strengthPercentage = Math.min(strengthPercentage, 100);
        strengthBar.style.width = strengthPercentage + '%';

        let color = '#ff4444';
        if (strength >= 3) color = '#ffbb33';
        if (strength >= 5) color = '#4caf50';
        strengthBar.style.backgroundColor = color;
    }

    if (strengthText) {
        let strengthLabel = 'Weak';
        if (strength >= 3) strengthLabel = 'Medium';
        if (strength >= 5) strengthLabel = 'Strong';
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strength >= 3 ? (strength >= 5 ? 'green' : 'orange') : 'red';
    }
}

function setupPasswordToggle(checkboxId, passwordFieldSelector) {
    const checkbox = document.getElementById(checkboxId);
    const passwordField = document.querySelector(passwordFieldSelector);

    if (checkbox && passwordField) {
        checkbox.addEventListener('change', function () {
            passwordField.type = this.checked ? 'text' : 'password';
        });
    }
}

// Call the function for both login and signup forms
setupPasswordToggle('showSignupPassword', '#signupStep1 input[type="password"]');
setupPasswordToggle('showLoginPassword', '#login-form input[type="password"]');

const signupFormElement = document.getElementById('signupStep1');
if (signupFormElement) {
    const passwordInput = signupFormElement.querySelector('input[type="password"]');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            updatePasswordStrength(passwordInput.value);
        });
    }
}

function loginWithGoogle() {
    alert('Google login coming soon!');
}




function sendOTP() {
    const phone = document.getElementById('phoneNumber').value;
    const otpMsg = document.getElementById('otpMsg1');

    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
        otpMsg.textContent = 'Please enter a valid 10-digit Indian mobile number.';
        otpMsg.className = 'message error';
        return;
    }

    // Show loading state
    otpMsg.textContent = 'Sending OTP...';
    otpMsg.className = 'message';

    // Log the request being made
    console.log('Sending OTP request to server...', { phoneNumber: phone });

    fetch('http://localhost:3000/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ phoneNumber: phone })
    })
        .then(response => {
            console.log('Server response status:', response.status);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No account found with this phone number. Please make sure you have registered first.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response data:', data);
            if (data.success) {
                // Store form data before hiding the form
                const signupForm = document.getElementById('signupStep1');
                const name = signupForm.querySelector('input[placeholder="Full Name"]').value;
                const email = signupForm.querySelector('input[placeholder="Email"]').value;
                const password = signupForm.querySelector('input[placeholder="Password"]').value;
                const phoneNumber = document.getElementById('phoneNumber').value;

                sessionStorage.setItem('signupData', JSON.stringify({ name, email, password, phoneNumber }));

                otpMsg.textContent = data.message + ' (Simulated OTP: ' + data.otp + ')';
                otpMsg.className = 'message success';
                sessionStorage.setItem('otp', data.otp);
                document.getElementById('signupStep1').classList.add('hidden');
                document.getElementById('otpVerification').classList.remove('hidden');
            } else {
                otpMsg.textContent = data.message || 'Failed to send OTP';
                otpMsg.className = 'message error';
            }
        })
        .catch((error) => {
            console.error('Error details:', error);
            if (error.message.includes('Failed to fetch')) {
                otpMsg.textContent = 'Cannot connect to server. Please make sure the server is running at http://localhost:3000';
            } else {
                otpMsg.textContent = 'Error sending OTP: ' + error.message;
            }
            otpMsg.className = 'message error';
        });
}

document.getElementById('otpVerification').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const enteredOtp = document.getElementById('otpInput').value;
    const storedOtp = sessionStorage.getItem('otp');
    const otpMsg2 = document.getElementById('otpMsg2');

    if (enteredOtp === storedOtp) {
        // Get registration data from sessionStorage
        const signupData = JSON.parse(sessionStorage.getItem('signupData'));
        const { name, email, password, phoneNumber } = signupData;

        otpMsg2.textContent = 'Creating account...';
        otpMsg2.className = 'message';

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phoneNumber })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    otpMsg2.textContent = 'Account created successfully! You can now log in.';
                    otpMsg2.className = 'message success';
                    setTimeout(showLogin, 1500);
                } else {
                    otpMsg2.textContent = data.message || 'Failed to create account.';
                    otpMsg2.className = 'message error';
                }
            })
            .catch((error) => {
                console.error('Registration error:', error);
                otpMsg2.textContent = 'Error creating account. Please try again.';
                otpMsg2.className = 'message error';
            });
    } else {
        otpMsg2.textContent = "Incorrect OTP. Try again.";
        otpMsg2.className = 'message error';
    }
});

function sendResetOTP() {
    const email = document.getElementById('forgotPasswordStep1').querySelector('input[type="email"]').value;
    const phone = document.getElementById('resetPhoneNumber').value;
    const otpMsg = document.getElementById('resetOtpMsg1');

    if (!email || !phone) {
        otpMsg.textContent = 'Please enter both email and phone number.';
        otpMsg.className = 'message error';
        return;
    }

    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
        otpMsg.textContent = 'Please enter a valid 10-digit Indian mobile number.';
        otpMsg.className = 'message error';
        return;
    }

    // Show loading state
    otpMsg.textContent = 'Sending OTP...';
    otpMsg.className = 'message';

    // Log the request being made
    console.log('Sending reset OTP request to server...', { email, phoneNumber: phone });

    fetch('http://localhost:3000/send-reset-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            phoneNumber: phone
        })
    })
        .then(response => {
            console.log('Server response status:', response.status);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No account found with this email and phone number. Please make sure you have registered first.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response data:', data);
            if (data.success) {
                otpMsg.textContent = data.message + ' (Simulated OTP: ' + data.otp + ')';
                otpMsg.className = 'message success';
                sessionStorage.setItem('resetOtp', data.otp);
                sessionStorage.setItem('resetEmail', email);
                document.getElementById('forgotPasswordStep1').classList.add('hidden');
                document.getElementById('resetOtpVerification').classList.remove('hidden');
            } else {
                otpMsg.textContent = data.message || 'Failed to send OTP';
                otpMsg.className = 'message error';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message.includes('Failed to fetch')) {
                otpMsg.textContent = 'Cannot connect to server. Please make sure the server is running at http://localhost:3000';
            } else {
                otpMsg.textContent = 'Error sending OTP: ' + error.message;
            }
            otpMsg.className = 'message error';
        });
}

document.getElementById('resetOtpVerification').addEventListener('submit', function (e) {
    e.preventDefault();

    const enteredOtp = document.getElementById('resetOtpInput').value;
    const storedOtp = sessionStorage.getItem('resetOtp');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = sessionStorage.getItem('resetEmail');
    const otpMsg2 = document.getElementById('resetOtpMsg2');

    if (newPassword !== confirmPassword) {
        otpMsg2.textContent = 'Passwords do not match.';
        otpMsg2.className = 'message error';
        return;
    }

    if (enteredOtp === storedOtp) {
        otpMsg2.textContent = 'Resetting password...';
        otpMsg2.className = 'message';

        fetch('http://localhost:3000/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, newPassword })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    otpMsg2.textContent = 'Password reset successful! You can now login.';
                    otpMsg2.className = 'message success';
                    setTimeout(showLogin, 1500);
                } else {
                    otpMsg2.textContent = data.message || 'Failed to reset password.';
                    otpMsg2.className = 'message error';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                otpMsg2.textContent = 'Error resetting password. Please try again.';
                otpMsg2.className = 'message error';
            });
    } else {
        otpMsg2.textContent = 'Incorrect OTP. Try again.';
        otpMsg2.className = 'message error';
    }
});

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthText = document.getElementById('password-strength-text');
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;

    let strengthPercentage = (strength / 5) * 100;
    strengthPercentage = Math.min(strengthPercentage, 100);

    strengthBar.style.width = strengthPercentage + '%';

    let color = '#ff4444';
    if (strength >= 3) color = '#ffbb33';
    if (strength >= 5) color = '#4caf50';

    strengthBar.style.backgroundColor = color;

    let strengthLabel = 'Weak';
    if (strength >= 3) strengthLabel = 'Medium';
    if (strength >= 5) strengthLabel = 'Strong';

    strengthText.textContent = strengthLabel;
}

function setupPasswordToggle(checkboxId, passwordFieldSelector) {
    const checkbox = document.getElementById(checkboxId);
    const passwordField = document.querySelector(passwordFieldSelector);

    checkbox.addEventListener('change', function () {
        passwordField.type = this.checked ? 'text' : 'password';
    });
}

// Call the function for both login and signup forms
setupPasswordToggle('showSignupPassword', '#signupStep1 input[type="password"]');
setupPasswordToggle('showLoginPassword', '#login-form input[type="password"]');


const signupForm = document.getElementById('signupStep1');
const passwordInput = signupForm.querySelector('input[type="password"]');

passwordInput.addEventListener('input', function () {
    updatePasswordStrength(passwordInput.value);
});

function loginWithGoogle() {
    alert('Google login coming soon!');
}

// Password strength feedback for signup
const signupPasswordInput = document.getElementById('signupPassword');
const passwordStrengthText = document.getElementById('password-strength-text');

if (signupPasswordInput && passwordStrengthText) {
    signupPasswordInput.addEventListener('input', function () {
        const value = signupPasswordInput.value;
        if (value.length === 0) {
            passwordStrengthText.textContent = '';
        } else if (value.length < 6 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
            passwordStrengthText.textContent = 'Weak';
            passwordStrengthText.style.color = 'red';
        } else {
            passwordStrengthText.textContent = 'Strong';
            passwordStrengthText.style.color = 'green';
        }
    });
}
