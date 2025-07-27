# 🏆 OJ-Project - Online Judge Platform

A comprehensive online judge platform for coding competitions and practice, featuring real-time code compilation, submission tracking, and AI-powered assistance.

## 🌟 Features

### 👨‍💻 **Code Editor & Compilation**
- **Interactive Code Editor** with syntax highlighting (Monaco Editor & CodeMirror)
- **Multi-language Support** for C++, Java, Python, and more
- **Real-time Code Compilation** with instant feedback
- **Custom Test Cases** and automated testing

### 🏛️ **Problem Management**
- **Problem Creation** with rich text descriptions
- **Problem Categories** and difficulty levels  
- **Test Case Management** for automated evaluation
- **Admin Problem Management** interface

### 👥 **User Management**
- **User Registration & Authentication** with JWT
- **Role-based Access Control** (Admin/User)
- **User Dashboard** with personal statistics
- **Submission History** tracking

### 📊 **Tracking & Analytics**
- **Submission Management** with detailed results
- **Leaderboard** system for competitive programming
- **User Statistics** and performance metrics
- **Admin Dashboard** for platform management

### 🤖 **AI Integration**
- **AI-powered Code Assistance** using Google GenAI
- **Intelligent Hints** and debugging help
- **Code Analysis** and optimization suggestions

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
git clone https://github.com/yourusername/OJ-Project.git
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

### 🔐 Environment Configuration

Create `.env` files in the respective directories:

**Server (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/oj-project
JWT_SECRET=your_jwt_secret_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
NODE_ENV=development
PORT=8000
```

**Compiler (.env)**
```env
NODE_ENV=development
SERVER_API_URL=http://localhost:8000
PORT=9000
```

### 🐳 Running with Docker (Recommended)

1. **Start the compiler service**
```bash
docker-compose up
```

2. **Start the backend server**
```bash
cd server
npm run dev
```

3. **Start the frontend**
```bash
cd client
npm run dev
```

### 💻 Manual Development Setup

1. **Start MongoDB** (if running locally)

2. **Start Backend Server**
```bash
cd server
npm run dev
# Server runs on http://localhost:8000
```

3. **Start Compiler Service**
```bash
cd compiler
npm run dev
# Compiler runs on http://localhost:9000
```

4. **Start Frontend**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

## 📁 Project Structure

```
OJ-Project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── assets/         # Static assets
│   │   └── css/           # Stylesheets
│   ├── public/            # Public assets
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── database/         # DB configuration
│   └── server.js         # Entry point
├── compiler/             # Code compilation service
│   ├── controllers/      # Compilation logic
│   ├── services/         # Compilation services
│   ├── routes/          # Compiler routes
│   └── Dockerfile       # Docker configuration
├── docker-compose.yml   # Docker orchestration
└── package.json        # Root dependencies
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Problems
- `GET /api/problems` - Get all problems
- `POST /api/problems` - Create new problem (Admin)
- `PUT /api/problems/:id` - Update problem (Admin)
- `DELETE /api/problems/:id` - Delete problem (Admin)

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions` - Get user submissions
- `GET /api/submissions/:id` - Get submission details

### AI Assistance
- `POST /api/ai/help` - Get AI code assistance
- `POST /api/ai/analyze` - Analyze code

### Compiler
- `POST /compiler/compile` - Compile and execute code

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`.

### Backend
Deploy to any Node.js hosting service (Heroku, AWS, DigitalOcean, etc.)

### Compiler Service
Deploy using Docker to any container hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Inspired by competitive programming platforms like Codeforces and LeetCode
- Special thanks to the coding community for continuous inspiration

## 📞 Support

If you have any questions or run into issues, please:
1. Check the existing [Issues](https://github.com/yourusername/OJ-Project/issues)
2. Create a new issue if needed
3. Reach out via [email@example.com](mailto:email@example.com)

---

**Happy Coding!** 🎉