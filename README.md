# Drug Development Portfolio Dashboard

A modern clinical RCD (Research & Clinical Development) portfolio management system built with Next.js and Redux, featuring dark and light theme support.

## 🚀 Features

- **Browse Programs**: View all drug development programs in a modern, responsive interface
- **Advanced Filtering**: Filter by development phase and therapeutic area with custom checkbox styling
- **Drill-Down Details**: View detailed information and associated studies for each program
- **Metadata Editing**: Authorized users can edit program metadata (development phase, therapeutic area, milestone)
- **Study Tracking**: Track enrollment and status for studies associated with each program
- **Dark/Light Theme**: Toggle between modern dark and light themes with smooth transitions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Contemporary design with:
  - Gradient headers and buttons
  - Smooth shadows and depth effects
  - Rounded corners and modern spacing
  - Transitions and hover effects
  - Custom checkbox styling
  - Optimized typography
- **Accessibility**: WCAG-compliant with:
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation
  - Focus indicators
  - Color contrast compliance

## 📋 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules with CSS variables for theming
- **Data**: Synthetic JSON generated on API routes
- **Themes**: Light and dark mode with CSS custom properties

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── data.ts                 # Synthetic data generator
│   │   └── programs/
│   │       ├── route.ts            # GET/POST programs
│   │       └── [id]/
│   │           └── route.ts        # GET/PUT program by ID
│   ├── layout.tsx                  # Root layout with theme CSS
│   ├── layout.css                  # Global styles with theme variables
│   └── page.tsx                    # Home page with Redux provider
├── components/
│   ├── Dashboard.tsx               # Main dashboard with theme toggle
│   ├── Dashboard.module.css        # Theme-aware dashboard styles
│   ├── ProgramList.tsx             # Program table list
│   ├── ProgramList.module.css      # Themed table styles
│   ├── FilterPanel.tsx             # Filter sidebar
│   ├── FilterPanel.module.css      # Modern filter panel styles
│   ├── ProgramDetails.tsx          # Detailed program view
│   └── ProgramDetails.module.css   # Themed detail styles
└── store/
    ├── store.ts                    # Redux store configuration
    └── slices/
        ├── programsSlice.ts        # Programs state & async thunks
        ├── filtersSlice.ts         # Filter state
        ├── authSlice.ts            # Auth state
        └── themeSlice.ts           # Theme state (light/dark)
```

## 🎯 Core Functionality

### Programs API

- **GET /api/programs**: Fetch all programs (supports filtering by phase and area)
- **POST /api/programs**: Create new program
- **GET /api/programs/[id]**: Get program details with associated studies
- **PUT /api/programs/[id]**: Update program metadata

### Redux State

- **programs**: Manages program data, selected program, and loading/error states
- **filters**: Manages active development phase and therapeutic area filters
- **auth**: Manages user authorization status and role
- **theme**: Manages current theme mode (light/dark)

### UI Components

- **Dashboard**: Main container managing layout, state, and theme toggle
- **ProgramList**: Displays programs in a modern table with drill-down capability
- **FilterPanel**: Sidebar with custom-styled checkboxes for filtering
- **ProgramDetails**: Shows full program details and associated studies with edit capability

## 🌓 Theme System

The dashboard supports dark and light themes using CSS custom properties (CSS variables):

### Light Theme
- Clean white backgrounds
- Dark text for readability
- Blue accent colors (#0052cc)
- Subtle shadows and borders

### Dark Theme
- Dark backgrounds (#0d1117)
- Light text for readability
- Brighter blue accents (#1f6feb)
- Enhanced shadows for depth

**Switching Themes**: Click the theme toggle button (☀️/🌙) in the header

### Theme Colors

Both themes define:
- Primary, secondary, and tertiary backgrounds
- Primary, secondary, and tertiary text colors
- Border and accent colors
- Success, warning, and info status colors
- Shadow levels (sm, md, lg, xl)

## 🔐 Authorization

The system includes role-based access control:
- **viewer**: Can browse programs and view details (read-only)
- **editor**: Can edit program metadata (default)
- **admin**: Full access

Currently, auth is simulated as `editor` role. To modify, update `src/store/slices/authSlice.ts`.

## 📊 Synthetic Data

The dashboard generates 50 synthetic drug programs with:
- Realistic development phases (Discovery through Approved)
- 7 therapeutic areas (Oncology, Cardiology, etc.)
- Multiple studies per program with enrollment data
- Milestone and indication information

Generated data is stored in memory and persists during the session.

## 🎨 Modern Design Features

### Visual Hierarchy
- Large, bold typography for headers
- Consistent spacing and padding
- Clear visual separation between sections

### Interactive Elements
- Smooth hover effects with transitions
- Elevated shadows on hover
- Gradient buttons for primary actions
- Custom-styled checkboxes with animated states

### Color Palette

**Light Theme:**
- Primary: #0052cc (Blue)
- Success: #155724 (Dark green)
- Warning: #856404 (Orange)
- Backgrounds: White to light gray

**Dark Theme:**
- Primary: #1f6feb (Bright blue)
- Success: #3fb950 (Green)
- Warning: #d29922 (Orange)
- Backgrounds: Dark grays and blacks

### Spacing
- 8px base unit for consistent spacing
- 12px sidebar padding
- 24px main content padding
- 8-24px gaps between elements

### Typography
- System font stack for performance
- Font weights: 400, 500, 600, 700
- Letter spacing for emphasis
- Optimized line heights (1.6)

## ⌨️ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA+)
- Focus visible indicators on all interactive elements
- Custom checkbox with keyboard support
- Table role attributes for screen readers

## 📝 Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔄 Development Workflow

1. Run `npm run dev` to start the development server
2. Make changes to components or API routes
3. Hot reload automatically updates the browser
4. Toggle theme with the button in the header
5. Test both light and dark modes

## 🚀 Performance Considerations

- Code splitting via Next.js automatic chunking
- CSS Modules prevent stylesheet bloat
- CSS variables enable efficient theme switching without reloads
- Smooth transitions with GPU acceleration
- Efficient re-renders with Redux selectors
- Table virtualization ready for 1000+ programs
- Optimized shadows and transforms for performance

## 📄 Documentation

### Assumptions

1. **Synthetic Data**: All data is generated synthetically; no real patient data
2. **In-Memory Storage**: Data persists only during the session
3. **Single User**: No multi-user synchronization
4. **Authorization**: Basic role-based system (not production-grade)
5. **Theme Persistence**: Theme preference stored in Redux state (can be persisted to localStorage)

### Architectural Decisions

1. **Next.js App Router**: Modern React patterns with built-in optimization
2. **Redux Toolkit**: Reduces boilerplate with async thunks
3. **CSS Modules + CSS Variables**: No external styling dependency with dynamic theming
4. **API Routes**: Unified codebase with serverless-ready endpoints
5. **Theme Slice**: Redux state for theme management with SSR support
6. **Gradient Accents**: Modern visual appeal with subtle animations

## 🐛 Known Limitations

- Data resets on server restart (in-memory only)
- No persistence to database
- Authorization is simulated
- Single-user only
- Theme preference not persisted across sessions

## 🔮 Future Enhancements

- [ ] Local storage for theme preference persistence
- [ ] Database integration for data persistence
- [ ] Multi-user support with real authentication
- [ ] Export programs to PDF/CSV
- [ ] Advanced search and sorting
- [ ] Drag-and-drop filtering
- [ ] Real-time collaboration
- [ ] Program comparison view
- [ ] Audit trail for metadata changes
- [ ] Mobile app version

## 📞 Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Documentation](https://redux.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)

---

**Created for healthcare technical challenge demonstration**
**Version**: 1.0.0 with Modern UI and Dark/Light Theme
