# Adjustable Sidebar Implementation

## Overview
Implemented an adjustable sidebar component for both the Student and Faculty portals, similar to ChatGPT's sidebar. The sidebar can be collapsed/expanded with smooth animations and responsive design.

## Files Created

### 1. **Sidebar.jsx** (`src/components/Sidebar.jsx`)
A new reusable sidebar component with the following features:
- **Toggle Button**: Click to expand/collapse the sidebar
- **Profile Section**: Displays user avatar, name, and role (hidden when collapsed)
- **Navigation Links**: Dynamic navigation links with active state styling
- **Logout Button**: Always accessible with icon and label
- **Responsive**: Adapts to mobile devices

**Key Props:**
- `userInfo`: Object containing `name`, `id`, and `role`
- `navLinks`: Array of navigation link objects with `label` and `path`
- `onLogout`: Callback function for logout action
- `portalType`: Type of portal (student/faculty)

### 2. **sidebar.module.css** (`src/styles/sidebar.module.css`)
Comprehensive styling for the sidebar with:
- **Smooth Transitions**: 0.3s ease animations for width and opacity changes
- **Collapsed State**: Sidebar shrinks from 240px to 70px with centered icons
- **Profile Section**: Shows full information when expanded, hidden when collapsed
- **Navigation**: Icon-only when collapsed, with labels when expanded
- **Hover Effects**: Subtle background changes on hover
- **Active State**: Highlighted background for current page
- **Scrollbar Styling**: Custom scrollbar appearance
- **Mobile Responsive**: Converts to bottom navigation on screens ≤ 768px

### 3. **Updated PortalLayout.jsx** (`src/layouts/PortalLayout.jsx`)
Modified to use the new Sidebar component:
- Removed old inline sidebar code
- Added `studentNavLinks` array with all navigation options
- Created `userInfo` object with student details
- Integrated Sidebar component with proper props

### 4. **Updated FacultyPortalLayout.jsx** (`src/layouts/FacultyPortalLayout.jsx`)
Modified to use the new Sidebar component:
- Removed old inline sidebar code
- Added `facultyNavLinks` array with faculty options
- Created `userInfo` object with faculty details
- Integrated Sidebar component with proper props

### 5. **Updated layout.module.css** (`src/styles/layout.module.css`)
Modified the grid layout:
- Changed `grid-template-columns` from `240px 1fr` to `auto 1fr`
- Allows sidebar to dynamically adjust width
- Removed old sidebar styling (moved to sidebar.module.css)

## Features

### 1. **Toggle Functionality**
- Click the toggle button (chevron icon) to expand/collapse
- Smooth CSS transitions for width changes
- Icon animates to show expand/collapse direction

### 2. **Responsive Behavior**
- **Desktop**: Full sidebar with toggle button (240px expanded, 70px collapsed)
- **Mobile** (≤768px): Bottom navigation bar layout
- All content properly adjusted with CSS Grid

### 3. **Visual Design**
- Consistent with existing dark navy theme
- Smooth hover effects on navigation items
- Active route highlighting
- Proper spacing and alignment

### 4. **Accessibility**
- ARIA labels for toggle button
- Title attributes for tooltip information
- Semantic HTML structure
- Keyboard navigation support

## Usage Example

### In a Layout Component:
```jsx
import Sidebar from '../components/Sidebar.jsx'

const navLinks = [
  { label: 'Dashboard', path: '/portal/dashboard' },
  { label: 'My Courses', path: '/portal/my-courses' },
  // ... more links
]

const userInfo = {
  name: 'John Doe',
  id: 'STU-001',
  role: 'Student'
}

<Sidebar
  userInfo={userInfo}
  navLinks={navLinks}
  onLogout={handleLogout}
  portalType="student"
/>
```

## Animation Details
- **Sidebar Width**: Animates from 240px to 70px (0.3s ease)
- **Profile Section**: Transitions in/out with opacity
- **Navigation Labels**: Fade out when collapsed, fade in when expanded
- **Toggle Button**: Chevron icon rotates smoothly

## Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- CSS Grid and Flexbox support required

## Future Enhancements
- Add sidebar state persistence to localStorage
- Add more navigation link icons
- Implement sidebar animation preferences
- Add sidebar themes (light/dark mode)
- Add keyboard shortcuts for expand/collapse
