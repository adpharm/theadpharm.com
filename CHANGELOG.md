# Changelog

All notable changes to this project will be documented in this file.

## 2026-01-22

- feat: Added legal pages for Privacy Policy, Terms of Service, and Accessibility with functional footer navigation links enabling users to access important legal information
- feat: Enhanced hero section with functional "Discover More" button that smoothly scrolls to About section, improving user journey through the site
- feat: Added smooth scroll behavior globally for seamless navigation experience across all anchor links
- feat: Implemented mobile carousel for leadership team cards with swipe navigation, allowing single-card focus on smaller screens
- feat: Added leadership team headshot images with grayscale-to-color hover effect for professional presentation
- refactor: Improved mobile glow selection algorithm to highlight element closest to viewport center rather than highest intersection ratio, creating more intuitive mobile interactions
- refactor: Enhanced insights section with smooth height transitions when toggling between grid and stack views, preventing jarring layout shifts
- refactor: Added automatic scroll-to-section behavior when collapsing views in insights and client grids, keeping users oriented during navigation
- refactor: Improved responsive padding and sizing across all components for consistent mobile, tablet, and desktop experiences with optimized vertical spacing
- refactor: Enhanced modal scrollability and z-index management in insights section, ensuring proper layering and preventing scroll issues
- refactor: Optimized physician time chart with responsive sizing and mobile-friendly interactions, adapting radius and dimensions based on viewport
- refactor: Improved contact form layout by reordering elements for mobile flow and positioning social links at the bottom on small screens
- refactor: Updated chart color palette to align with brand identity, replacing generic colors with theme-specific values
- refactor: Replaced hero scroll indicator with animated arrow icon for clearer visual direction
- refactor: Enhanced insights modal rendering using portal-based architecture for improved layering and mobile responsiveness
- refactor: Standardized form inputs using design system components for consistent styling and accessibility
- fix: Corrected insights modal layout to properly display physician time chart in horizontal arrangement instead of stacked view

## 2026-01-21

- refactor: Centralized color management by replacing hardcoded hex values with CSS variables throughout the application for consistent theming and easier maintenance
- refactor: Reorganized component architecture by extracting inline components into dedicated files with proper folder structure (contact/, experience/, insights/, navigation/, services/)
- feat: Added intelligent mobile glow effect system that highlights one viewport-visible element at a time on touch devices, replacing hover interactions
- feat: Added grid view toggle for insights section allowing users to switch between stacked carousel and full grid layout
- feat: Added reusable GlowBorder component with support for custom clip paths and mobile-optimized glow effects
- feat: Added StyledButton component for consistent button styling across the application
- feat: Added functional contact form component with dedicated sections for contact info and social links
- feat: Added data visualization capability with recharts integration for displaying charts and metrics
- refactor: Enhanced leadership team cards with mobile-friendly LinkedIn buttons and improved responsive layout

## 2026-01-20

- feat: Added interactive carousel navigation to insights section with prev/next controls and card indicators
- feat: Added modal popup functionality for insights cards to display detailed information in an expanded view
- refactor: Simplified therapeutic areas display from expandable accordion to clean grid list for better readability
- refactor: Updated color scheme across About section from hardcoded hex values to Tailwind's orange-400 for consistency
- refactor: Reordered Experience section to prioritize client showcase before therapeutic areas
- feat: Added font-display utility class for Space Grotesk Variable font family
