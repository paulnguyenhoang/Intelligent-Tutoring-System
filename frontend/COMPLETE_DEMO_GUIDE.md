# Complete Demo Flow - Intelligent Tutoring System

## Tổng quan 6 giao diện

Hệ thống đã hoàn thiện **6 giao diện chính** để demo đầy đủ 2 module:

### 🔐 Authentication (2 giao diện)

1. **Sign In** (`/signin`) - Đăng nhập với role
2. **Sign Up** (`/signup`) - Đăng ký tài khoản

### 👨‍🏫 Teacher Module - Learning Content Management (2 giao diện)

3. **Course Management** (`/teacher`) - Quản lý bài giảng
   - Tạo/Xem/Sửa/Xóa bài giảng
   - Hỗ trợ YouTube embed
4. **Quiz Management** (`/teacher/quiz`) - Quản lý quiz
   - Tạo/Xem/Sửa/Xóa quiz
   - Thêm/xóa câu hỏi động

### 👨‍🎓 Student Module - Assessment System (2 giao diện)

5. **Courses View** (`/courses`) - Xem bài giảng
   - Xem danh sách bài giảng
   - Xem chi tiết với YouTube player
6. **Take Quiz** (`/quiz`) - Làm quiz & xem kết quả
   - Chọn quiz từ danh sách
   - Làm bài với progress tracking
   - Xem kết quả sau khi submit

---

## 🎬 Script Demo Hoàn Chỉnh

### Phase 1: Đăng ký & Đăng nhập

#### 1.1 Đăng ký tài khoản Teacher

```
1. Mở http://localhost:5174/
2. Click "Sign up"
3. Nhập:
   - Username: teacher1
   - Password: 123456
   - Role: Teacher (Giáo viên)
4. Click "Sign up"
→ Tự động đăng nhập và chuyển đến /teacher
```

#### 1.2 Đăng ký tài khoản Student

```
1. Click "Logout" (menu trên)
2. Click "Sign up"
3. Nhập:
   - Username: student1
   - Password: 123456
   - Role: Student (Học sinh)
4. Click "Sign up"
→ Tự động đăng nhập và chuyển đến /courses
```

---

### Phase 2: Teacher - Quản lý Bài giảng (Module 1)

#### 2.1 Tạo bài giảng

```
1. Đăng nhập với teacher1
2. Vào menu "Courses"
3. Click "Create Course"
4. Nhập:
   - Title: Introduction to React
   - Description: Learn React fundamentals
   - Content: https://www.youtube.com/watch?v=SqcY0GlETPk
5. Click "OK"
→ Bài giảng xuất hiện trong danh sách
```

#### 2.2 Xem chi tiết bài giảng

```
1. Click nút "View" ở bài giảng vừa tạo
→ Modal hiển thị với YouTube video embed
```

#### 2.3 Sửa bài giảng

```
1. Click nút "Edit"
2. Thay đổi:
   - Description: Master React basics in 1 hour
3. Click "OK"
→ Bài giảng được cập nhật
```

#### 2.4 Tạo thêm bài giảng

```
Tạo 2 bài nữa:

Bài 2:
- Title: TypeScript Basics
- Description: Learn TypeScript for React
- Content: https://www.youtube.com/watch?v=d56mG7DezGs

Bài 3:
- Title: Ant Design Components
- Description: UI library for React
- Content: Build beautiful UIs with pre-made components
```

---

### Phase 3: Teacher - Quản lý Quiz (Module 2)

#### 3.1 Tạo quiz đầu tiên

```
1. Vào menu "Quizzes"
2. Click "Create Quiz"
3. Nhập:
   - Quiz Title: React Fundamentals Quiz

   Question 1:
   - Question: What is React?
   - Options (one per line):
     Framework
     Library
     Language
     Database
   - Correct Answer Index: 1

   Click "+ Add Question"

   Question 2:
   - Question: What is JSX?
   - Options:
     JavaScript XML
     Java Syntax
     JSON Extension
     JavaScript Expression
   - Correct Answer Index: 0

   Click "+ Add Question"

   Question 3:
   - Question: Which hook manages state?
   - Options:
     useEffect
     useState
     useContext
     useRef
   - Correct Answer Index: 1

4. Click "OK"
→ Quiz được tạo với 3 câu hỏi
```

#### 3.2 Xem chi tiết quiz

```
1. Click nút "View" ở quiz vừa tạo
→ Modal hiển thị tất cả câu hỏi với đáp án đúng highlight màu xanh
```

#### 3.3 Tạo quiz thứ hai

```
1. Click "Create Quiz"
2. Nhập:
   - Quiz Title: TypeScript Advanced Quiz

   Question 1:
   - Question: What is TypeScript?
   - Options:
     JavaScript with types
     New language
     Framework
     Library
   - Correct Answer Index: 0

   Question 2:
   - Question: What is an interface?
   - Options:
     Class
     Type definition
     Function
     Variable
   - Correct Answer Index: 1

3. Click "OK"
```

#### 3.4 Sửa quiz

```
1. Click nút "Edit" ở quiz đầu tiên
2. Thay đổi title: "React Fundamentals - Final Exam"
3. Thêm câu hỏi thứ 4:
   - Question: What is a component?
   - Options:
     Function or Class
     Variable
     Object
     Array
   - Correct Answer Index: 0
4. Click "OK"
→ Quiz được cập nhật với 4 câu hỏi
```

---

### Phase 4: Student - Xem Bài giảng

#### 4.1 Đăng nhập Student

```
1. Click "Logout"
2. Click "Sign in"
3. Nhập:
   - Username: student1
   - Password: 123456
   - Role: Student (Học sinh)
4. Click "Sign in"
→ Chuyển đến trang Courses
```

#### 4.2 Xem danh sách bài giảng

```
1. Vào menu "Courses" (nếu chưa ở đó)
→ Hiển thị grid 3 bài giảng do teacher tạo
```

#### 4.3 Xem chi tiết bài giảng có video

```
1. Click "View Course" ở bài "Introduction to React"
→ Modal hiển thị với YouTube video player embedded
2. Click play để xem video
3. Click "Close" để đóng modal
```

#### 4.4 Xem bài giảng text

```
1. Click "View Course" ở bài "Ant Design Components"
→ Modal hiển thị nội dung text
```

---

### Phase 5: Student - Làm Quiz

#### 5.1 Vào trang làm quiz

```
1. Vào menu "Take Quiz"
→ Hiển thị quiz selector với 2 quiz available
```

#### 5.2 Làm quiz đầu tiên (sai một số câu)

```
1. Select "React Fundamentals - Final Exam"
2. Trả lời:
   - Question 1: Chọn đáp án sai (Framework)
   - Question 2: Chọn đáp án đúng (JavaScript XML)
   - Question 3: Chọn đáp án đúng (useState)
   - Question 4: Chọn đáp án đúng (Function or Class)
3. Click "Submit"
→ Chuyển đến trang Result hiển thị: 3/4 (75%)
```

#### 5.3 Validation test (không trả lời hết)

```
1. Click "Take Another Quiz"
2. Select "TypeScript Advanced Quiz"
3. Chỉ trả lời Question 1
4. Click "Submit"
→ Warning message: "Please answer all questions! 1 question(s) remaining."
```

#### 5.4 Làm quiz hoàn chỉnh (đạt 100%)

```
1. Trả lời đủ cả 2 câu hỏi:
   - Question 1: JavaScript with types
   - Question 2: Type definition
2. Click "Submit"
→ Result: 2/2 (100%)
```

#### 5.5 Progress tracking

```
Khi làm quiz, quan sát:
- Title card hiển thị "Progress: X / Y"
- Số này tăng dần khi chọn đáp án
```

---

## ✅ Checklist Demo

### Authentication

- [x] Sign up Teacher
- [x] Sign up Student
- [x] Sign in/Sign out
- [x] Role-based navigation

### Teacher - Course Management

- [x] Create course với YouTube link
- [x] Create course với text content
- [x] View course details
- [x] Edit course
- [x] Delete course

### Teacher - Quiz Management

- [x] Create quiz với nhiều câu hỏi
- [x] Add/Remove questions động
- [x] View quiz với đáp án đúng highlighted
- [x] Edit quiz (thêm/sửa câu hỏi)
- [x] Delete quiz

### Student - Courses

- [x] View danh sách courses
- [x] View course với YouTube embed
- [x] View course với text content
- [x] Grid layout responsive

### Student - Quiz

- [x] Select quiz từ dropdown
- [x] Answer all questions
- [x] Validation (must answer all)
- [x] Progress tracking
- [x] Submit và xem result
- [x] Retry quiz

---

## 🎯 Điểm nhấn khi Demo

1. **Clean Architecture**

   - Không có inline CSS
   - Sử dụng module.less cho từng component
   - Tailwind cho utility classes

2. **TypeScript Strong Typing**

   - Tất cả types được định nghĩa trong `types/index.ts`
   - Type-only imports khi cần

3. **Service Pattern**

   - courseService.ts - CRUD courses
   - quizService.ts - CRUD quizzes + evaluate

4. **Custom Hooks**

   - useAuth - authentication logic
   - useLocalStorage - persistent storage

5. **Role-Based Access Control**

   - ProtectedRoute component
   - Menu items theo role
   - Redirect tự động

6. **User Experience**
   - Form validation
   - Loading states
   - Empty states
   - Confirm dialogs
   - Success/Error messages
   - Progress indicators

---

## 📊 Technical Highlights

### Folder Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components (6 pages)
├── hooks/          # Custom hooks
├── services/       # Business logic & API
├── types/          # TypeScript definitions
├── constants/      # App constants
├── utils/          # Helper functions
└── styles/         # Global styles
```

### Data Flow

```
User Action → Component → Service → localStorage
                ↓
          Update State → Re-render
```

### Key Technologies

- **Frontend**: React 19 + TypeScript 5.9
- **UI**: Ant Design 6.0 + Tailwind CSS
- **Routing**: React Router v6
- **Build**: Vite 7.2
- **Styling**: Less + CSS Modules

---

## 🚀 Quick Start for Demo

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5174/

**Demo accounts:**

- Teacher: `teacher1` / `123456`
- Student: `student1` / `123456`

**Demo data flow:**

1. Teacher creates courses & quizzes
2. Student views courses & takes quizzes
3. System evaluates and shows results

---

## 📝 Notes

- Data stored in localStorage (keys: `its_user`, `its_users`, `its_courses`, `its_quizzes`)
- No backend required
- Refresh page preserves data
- YouTube links auto-detected and embedded
- Quiz validation prevents empty submissions
