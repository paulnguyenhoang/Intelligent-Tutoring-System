# Frontend Structure - Intelligent Tutoring System

## 📁 Cấu trúc thư mục

```
src/
├── assets/              # Static files (images, icons)
├── components/          # Reusable components
│   ├── CourseDetailModal.tsx
│   ├── CoursesList.tsx
│   ├── CoursesList.module.less
│   ├── CreateCourseForm.tsx
│   ├── EditCourseModal.tsx
│   └── ProtectedRoute.tsx
├── pages/               # Page components (6 pages total)
│   ├── SignIn.tsx                      # 1. Authentication
│   ├── SignIn.module.less
│   ├── SignUp.tsx                      # 2. Registration
│   ├── SignUp.module.less
│   ├── TeacherDashboard.tsx            # 3. Course Management (Teacher)
│   ├── TeacherDashboard.module.less
│   ├── TeacherQuizManagement.tsx       # 4. Quiz Management (Teacher)
│   ├── TeacherQuizManagement.module.less
│   ├── StudentCourses.tsx              # 5. Course Viewing (Student)
│   ├── StudentCourses.module.less
│   ├── TakeQuiz.tsx                    # 6. Take Quiz (Student)
│   ├── TakeQuiz.module.less
│   ├── QuizResult.tsx                  # Quiz result display
│   └── QuizResult.module.less
├── services/            # Business logic / API calls
│   ├── courseService.ts  # CRUD for courses
│   └── quizService.ts    # CRUD for quizzes + evaluation
├── hooks/               # Custom React hooks
│   ├── useAuth.ts        # Authentication logic
│   ├── useLocalStorage.ts # LocalStorage wrapper
│   └── index.ts          # Barrel export
├── types/               # TypeScript type definitions
│   └── index.ts         # User, Course, Quiz, Question, QuizResult
├── constants/           # App constants & config
│   └── index.ts         # STORAGE_KEYS, ROUTES, ROLE_LABELS
├── utils/               # Helper functions
│   └── index.ts         # parseJSON, formatPercentage
├── App.tsx              # Main app layout with role-based menu
├── router.tsx           # Route configuration with ProtectedRoute
├── main.tsx             # App entry point
├── index.css            # Global styles (Tailwind)
└── styles.less          # Global Less variables
```

## 🎯 Quy ước đặt tên

### Files

- **Components**: `PascalCase.tsx` (e.g., `CreateCourseForm.tsx`)
- **Styles**: `ComponentName.module.less` (e.g., `SignIn.module.less`)
- **Services**: `camelCase.ts` (e.g., `courseService.ts`)
- **Hooks**: `useSomething.ts` (e.g., `useAuth.ts`)

### Code

- **Types/Interfaces**: `PascalCase` (e.g., `User`, `Course`)
- **Functions**: `camelCase` (e.g., `getCourses`, `formatPercentage`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `STORAGE_KEYS`, `ROUTES`)
- **CSS Classes** (module.less): `camelCase` (e.g., `signinContainer`)

## 📦 Module Breakdown

### 1. **types/** - Type Definitions

Tất cả TypeScript types được định nghĩa tập trung:

```ts
export type User = { username: string; role: UserRole }
export type Course = { id: string; title: string; ... }
```

### 2. **constants/** - Constants

Các hằng số dùng chung (routes, storage keys, labels):

```ts
export const STORAGE_KEYS = { USER: "its_user", ... }
export const ROUTES = { SIGN_IN: "/signin", ... }
```

### 3. **utils/** - Utilities

Helper functions thuần túy:

```ts
parseJSON<T>(value: string, fallback: T): T
formatPercentage(correct: number, total: number): number
```

### 4. **hooks/** - Custom Hooks

React hooks tái sử dụng:

- `useAuth()` - Authentication logic
- `useLocalStorage<T>()` - localStorage wrapper

### 5. **services/** - Business Logic

Data layer (localStorage, API calls):

- `courseService.ts` - CRUD operations for courses
- `quizService.ts` - Quiz logic & evaluation

### 6. **Styles** - CSS Modules

Mỗi component có file `.module.less` riêng để tránh conflict:

```tsx
import styles from './SignIn.module.less'
<div className={styles.signinContainer}>
```

## 🚀 Best Practices

### ✅ DO

- Import từ barrel files (`from '../hooks'` thay vì `from '../hooks/useAuth'`)
- Dùng constants thay vì hardcode strings
- Component-specific styles dùng `.module.less`
- Type mọi thứ có thể với TypeScript
- Tách logic ra hooks khi có thể reuse

### ❌ DON'T

- Hardcode routes/storage keys
- Inline styles (dùng Tailwind hoặc module.less)
- Duplicate type definitions
- Direct localStorage access (dùng qua utils/hooks)

## 📝 Import Examples

```tsx
// ✅ Good - Named imports from barrel files
import { useAuth } from "../hooks";
import { ROUTES, STORAGE_KEYS } from "../constants";
import { User, Course } from "../types";
import { parseJSON } from "../utils";

// ❌ Bad - Direct file imports
import { useAuth } from "../hooks/useAuth";
import { User } from "../types/index";
```

## 🎨 Styling Strategy

1. **Tailwind** - Utility classes cho layout nhanh
2. **Module.less** - Component-specific styles
3. **styles.less** - Global styles/variables

```tsx
// Kết hợp cả 3:
<div className="flex items-center">  {/* Tailwind */}
  <Card className={styles.signinCard}> {/* Module.less */}
</div>
```

## 🔧 Development

```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run linter
```

---

**Clean Code ✨ No Inline CSS ✨ TypeScript Strong Typing**
