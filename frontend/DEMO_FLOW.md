# 🎯 Demo Flow - Intelligent Tutoring System

## 📋 **Checklist - Tính năng hoàn thiện:**

### ✅ **Authentication (Sign In / Sign Up)**

- [x] Sign Up với role selection (Teacher/Student)
- [x] Sign In với role selection
- [x] Auto redirect theo role sau đăng nhập
- [x] Logout functionality
- [x] Protected routes theo role

### ✅ **Module 1: Learning Content Management (Teacher)**

- [x] Create Course (Title, Description, Content/YouTube link)
- [x] View Course (Modal với YouTube embed)
- [x] Edit Course (Modal form thay vì prompt)
- [x] Delete Course (với confirmation)
- [x] List Courses (với empty state)

### ✅ **Module 2: Assessment System (Student)**

- [x] Take Quiz (Sample quiz với 3 câu)
- [x] Progress indicator (X/Y questions answered)
- [x] Validation (phải trả lời hết mới submit được)
- [x] Quiz Result (điểm số + phần trăm)
- [x] Retake quiz option

---

## 🎬 **Demo Script - Flow hoàn chỉnh**

### **1️⃣ Sign Up Flow (Teacher)**

```
1. Mở http://localhost:5174/
2. Click "Sign up" trên menu
3. Điền:
   - Username: teacher1
   - Password: 123456
   - Role: Teacher (Giáo viên)
4. Click "Create account"
5. ✅ Tự động redirect về /teacher (Teacher Dashboard)
```

**Kết quả:** Menu chỉ hiện "Teacher Dashboard" + "Logout"

---

### **2️⃣ Teacher Dashboard - CRUD Courses**

#### **Create Course:**

```
1. Click "Create Course" button
2. Điền form:
   - Title: Introduction to React
   - Description: Learn React basics
   - Content: Paste YouTube link hoặc text content
     VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ
3. Click OK
4. ✅ Course xuất hiện trong list
```

#### **View Course:**

```
1. Click "View" trên course vừa tạo
2. ✅ Modal hiện chi tiết + embed YouTube video (nếu là link)
```

#### **Edit Course:**

```
1. Click "Edit" trên course
2. Sửa Title/Description/Content
3. Click OK
4. ✅ Course được update trong list
```

#### **Delete Course:**

```
1. Click "Delete" trên course
2. Confirm "Yes" trong popup
3. ✅ Course bị xóa khỏi list
```

---

### **3️⃣ Logout & Sign Up (Student)**

```
1. Click "Logout" trên menu
2. Redirect về /signin
3. Click "Sign up"
4. Điền:
   - Username: student1
   - Password: 123456
   - Role: Student (Học sinh)
5. Click "Create account"
6. ✅ Tự động redirect về /quiz
```

**Kết quả:** Menu chỉ hiện "Take Quiz" + "Logout"

---

### **4️⃣ Take Quiz Flow**

```
1. Đọc câu hỏi (3 câu sample)
2. Chọn đáp án (Radio buttons)
3. ✅ Progress hiển thị: "Progress: 1/3"
4. Thử click "Submit" khi chưa trả lời hết
   → ❌ Warning: "Please answer all questions! X question(s) remaining"
5. Trả lời hết 3 câu
6. Click "Submit"
7. ✅ Redirect về /result
```

---

### **5️⃣ Quiz Result**

```
1. Xem điểm: "2 / 3"
2. Xem phần trăm: "Your score: 67%"
3. Click "Take Another Quiz"
4. ✅ Quay lại /quiz để làm lại
```

---

## 🎨 **UI/UX Highlights**

### **Clean Design:**

- ✅ No inline CSS (dùng module.less)
- ✅ Ant Design components
- ✅ Tailwind utilities cho layout
- ✅ Responsive design

### **User Experience:**

- ✅ Loading states (Ant Design defaults)
- ✅ Empty states ("No courses yet...")
- ✅ Validation messages
- ✅ Confirmation dialogs
- ✅ Progress indicators

### **Role-Based Access:**

- ✅ Teacher → chỉ thấy Teacher Dashboard
- ✅ Student → chỉ thấy Take Quiz
- ✅ Protected routes với redirect
- ✅ Menu động theo role

---

## 🧪 **Test Scenarios**

### **Test 1: Role Protection**

```
1. Đăng nhập Teacher
2. Manually gõ URL: http://localhost:5174/quiz
3. ✅ Tự động redirect về /teacher
```

### **Test 2: Quiz Validation**

```
1. Đăng nhập Student
2. Vào /quiz
3. Chỉ chọn 1/3 câu
4. Click Submit
5. ✅ Warning message xuất hiện
```

### **Test 3: Course YouTube Embed**

```
1. Đăng nhập Teacher
2. Create course với YouTube link
3. Click "View"
4. ✅ Video embed hiển thị trong modal
```

### **Test 4: Logout & Session**

```
1. Đăng nhập (Teacher hoặc Student)
2. Refresh trang
3. ✅ Vẫn giữ session (menu đúng)
4. Click Logout
5. ✅ Clear session, redirect /signin
```

---

## 📊 **Data Storage (localStorage)**

### **Keys:**

- `its_user` - Current logged-in user
- `its_users` - Registry of all users
- `its_courses` - List of courses

### **Sample Data:**

```json
// its_user
{
  "username": "teacher1",
  "role": "teacher"
}

// its_courses
[
  {
    "id": "1732867200000",
    "title": "React Basics",
    "description": "Learn React",
    "content": "https://youtube.com/..."
  }
]
```

---

## 🚀 **Quick Start Demo**

### **Chuẩn bị:**

```bash
cd frontend
npm install
npm run dev
```

### **Demo 5 phút:**

1. **0:00-1:00** - Sign up Teacher → Create 2 courses
2. **1:00-2:00** - View/Edit/Delete courses
3. **2:00-2:30** - Logout → Sign up Student
4. **2:30-4:00** - Take quiz (demo validation)
5. **4:00-5:00** - Submit → View result → Retake

---

## 🎯 **Key Features Đủ Điểm**

### **Module 1: CMS (Teacher)**

✅ CRUD hoàn chỉnh
✅ YouTube embed
✅ Empty states
✅ Clean UI

### **Module 2: Assessment (Student)**

✅ Quiz với validation
✅ Progress tracking
✅ Result display
✅ Retake option

### **Bonus:**

✅ Role-based access control
✅ Protected routes
✅ Clean architecture (hooks, types, constants)
✅ No inline CSS
✅ TypeScript strong typing

---

**🎉 READY TO DEMO! 🎉**
