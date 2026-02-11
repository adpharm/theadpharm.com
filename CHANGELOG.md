# Changelog

All notable changes to this project will be documented in this file.

## 2026-02-11

- feat: Converted website from single-page application to multi-page architecture with dedicated routes for About, Services, and Insights sections, enabling better SEO and shareable URLs for each section
- feat: Added scroll-to-top behavior on route changes to ensure users start at the top of each new page
- refactor: Redesigned hero section to display team photo integrated into background with gradient masking, creating more visual depth while maintaining focus on typography
- refactor: Simplified background grid from generated DOM elements to CSS gradient-based implementation for better performance and cleaner rendering
- refactor: Enhanced navigation system to support both direct page routing and hash-based section links, allowing users to navigate between pages or jump to specific sections on the homepage
- refactor: Increased navigation bar height from 16 to 20 for improved visual prominence and touch targets
- refactor: Removed hover-activated photo caption from leadership team section for cleaner mobile experience

## 2026-01-26

- feat: Enhanced SEO across all pages with comprehensive Open Graph and Twitter Card metadata for improved social media sharing and search visibility
- feat: Added smart navigation that allows users to jump directly to homepage sections from any page, not just when already on homepage
- refactor: Changed mobile leadership carousel to display 2 cards side-by-side instead of 1 for better space utilization on mobile devices
- refactor: Improved client grid mobile navigation by making entire clickable area interactive rather than just the button text
- refactor: Updated Insights section heading from "Our Philosophy" to "Intelligence that drives Engagement" and removed manifesto pull quote for cleaner messaging
- refactor: Removed standalone therapeutic areas section from Experience, streamlining content focus on client showcase
- refactor: Changed accessibility statement from claiming WCAG AAA to more accurate AA compliance level
- refactor: Updated Privacy Policy to accurately reflect that IP addresses are collected through analytics systems
- refactor: Enhanced insight cards with bottom gradient overlay for improved visual polish and readability
- docs: Added comprehensive React Router 7 metadata reference guide documenting meta function patterns and SEO best practices

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
