// ============================================================================
// Main JavaScript Entry Point
// ============================================================================

// Import CSS reset and normalize styles
import 'modern-normalize/modern-normalize.css';
// Import Font Awesome icons
import '@fortawesome/fontawesome-free/css/all.min.css';
// Import main SCSS styles
import '../scss/main.scss';

// Wait for DOM to be fully loaded before executing navigation logic
document.addEventListener('DOMContentLoaded', () => {
  // Get references to navigation elements
  const dropDownBtn = document.querySelector('.other-links'); // Button that toggles hamburger menu
  const hamburgerMenu = document.querySelector('.hamburger'); // The dropdown menu container
  const navList = document.querySelectorAll('.nav-links'); // All navigation links inside hamburger menu

  // Check if elements exist before adding event listeners
  // Prevents errors if elements are missing from DOM
  if (!dropDownBtn || !hamburgerMenu) {
    console.warn('Navigation elements not found');
    return;
  }

  // ========================================================================
  // Toggle Menu: Open/Close hamburger menu on button click
  // ========================================================================
  dropDownBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior (prevents page jump to #)
    hamburgerMenu.classList.toggle('active'); // Toggle visibility of hamburger menu
    dropDownBtn.classList.toggle('active'); // Toggle active state on button
  });

  // ========================================================================
  // Close Menu: Close hamburger menu when clicking outside of it
  // ========================================================================
  document.addEventListener('click', (e) => {
    // Only proceed if menu is currently open
    if (!hamburgerMenu.classList.contains('active')) return;

    // Check if click is inside the hamburger menu
    const isClickInsideMenu = hamburgerMenu.contains(e.target);
    // Check if click is on the dropdown button (to prevent closing when toggling)
    const isClickOnButton = dropDownBtn.contains(e.target);

    // Close menu if click is outside both menu and button
    if (!isClickInsideMenu && !isClickOnButton) {
      hamburgerMenu.classList.remove('active');
      dropDownBtn.classList.remove('active');
    }
  });

  // ========================================================================
  // Close Menu: Close hamburger menu when clicking on navigation links
  // ========================================================================
  // This provides better UX - menu closes after user selects a link
  navList.forEach((link) => {
    link.addEventListener('click', () => {
      hamburgerMenu.classList.remove('active');
      dropDownBtn.classList.remove('active');
    });
  });

  // ========================================================================
  // Keyboard Accessibility: Close menu on Escape key press
  // ========================================================================
  document.addEventListener('keydown', (e) => {
    // Only close if menu is open and Escape key is pressed
    if (e.key === 'Escape' && hamburgerMenu.classList.contains('active')) {
      hamburgerMenu.classList.remove('active');
      dropDownBtn.classList.remove('active');
    }
  });
});