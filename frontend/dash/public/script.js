// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Update copyright year
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Navigation menu toggle for mobile
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  
  mobileMenu.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle the bars to make an X when active
    const bars = document.querySelectorAll('.bar');
    if (navMenu.classList.contains('active')) {
      bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  });
  
  // Close mobile menu when a nav link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      mobileMenu.classList.remove('active');
      
      // Reset hamburger icon
      const bars = document.querySelectorAll('.bar');
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    });
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Account for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    // Show/hide scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });
  
  // File upload handling
  const certificateFile = document.getElementById('certificate-file');
  const fileUpload = document.querySelector('.file-upload');
  
  if (certificateFile && fileUpload) {
    certificateFile.addEventListener('change', function() {
      if (this.files.length > 0) {
        const fileName = this.files[0].name;
        fileUpload.querySelector('p').textContent = fileName;
        fileUpload.style.borderColor = 'var(--primary-color)';
      }
    });
  }
  
  // FAQ accordion
  const accordionBtns = document.querySelectorAll('.accordion-btn');
  
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      
      if (this.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = 0;
      }
    });
  });
  
  // Handle certificate verification by ID
  const idVerifyBtn = document.getElementById('id-verify-btn');
  if (idVerifyBtn) {
    idVerifyBtn.addEventListener('click', function() {
      const inputField = document.querySelector('.hero-content .input-field');
      
      if (!inputField.value) {
        alert('Please enter a certificate ID');
        return;
      }
      
      // Simulate verification process
      simulateVerification(this);
    });
  }
  
  // Handle certificate verification by file
  const fileVerifyBtn = document.getElementById('file-verify-btn');
  if (fileVerifyBtn) {
    fileVerifyBtn.addEventListener('click', function() {
      const fileInput = document.getElementById('certificate-file');
      
      if (!fileInput || !fileInput.files.length) {
        alert('Please select a file');
        return;
      }
      
      // Simulate verification process
      simulateVerification(this);
    });
  }
  
  function simulateVerification(button) {
    const originalText = button.innerHTML;
    button.innerHTML = 'Verifying...';
    button.disabled = true;
    
    // Simulate network request
    setTimeout(function() {
      button.innerHTML = 'Verified ✓';
      button.style.backgroundColor = '#10b981'; // Success green
      
      // Show a success message
      setTimeout(function() {
        alert('Certificate verified successfully! Issued by: Stanford University, Date: June 15, 2023, Recipient: John Doe');
        
        // Reset button after showing message
        setTimeout(function() {
          button.innerHTML = originalText;
          button.style.backgroundColor = '';
          button.disabled = false;
        }, 1000);
      }, 500);
    }, 2000);
  }
  
  // Intersection Observer for animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with fade-in class
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => {
    observer.observe(el);
  });
});