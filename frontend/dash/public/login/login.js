document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    const data = await response.json();
    console.log('Login response:', data); // Debug log

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('school_id', data.school_id);
      
      // Debug logs
      console.log('Stored token:', localStorage.getItem('token'));
      console.log('Stored school_id:', localStorage.getItem('school_id'));
      
      alert('Login successful! Redirecting to dashboard...');
      window.location.href = 'http://localhost:3000/dash'; // Redirect to React dashboard
    } else if (data.message) {
      alert(data.message);
    } else {
      alert('Something went wrong.');
    }
  } catch (error) {
    console.error('Login error:', error); // Debug log
    alert('Something went wrong.');
  }
}); 