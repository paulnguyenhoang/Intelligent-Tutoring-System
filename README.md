# Intelligent Tutoring System (ITS)

A comprehensive web-based intelligent tutoring system built with React, TypeScript, Node.js, and PostgreSQL. This platform provides an interactive learning environment for students and instructors with features including course management, quiz creation, and automated grading.

## 🌟 Features

### For Students

- **User Authentication**: Secure registration and login with email verification
- **Course Browsing**: Browse and enroll in available courses
- **Interactive Quizzes**: Take quizzes with multiple question types
- **Progress Tracking**: View quiz results and track learning progress
- **Real-time Feedback**: Get instant feedback on quiz submissions

### For Instructors

- **Course Management**: Create, edit, and manage courses
- **Lesson Creation**: Organize course content into structured lessons
- **Quiz Builder**: Create quizzes with various question types
- **Student Analytics**: Monitor student performance and quiz statistics
- **Material Management**: Upload and manage course materials (text, video)

## 🏗️ Architecture

### Tech Stack

**Frontend**

- React 19.2.0
- TypeScript
- Ant Design (UI Components)
- React Router
- Vite (Build Tool)
- Less (Styling)

**Backend**

- Node.js
- Express.js
- TypeScript
- pg-promise (PostgreSQL client)
- JWT (Authentication)
- Nodemailer (Email verification)
- Bcrypt (Password hashing)
- Multer (File uploads)

**Database**

- PostgreSQL 18

**DevOps**

- Docker & Docker Compose
- Nodemon (Development)

### Project Structure

```
Intelligent-Tutoring-System/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controller/     # Route controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── interface/      # TypeScript interfaces
│   │   ├── model/          # Database models
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── constants/      # App constants
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── db/                     # Database files
│   ├── init.sql           # Database initialization script
│   └── erd.pgerd          # ERD diagram
├── docker-compose.yml      # Docker services configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- npm or yarn
- PostgreSQL (if running without Docker)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/paulnguyenhoang/Intelligent-Tutoring-System.git
   cd Intelligent-Tutoring-System
   ```

2. **Set up the database**

   ```bash
   docker-compose up -d its-database
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the database** (if not already running)

   ```bash
   docker-compose up -d its-database
   ```

2. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

   The backend server will run on `http://localhost:3001`

3. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 📊 Database Schema

The system uses PostgreSQL with the following main entities:

- **User**: Base user information (students and instructors)
- **Student**: Student-specific data
- **Instructor**: Instructor-specific data
- **Course**: Course information
- **Lesson**: Course lessons
- **Material**: Learning materials (text/video)
- **Quiz**: Quiz information
- **Question**: Quiz questions with options
- **QuizAttempt**: Student quiz submissions and scores

See `db/init.sql` for the complete schema.

## 🔐 Authentication

The system implements JWT-based authentication:

1. Users register with username, email, and password
2. Email verification is sent via Nodemailer
3. Upon successful login, JWT token and user ID are stored in localStorage
4. Protected routes require valid JWT token

**LocalStorage Keys:**

- `its_user`: User information (username, role, id)
- `its_jwt`: JWT authentication token
- `its_user_id`: User ID

## 📝 API Endpoints

### Authentication

- `POST /register` - User registration
- `POST /login` - User login
- `GET /verify` - Email verification

### Courses (Student)

- `GET /student/courses` - Get all available courses
- `GET /student/course/:id` - Get course details

### Courses (Instructor)

- `GET /instructor/courses` - Get instructor's courses
- `POST /instructor/course` - Create new course
- `PUT /instructor/course/:id` - Update course
- `DELETE /instructor/course/:id` - Delete course

### Quizzes

- `GET /student/quizzes` - Get available quizzes
- `POST /student/quiz/submit` - Submit quiz attempt
- `GET /instructor/quizzes` - Get instructor's quizzes
- `POST /instructor/quiz` - Create new quiz
- `PUT /instructor/quiz/:id` - Update quiz
- `DELETE /instructor/quiz/:id` - Delete quiz

## 🎨 UI Components

The frontend uses Ant Design components for a consistent and professional UI:

- **Forms**: Login, Registration, Course/Quiz Creation
- **Modals**: Course details, Quiz creation/editing, Results
- **Cards**: Course cards, Question cards
- **Tables**: Student lists, Quiz statistics
- **Layouts**: Dashboard layouts, Protected routes

## 🔧 Configuration

### Backend Configuration

Located in `backend/src/config/config.ts`:

- Database connection settings
- JWT secret
- Email service configuration
- Server port

### Frontend Configuration

- API base URL: `http://localhost:3001`
- Routes defined in `frontend/src/constants/index.ts`

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Building for Production

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built as part of Software Architecture course (HK251)
- Uses Ant Design for UI components
- PostgreSQL for robust data management
- Docker for containerization

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is an educational project developed for the Software Architecture course at HCMUT.
