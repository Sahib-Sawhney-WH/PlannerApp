# Desktop Planner: A Comprehensive Project Management Application

This document provides a complete overview of the Desktop Planner application, including its features, architecture, and setup instructions. The application is built with Tauri, React, TypeScript, and SQLite, providing a powerful and local-first project management experience.

## 1. Features

The Desktop Planner application offers a wide range of features to help you manage your projects, tasks, clients, and more:

- **Dashboard**: Get a quick overview of your work with widgets for total tasks, overdue items, active projects, and opportunities.
- **Task Management**: Create, update, and track tasks with different statuses (Inbox, Todo, Doing, Blocked, Done), priorities, and due dates. View tasks in both list and Kanban board formats.
- **Project Management**: Organize your work into projects, track their status, and associate them with clients.
- **Client Management**: Keep a record of your clients, their contact information, and related projects.
- **Opportunity Pipeline**: Manage your sales pipeline with opportunities, track their value, stage, and probability.
- **Notes**: Take and organize your notes, link them to projects and clients.
- **Knowledge Base**: Build a personal knowledge base with articles, how-to guides, and other resources.
- **Time Tracking**: Track the time you spend on different tasks and projects.
- **RAID Log**: Manage risks, assumptions, issues, and dependencies for your projects.
- **Light/Dark Mode**: Switch between light and dark themes for a comfortable viewing experience.
- **Search**: Quickly find what you need with a powerful search that covers all your data.

## 2. Architecture

The application is built with a modern and robust architecture:

- **Frontend**: React 18 with TypeScript for a type-safe and component-based UI.
- **Backend**: Tauri with Rust for a secure and high-performance backend that runs on your local machine.
- **Database**: SQLite for a lightweight and file-based database that stores all your data locally.
- **Styling**: Tailwind CSS with a custom design system for a beautiful and responsive user interface.
- **State Management**: Zustand for a simple and scalable state management solution.

## 3. Project Structure

The project is organized into the following directories:

- `/src`: Contains the React frontend code, including components, store, types, and main application entry point.
- `/src-tauri`: Contains the Tauri backend code, including Rust source files, migrations, and configuration.
- `/public`: Contains the main HTML file and other static assets.

## 4. Setup and Installation

To set up and run the application locally, follow these steps:

1. **Install Dependencies**: Make sure you have Node.js, Rust, and Tauri CLI installed on your system.
2. **Clone the Repository**: Clone the project repository to your local machine.
3. **Install npm Packages**: Run `npm install` in the project root to install all frontend dependencies.
4. **Run the Application**: Run `npm run tauri dev` to start the application in development mode.

## 5. Packaging

To package the application for distribution, you can use the following command:

```
npm run tauri build
```

This will create a production build of the application and package it into a native installer for your operating system.