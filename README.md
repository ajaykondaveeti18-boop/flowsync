# FlowSync

FlowSync is a modern AI-powered workspace built with React and Supabase.

It helps users manage their projects, tasks, and notes from a single dashboard, while an integrated AI assistant provides task prioritization and workspace insights.

## 🚀 Features

- 🔐 User authentication with Supabase
- 📊 Dashboard with workspace statistics
- 📁 Project management
- ✅ Task management
- 📝 Notes management
- 🤖 AI-powered workspace assistant
- 🔎 Search projects, tasks, and notes
- 📱 Responsive design
- 🎨 Reusable UI components
- 🗄️ PostgreSQL database through Supabase
- 🔒 Row Level Security for user data

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- React Router
- Tailwind CSS
- Lucide React

### Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Edge Functions

### AI

- Google Gemini
- Gemini API
- Supabase Edge Function for secure AI requests

## 🤖 AI Assistant

FlowSync includes an AI assistant that analyzes workspace data such as projects and tasks.

It can provide:

- Task prioritization
- Workspace insights
- Productivity suggestions

The Gemini API key is stored securely in Supabase and is never exposed in the frontend application.

## 🔐 Authentication

Authentication is handled using Supabase Authentication.

Users can:

- Create an account
- Log in
- Log out
- Access protected workspace pages

Unauthenticated users are redirected to the login page.

## 📁 Project Structure

```text
src/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   ├── projects/
│   ├── tasks/
│   └── ui/
│
├── lib/
│   └── supabase.js
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Notes.jsx
│   ├── Projects.jsx
│   ├── Register.jsx
│   ├── Settings.jsx
│   └── Tasks.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   └── auth.js
│
├── App.jsx
└── main.jsx
