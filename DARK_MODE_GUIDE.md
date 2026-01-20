# Dark Mode Implementation Guide

## Overview
The application now has full dark mode support with smooth transitions between light and dark themes.

## How It Works

### 1. Theme Provider
- Located in `src/contexts/ThemeContext.tsx`
- Manages global theme state (light/dark)
- Persists preference in localStorage
- Respects system preference on first load
- Applies `dark` class to `<html>` element

### 2. Theme Toggle
- Component in `src/components/ThemeToggle.tsx`
- Animated switch with sun/moon icons
- Located in the header of AdvisorDashboard
- Keyboard accessible with proper ARIA labels

### 3. Tailwind Configuration
- Dark mode enabled with `darkMode: 'class'` in `tailwind.config.js`
- All colors use the pattern: `text-gray-900 dark:text-white`
- Background colors: `bg-white dark:bg-gray-800`
- Borders: `border-gray-200 dark:border-white/10`

## Usage in Components

### Text Colors
```tsx
// Headings
className="text-gray-900 dark:text-white"

// Body text
className="text-gray-600 dark:text-gray-400"

// Subtle text
className="text-gray-500 dark:text-slate-300/80"
```

### Backgrounds
```tsx
// Cards
className="bg-white dark:bg-gray-800"

// Page backgrounds
className="bg-gray-50 dark:bg-gray-950"

// Overlays
className="bg-white/80 dark:bg-gray-900/50"
```

### Borders
```tsx
// Standard borders
className="border-gray-200 dark:border-gray-700"

// Subtle borders
className="border-gray-100 dark:border-white/10"
```

### Buttons
```tsx
// Primary button (see index.css)
className="btn-primary" // Auto handles dark mode

// Secondary button
className="btn-secondary" // Auto handles dark mode
```

## Testing Dark Mode

1. **Manual Toggle**: Click the theme toggle in the header
2. **System Preference**: Browser respects OS dark mode setting
3. **Persistence**: Theme preference saved to localStorage
4. **Debug Component**: `ThemeDebug` component shows current theme state (in AdvisorDashboard)

## Color Palette

### Light Mode
- Background: gray-50, white
- Text: gray-900, gray-600
- Borders: gray-200, gray-300
- Cards: white with gray borders

### Dark Mode
- Background: gray-950, slate-950
- Text: white, slate-300
- Borders: white/10, gray-700
- Cards: gray-800 with subtle borders

## Accessibility

- ✅ Smooth color transitions (300ms)
- ✅ Maintains contrast ratios (WCAG AA)
- ✅ Focus rings visible in both modes
- ✅ Keyboard navigation support
- ✅ ARIA labels on theme toggle

## Custom Scrollbar
Both light and dark modes have custom scrollbar styling in `index.css`:
- Light: Gray scrollbar on light background
- Dark: Darker scrollbar on dark background

## Animation Support
All animations from Framer Motion work seamlessly in both modes with proper color transitions.

## Troubleshooting

### Theme not switching?
1. Check if `ThemeProvider` wraps the app in `main.tsx`
2. Verify `darkMode: 'class'` in `tailwind.config.js`
3. Check browser console for errors

### Colors look wrong?
1. Ensure all colors use the dark: prefix pattern
2. Check if custom CSS overrides Tailwind classes
3. Verify Tailwind purge isn't removing dark: classes

### Persistence not working?
1. Check browser localStorage is enabled
2. Verify no errors in ThemeContext
3. Check if localStorage.setItem is blocked by browser

## Future Enhancements

- [ ] Color-blind friendly palette options
- [ ] Custom theme colors (user preferences)
- [ ] Scheduled dark mode (auto at sunset)
- [ ] Per-page theme overrides
