# SPC Control Chart Generator

## Overview

This is a Statistical Process Control (SPC) generator application that allows users to create, analyze, and export control charts for manufacturing quality control. The application enables users to input measurement data, perform statistical analysis including normality testing, calculate process capability indices (Cp, Cpk, Pp, Ppk), and generate professional control charts with visual indicators for process limits. It supports both variable and attribute data analysis, includes predefined part configurations for common manufacturing components, and provides PDF export functionality for reporting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript** - Modern component-based UI framework with type safety
- **Vite** - Fast build tool and development server optimized for modern web development
- **Tailwind CSS + shadcn/ui** - Utility-first CSS framework with a comprehensive component library providing consistent styling and accessibility
- **React Router (Wouter)** - Lightweight client-side routing for single-page application navigation
- **TanStack Query** - Server state management and data synchronization with caching and background updates

### Backend Architecture
- **Express.js** - Minimal Node.js web framework for API endpoints
- **TypeScript** - Type-safe server-side development
- **In-memory storage** - Simple storage interface with pluggable implementation for user data
- **Custom middleware** - Request logging and error handling with development-focused debugging

### Data Storage Solutions
- **Drizzle ORM** - Type-safe SQL query builder configured for PostgreSQL
- **PostgreSQL** - Production database with UUID-based primary keys and user authentication schema
- **Neon Database** - Serverless PostgreSQL hosting optimized for modern applications
- **Memory storage fallback** - In-memory storage implementation for development and testing

### Authentication and Authorization
- **Basic user schema** - Username/password based authentication with unique constraints
- **Session management** - Cookie-based sessions using connect-pg-simple for PostgreSQL session storage
- **Password hashing** - Secure password storage (implementation pending)

### Statistical Analysis Engine
- **Custom statistical calculations** - Anderson-Darling normality testing, process capability indices (Cp, Cpk, Pp, Ppk), and control limit calculations
- **Chart.js integration** - Interactive control chart generation with real-time data visualization
- **Process monitoring** - Out-of-specification detection and PPM (parts per million) calculations

### External Dependencies

#### UI and Styling
- **Radix UI primitives** - Unstyled, accessible components for complex UI patterns including dialogs, dropdowns, and form controls
- **Lucide React** - Consistent icon library with extensive symbol coverage
- **Class Variance Authority** - Type-safe utility for managing component variants and conditional styling

#### Charts and Visualization
- **Chart.js** - Comprehensive charting library loaded dynamically for control chart generation
- **HTML2Canvas + jsPDF** - Client-side PDF generation for exporting reports and charts

#### Development Tools
- **Replit plugins** - Development environment integration with runtime error overlay and cartographer for enhanced debugging
- **ESBuild** - Fast TypeScript compilation and bundling for production builds

#### Data Management
- **Zod** - Runtime type validation and schema definition for form data and API responses
- **React Hook Form** - Performant form management with validation integration
- **Date-fns** - Utility library for date manipulation and formatting

#### Database and ORM
- **Drizzle Kit** - Database migration and schema management tools
- **Neon Database Serverless** - PostgreSQL driver optimized for serverless environments
- **Connect-pg-simple** - PostgreSQL session store for Express sessions

The application follows a modular architecture with clear separation between statistical calculations, data visualization, and user interface components, enabling easy testing and maintenance of the complex SPC analysis functionality.