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
  const dropDownBtn = document.querySelector('.nav-bar__other-links'); // Button that toggles hamburger menu
  const hamburgerMenu = document.querySelector('.nav-bar__hamburger'); // The dropdown menu container
  const navList = document.querySelectorAll('.nav-bar__hamburger-link'); // All navigation links inside hamburger menu

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
    hamburgerMenu.classList.toggle('nav-bar__hamburger--active'); // Toggle visibility of hamburger menu
    dropDownBtn.classList.toggle('nav-bar__nav-link--active'); // Toggle active state on button
  });

  // ========================================================================
  // Close Menu: Close hamburger menu when clicking outside of it
  // ========================================================================
  document.addEventListener('click', (e) => {
    // Only proceed if menu is currently open
    if (!hamburgerMenu.classList.contains('nav-bar__hamburger--active')) return;

    // Check if click is inside the hamburger menu
    const isClickInsideMenu = hamburgerMenu.contains(e.target);
    // Check if click is on the dropdown button (to prevent closing when toggling)
    const isClickOnButton = dropDownBtn.contains(e.target);

    // Close menu if click is outside both menu and button
    if (!isClickInsideMenu && !isClickOnButton) {
      hamburgerMenu.classList.remove('nav-bar__hamburger--active');
      dropDownBtn.classList.remove('nav-bar__nav-link--active');
    }
  });

  // ========================================================================
  // Close Menu: Close hamburger menu when clicking on navigation links
  // ========================================================================
  // This provides better UX - menu closes after user selects a link
  navList.forEach((link) => {
    link.addEventListener('click', () => {
      hamburgerMenu.classList.remove('nav-bar__hamburger--active');
      dropDownBtn.classList.remove('nav-bar__nav-link--active');
    });
  });

  // ========================================================================
  // Keyboard Accessibility: Close menu on Escape key press
  // ========================================================================
  document.addEventListener('keydown', (e) => {
    // Only close if menu is open and Escape key is pressed
    if (e.key === 'Escape' && hamburgerMenu.classList.contains('nav-bar__hamburger--active')) {
      hamburgerMenu.classList.remove('nav-bar__hamburger--active');
      dropDownBtn.classList.remove('nav-bar__nav-link--active');
    }
  });

  // ========================================================================
  // Section Tracker: Activates nav bar tabs when on it's section
  // ========================================================================
  // Skip the hero section and the CTA nav item (first/last) since they do not
  // participate in the scroll tracking UX.
  const sections = Array.from(document.querySelectorAll('section')).slice(1);
  const navLinks = Array.from(document.querySelectorAll('.nav-bar__nav-link')).slice(0, -1);
  // Build a map from section id -> nav item so the observer callback can look up
  // the matching tab in constant time without performing DOM queries.
  const navLinkMap = new Map();

  navLinks.forEach((link) => {
    const anchor = link.querySelector('a[href^="#"]');

    if (!anchor) return;

    const hash = anchor.getAttribute('href')?.trim();

    if (!hash || hash === '#') return;

    const sectionId = hash.slice(1);
    navLinkMap.set(sectionId, link);
  });

  const options = {
    root: null,
    rootMargin: "-70px 0px 0px 0px",
    threshold: 0.6
  };

  // Track whichever nav item currently carries the active class so we can
  // remove it immediately without iterating the entire list each time.
  let currentActiveNavItem =
    navLinks.find((link) => link.classList.contains('nav-bar__nav-link--active')) ?? null;

  const callBack = (entries, observer) => {
    entries.forEach((entry) => {
      // Each entry corresponds to one observed section; grab and sanitize its id.
      const id = entry.target.id?.trim();

      if (!id) {
        observer.unobserve(entry.target);
        console.warn('Section missing id, unobserving:', entry.target);
        return;
      }

      // Find the nav item associated with this section id (if any).
      const targetNavItem = navLinkMap.get(id);

      if (!targetNavItem) {
        observer.unobserve(entry.target);
        console.warn(`No navigation link found for section #${id}, unobserving`);
        return;
      }

      // When a section exits the viewport, remove the highlight so no tab stays
      // active while the user is between sections.
      if (!entry.isIntersecting) {
        if (currentActiveNavItem === targetNavItem) {
          currentActiveNavItem.classList.remove('nav-bar__nav-link--active');
          currentActiveNavItem = null;
        }
        return;
      }

      // If the current section is already highlighted, there is nothing to update.
      if (currentActiveNavItem === targetNavItem) return;

      // Switch the highlight to whichever section is now intersecting.
      currentActiveNavItem?.classList.remove('nav-bar__nav-link--active');
      targetNavItem.classList.add('nav-bar__nav-link--active');
      currentActiveNavItem = targetNavItem;
    });
  };

  const observer = new IntersectionObserver(callBack, options);

  sections.forEach((section) => {
    const sectionId = section.id?.trim();

    if (!sectionId || !navLinkMap.has(sectionId)) {
      console.warn(
        sectionId
          ? `Skipping observation for #${sectionId} because no nav link references it`
          : 'Skipping observation for section without an id',
      );
      return;
    }

    observer.observe(section);
  });
});