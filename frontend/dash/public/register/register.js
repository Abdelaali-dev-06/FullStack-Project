document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const schoolName = document.getElementById('schoolName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const verifyPassword = document.getElementById('verifyPassword').value;

  if (password !== verifyPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        school_name: schoolName,
        email: email,
        password: password
      })
    });
    const data = await response.json();
    if (response.ok && data.school_id) {
      alert('Registration was successful! Click OK to go to login.');
      window.location.href = '../login/login.html';
    } else if (data.message && data.message.toLowerCase().includes('exists')) {
      alert('Email already exists. Please login instead.');
    } else {
      alert('Something went wrong.');
    }
  } catch (error) {
    alert('Something went wrong.');
  }
}); 