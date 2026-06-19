# MeetVault - Meeting Management App

A modern, fully-functional Next.js application for organizing and managing meeting recordings with a sleek dark theme interface.

## ✨ Features

- **Dashboard**: Overview of all meeting recordings
- **Meeting List**: Browse meetings with multiple tags and filtering capabilities
- **Filter Tabs**: Quick filtering by meeting categories (sprint, backend, client, interview, standup, design, marketing)
- **New Meeting Modal**: Add new meetings with title, tags, and date
- **Tag Management**: Add/remove tags from meetings dynamically
- **Status Indicator**: Real-time status badge showing app readiness
- **Responsive Design**: Fully responsive layout with fixed sidebar and header
- **Dark Theme**: Beautiful dark mode optimized for long work sessions

## 🏗️ Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx          # Root layout with dark theme and fonts
│   ├── page.tsx            # Main dashboard page with meeting list
│   └── globals.css         # Global styles and Tailwind configuration
├── components/
│   ├── sidebar.tsx         # Fixed left sidebar navigation
│   ├── header.tsx          # Top header with title and "New Meeting" button
│   ├── filter-tabs.tsx     # Horizontal filter buttons for meeting categories
│   ├── meeting-card.tsx    # Individual meeting card component
│   ├── new-meeting-modal.tsx  # Modal for creating new meetings
│   └── status-badge.tsx    # Status indicator badge
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

**Color Palette:**
- Background: `zinc-950` (dark background)
- Primary Text: `zinc-100` to `zinc-200`
- Secondary Text: `zinc-400` to `zinc-600`
- Accents: 
  - Blue: Sprint meetings
  - Teal: Standup meetings
  - Amber: Backend meetings
  - Green: Interview meetings
  - Zinc: Client meetings

**Typography:**
- Font Family: Inter
- Headings: Medium weight (500)
- Body: Normal weight (400)

**Components:**
- Buttons: Rounded corners with hover states
- Cards: Dark backgrounds with subtle borders
- Borders: 0.5px custom borders (`border-half`)
- Spacing: Consistent gap and padding using Tailwind scale

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📦 Built With

- **Next.js 16** - React framework with App Router
- **Tailwind CSS v4** - Utility-first CSS framework
- **React 19** - UI library with latest hooks
- **TypeScript** - Type-safe development

## 🎯 Key Components

### Sidebar (`components/sidebar.tsx`)
- Fixed left navigation panel
- Logo with app name
- Navigation links (Dashboard, All Meetings, Tags)
- Settings button

### Header (`components/header.tsx`)
- Sticky top section
- Page title and new meeting button
- Backdrop blur effect

### Meeting Card (`components/meeting-card.tsx`)
- Displays meeting information with title, tags, date, duration
- Shows View and Download buttons on hover
- Color-coded tags based on meeting type

### New Meeting Modal (`components/new-meeting-modal.tsx`)
- File upload area
- Title input field
- Dynamic tag management
- Date picker
- Transcription status indicator

### Filter Tabs (`components/filter-tabs.tsx`)
- Horizontal scrollable filter buttons
- Active state highlighting
- Category-based filtering

## 🎨 Customization

All styling uses Tailwind CSS utility classes. To modify:

1. **Colors**: Update color values in `app/globals.css` or use Tailwind's color modifiers
2. **Typography**: Modify font-size classes and font weights
3. **Spacing**: Adjust gap, padding, and margin using Tailwind scale
4. **Icons**: Replace SVG icons in components with your preferred icon library

## 📝 Example Usage

The app comes pre-populated with 5 sample meetings:
- Q3 Planning Standup
- API Architecture & Load Balancing
- Customer Interview: Sarah Jenkins (Acme)
- UI/UX Feedback Session - Dashboard v2
- Project Kickoff: Mobile App Refactor

Click "New Meeting" to add more meetings with custom titles, tags, and dates.

## 🔧 Available Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint

# TypeScript checking
pnpm type-check
```

## 📄 License

This project is created with v0.app
