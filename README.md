# 🏆 OJ-Project - Online Judge Platform

A comprehensive online judge platform for coding competitions and practice, featuring real-time code compilation, submission tracking, and AI-powered assistance.

## 🌟 Features

- **Interactive Code Editor** with multi-language support (C++, Java, Python)
- **Real-time Code Compilation** with instant feedback and custom test cases
- **Problem Management** with categories, difficulty levels, and automated evaluation
- **User Authentication** with role-based access control and submission tracking
- **Leaderboard & Analytics** with performance metrics and statistics
- **AI-powered Assistance** with intelligent hints and code analysis

## 📸 Screenshots

### 🏠 **Homepage & Dashboard**
![Homepage](./photos/homepage.png)
*Clean and modern landing page with intuitive navigation*

![User Dashboard](./photos/dashboard.png)
*Personalized user dashboard with statistics and recent submissions*

### 💻 **Code Editor & Compilation**
![Code Editor](./photos/code-editor.png)
*Interactive code editor with syntax highlighting and multi-language support*

![Compilation Results](./photos/compilation-results.png)
*Real-time compilation feedback with test case results*

### 📝 **Problem Management**
![Problem List](./photos/problem-list.png)
*Comprehensive problem listing with difficulty levels and categories*

![Problem Details](./photos/problem-details.png)
*Detailed problem description with sample test cases*

### 👥 **User Management & Authentication**
![Login Page](./photos/login.png)
*Secure user authentication interface*

![Registration](./photos/registration.png)
*User-friendly registration process*

### 📊 **Analytics & Leaderboard**
![Leaderboard](./photos/leaderboard.png)
*Competitive programming leaderboard with rankings*

![User Statistics](./photos/user-stats.png)
*Detailed performance analytics and submission history*

### ⚙️ **Admin Panel**
![Admin Dashboard](./photos/admin-dashboard.png)
*Comprehensive admin interface for platform management*

![Problem Creation](./photos/admin-problem-creation.png)
*Admin tool for creating and managing problems*

### 🤖 **AI Features**
![AI Assistance](./photos/ai-assistance.png)
*AI-powered code hints and debugging help*

![Code Analysis](./photos/code-analysis.png)
*Intelligent code analysis and optimization suggestions*

## 🛠️ Tech Stack

### **Frontend**
- **React 19** with modern hooks
- **Vite** for fast development and building
- **React Router** for navigation
- **TailwindCSS** + **Bootstrap** for styling
- **Monaco Editor** & **CodeMirror** for code editing
- **Axios** for API communication

### **Backend**
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT Authentication** with **bcryptjs**
- **Google GenAI** integration
- **CORS** enabled for cross-origin requests

### **Code Compiler Service**
- **Dockerized compilation environment**
- **Multi-language code execution**
- **Secure sandboxed execution**
- **Real-time compilation results**

### **DevOps & Deployment**
- **Docker & Docker Compose** for containerization
- **Vercel** deployment ready
- **Development & Production** configurations

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud)
- **Docker** & **Docker Compose** (for compiler service)
- **Git**

### 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/swarooperla/OJ-Project.git
cd OJ-Project
```

2. **Install root dependencies**
```bash
npm install
```

3. **Setup Client (Frontend)**
```bash
cd client
npm install
# or
pnpm install
```

4. **Setup Server (Backend)**
```bash
cd ../server
npm install
# or 
pnpm install
```

5. **Setup Compiler Service**
```bash
cd ../compiler
npm install
# or
pnpm install
```

### 💻 Development Setup

1. **Start Backend Server**
```bash
cd server
npm run dev
# Server runs on http://localhost:8000
```

2. **Start Compiler Service**
```bash
cd compiler
npm run dev
# Compiler runs on http://localhost:9000
```

3. **Start Frontend**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`.

### Backend
Deploy to any Node.js hosting service (Heroku, AWS, DigitalOcean, etc.)

### Compiler Service
Deploy using Docker to any container hosting service.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

**Happy Coding!** 🎉