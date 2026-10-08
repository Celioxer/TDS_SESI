document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-links a');
    const tabSections = document.querySelectorAll('.tab-section');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Handle Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Handle Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get target string
            const targetId = tab.getAttribute('data-tab');

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }

            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            tabSections.forEach(section => section.classList.remove('active'));

            // Add active classes
            tab.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.classList.add('active');
            }

            // Smooth scroll to top of main content (for longer pages)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});
