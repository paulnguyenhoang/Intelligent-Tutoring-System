# 🎓 Intelligent Tutoring System - Frontend

> Hệ thống hướng dẫn thông minh với 2 module: Learning Content Management và Assessment System

## 🎯 Tổng quan

Frontend cho bài tập lớn môn Kiến trúc phần mềm (HK251), bao gồm:

### Module 1: Learning Content Management (CMS)

- 👨‍🏫 Giáo viên tạo/quản lý bài giảng
- 📹 Hỗ trợ YouTube embed
- ✏️ CRUD đầy đủ với modal interface

### Module 2: Assessment System

- 📝 Giáo viên tạo/quản lý quiz
- 🎯 Học sinh làm quiz với validation
- 📊 Tự động chấm điểm và hiển thị kết quả

## 📱 6 Giao diện chính

1. **Sign In** - Đăng nhập với role
2. **Sign Up** - Đăng ký tài khoản
3. **Course Management** (Teacher) - Quản lý bài giảng
4. **Quiz Management** (Teacher) - Quản lý quiz
5. **Courses View** (Student) - Xem bài giảng
6. **Take Quiz** (Student) - Làm quiz & xem kết quả

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:5174/
```

### Demo Accounts

- **Teacher:** `teacher1` / `123456`
- **Student:** `student1` / `123456`

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool & dev server
- **Ant Design 6.0.0** - UI components
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **Less 4.2.0** - CSS preprocessor
- **React Router 6.14.0** - Client-side routing

## 📁 Cấu trúc Project

```
src/
├── components/      # Reusable components
├── pages/          # 6 page components
├── services/       # Business logic (courseService, quizService)
├── hooks/          # Custom hooks (useAuth, useLocalStorage)
├── types/          # TypeScript definitions
├── constants/      # App constants
└── utils/          # Helper functions
```

## ✨ Features

### Clean Architecture

- ✅ No inline CSS (module.less pattern)
- ✅ TypeScript strict mode
- ✅ Service-based pattern
- ✅ Custom hooks for logic reuse
- ✅ Centralized types & constants

### User Experience

- ✅ Role-based access control
- ✅ Form validation
- ✅ Progress tracking
- ✅ YouTube auto-embed
- ✅ Empty states
- ✅ Confirmation dialogs
- ✅ Success/Error notifications

### Data Flow

- ✅ localStorage persistence
- ✅ CRUD operations
- ✅ Quiz evaluation algorithm
- ✅ Protected routes

## 📖 Documentation

- **[COMPLETE_DEMO_GUIDE.md](./COMPLETE_DEMO_GUIDE.md)** - Step-by-step demo script
- **[STRUCTURE.md](./STRUCTURE.md)** - Architecture & folder structure
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - API reference & patterns
- **[SUMMARY.md](./SUMMARY.md)** - Project summary

## 🎬 Demo Flow

```
1. Sign up Teacher & Student accounts
2. Teacher creates 3 courses (with YouTube links)
3. Teacher creates 2 quizzes (3-4 questions each)
4. Student views courses & watches videos
5. Student takes quiz & gets 100% score
```

**Demo time:** ~5-7 phút

## 🧪 Testing Scenarios

### Happy Path

- ✅ Create course → Edit → View → Delete
- ✅ Create quiz → Add questions → Submit
- ✅ Take quiz → Answer all → Get result

### Validation

- ✅ Empty form submission
- ✅ Incomplete quiz (missing answers)
- ✅ Unauthorized route access

### Edge Cases

- ✅ No courses available
- ✅ No quizzes created
- ✅ Invalid YouTube URLs

## 🔑 Key Concepts

### Protected Routes

```tsx
<ProtectedRoute allowedRole="teacher">
  <TeacherDashboard />
</ProtectedRoute>
```

### Custom Hooks

```tsx
const { user, login, logout } = useAuth();
const [courses, setCourses] = useLocalStorage<Course[]>("its_courses", []);
```

### Service Pattern

```tsx
// Services handle business logic
import { getCourses, createCourse } from "../services/courseService";
```

### Type Safety

```tsx
import type { Quiz, Question } from "../types";
// Type-only imports for verbatimModuleSyntax
```

## 📊 Data Models

### LocalStorage Keys

- `its_user` - Current logged-in user
- `its_users` - All registered users
- `its_courses` - Teacher's courses
- `its_quizzes` - Teacher's quizzes

### Core Types

```typescript
User { username, role, password? }
Course { id, title, description?, content? }
Quiz { id, title, questions[], courseId? }
Question { id, text, options[], answerIndex }
QuizResult { correct, total }
```

## 🎨 Styling Convention

```tsx
// Tailwind for utilities
<div className="min-h-screen">

// Module Less for components
import styles from "./Component.module.less"
<div className={styles.container}>
```

## 🔒 Security Notes

⚠️ **Current:** Client-side only, localStorage, plain text passwords

🔐 **Production needs:** Backend API, JWT, password hashing, HTTPS

## 📦 Build & Deploy

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Preview build
npm run preview
```

## 🐛 Troubleshooting

**Routes not working?**  
→ Vite handles SPA routing in dev. For production, configure server.

**Type errors?**  
→ Restart TypeScript server: Cmd+Shift+P → "Restart TS Server"

**Styles not applying?**  
→ Check `.module.less` import and class names

## 👥 Team

- Bài tập lớn môn Kiến trúc phần mềm
- HK251 - 2024/2025

## 📄 License

Educational project - HCM University of Technology

---

**Status:** ✅ Hoàn thành 100% - Ready for demo

**Last updated:** November 29, 2025
