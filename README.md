# Next.js Authentication Dashboard

A Mini Business Intelligence tool built with Next.js, Material UI, and client-side authentication. This project demonstrates a mini BI tool dashboard with protected route for the dashboard and an automatic log out timer if user does not check the box to keep them logged in, a responsive dashboard with charts and data visualization, and mock API integration.

![Dashboard Preview](https://via.placeholder.com/800x450?text=Dashboard+Preview)

## 🌟 Features

### Authentication System
- **User Registration** - Create new accounts with email validation and password requirements
- **User Login** - Secure login with email and password
- **Remember Me** - Option to stay logged in between sessions
- **Protected Routes** - Client-side route protection for dashboard
- **Session Management** - Automatic logout after inactivity (1 minutes)
- **Form Validation** - Comprehensive validation using Zod and React Hook Form

### Dashboard
- **Responsive Design** - Fully responsive layout that works on mobile, tablet, and desktop
- **Data Visualization** - Interactive charts using Recharts:
  - Line charts for sales trends
  - Bar charts for user growth
  - Pie charts for category distribution
- **Data Tables** - Sortable and filterable tables with pagination
- **Summary Cards** - Key metrics with visual indicators for trends
- **Time Period Filtering** - Filter dashboard data by month, quarter, or year
- **Mock API Integration** - Simulated backend using MSW (Mock Service Worker)

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [Material UI](https://mui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://github.com/colinhacks/zod)
- **Charts**: [Recharts](https://recharts.org/)
- **API Mocking**: [MSW (Mock Service Worker)](https://mswjs.io/)
- **Authentication**: Client-side with localStorage
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/rholibobo/BI-tool.git
cd nextjs-auth-dashboard
```

2. Install dependencies
```bash
npm install
``` 

3. Initialize MSW:
```bash
npx msw init public/ --save
```

4. Start Development Server:
```bash
npm run dev
```

## Great Job!!
