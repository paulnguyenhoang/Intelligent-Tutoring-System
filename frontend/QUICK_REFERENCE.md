# 🚀 Quick Reference - ITS Frontend

## Giao diện Overview

| #   | Giao diện         | Route           | Role    | Chức năng      |
| --- | ----------------- | --------------- | ------- | -------------- |
| 1   | Sign In           | `/signin`       | Public  | Đăng nhập      |
| 2   | Sign Up           | `/signup`       | Public  | Đăng ký        |
| 3   | Course Management | `/teacher`      | Teacher | CRUD bài giảng |
| 4   | Quiz Management   | `/teacher/quiz` | Teacher | CRUD quiz      |
| 5   | Courses View      | `/courses`      | Student | Xem bài giảng  |
| 6   | Take Quiz         | `/quiz`         | Student | Làm quiz       |

## Menu Navigation

### Teacher Menu

```
[Courses] [Quizzes] [Logout]
   ↓         ↓
/teacher  /teacher/quiz
```

### Student Menu

```
[Courses] [Take Quiz] [Logout]
   ↓         ↓
/courses   /quiz → /result
```

## Component Hierarchy

```
App (Layout + Menu)
├── SignIn
├── SignUp
├── TeacherDashboard
│   ├── CreateCourseForm (Modal)
│   ├── EditCourseModal
│   ├── CourseDetailModal
│   └── CoursesList
├── TeacherQuizManagement
│   ├── Create Quiz Modal (Form.List)
│   ├── Edit Quiz Modal (Form.List)
│   └── View Quiz Modal
├── StudentCourses
│   └── CourseDetailModal (reuse)
├── TakeQuiz
│   └── Quiz Selector (Select)
└── QuizResult
```

## Data Models

### User

```typescript
{
  username: string
  role: "teacher" | "student"
  password?: string
}
```

### Course

```typescript
{
  id: string           // timestamp
  title: string
  description?: string
  content?: string     // YouTube URL or text
}
```

### Quiz

```typescript
{
  id: string
  title: string
  courseId?: string
  questions: Question[]
}
```

### Question

```typescript
{
  id: string          // "q1", "q2", ...
  text: string
  options: string[]
  answerIndex: number // 0-based index
}
```

## Service Functions

### courseService.ts

```typescript
getCourses(): Course[]
createCourse(course): Course
updateCourse(id, data): void
deleteCourse(id): void
```

### quizService.ts

```typescript
getQuizzes(): Quiz[]
getQuizById(id): Quiz | undefined
createQuiz(quiz): Quiz
updateQuiz(id, data): void
deleteQuiz(id): void
evaluate(quiz, answers): { correct, total }
```

## Custom Hooks

### useAuth

```typescript
const { user, login, logout, getRedirectPath } = useAuth();

login({ username, role, password }); // Set user in localStorage
logout(); // Clear user
getRedirectPath(role); // "/teacher" or "/quiz"
```

### useLocalStorage

```typescript
const [value, setValue] = useLocalStorage<T>(key, initialValue);
// Auto-sync with localStorage
// Handles StorageEvent for cross-tab sync
```

## Constants

### STORAGE_KEYS

```typescript
USER: "its_user";
USERS: "its_users";
COURSES: "its_courses";
QUIZZES: "its_quizzes";
```

### ROUTES

```typescript
HOME: "/";
SIGN_IN: "/signin";
SIGN_UP: "/signup";
TEACHER: "/teacher";
TEACHER_QUIZ: "/teacher/quiz";
COURSES: "/courses";
QUIZ: "/quiz";
RESULT: "/result";
```

## Styling Convention

### Tailwind Classes (utility)

```tsx
<div className="min-h-screen">
<Layout className="min-h-screen">
```

### Module Less (component-specific)

```tsx
import styles from "./ComponentName.module.less"
<div className={styles.container}>
```

### Global Less (variables)

```less
// styles.less
@primary-color: #1890ff;
```

## Form Validation Examples

### Sign In

```typescript
rules={[{ required: true, message: "Please enter username" }]}
```

### Quiz Form

```typescript
// Dynamic list validation
<Form.List name="questions">
  {(fields, { add, remove }) =>
    fields.map((field) => <Form.Item name={[field.name, "text"]} rules={[{ required: true }]} />)
  }
</Form.List>
```

## Message Notifications

```typescript
import { message } from "antd";

message.success("Course created!");
message.error("Failed to create course");
message.warning("Please answer all questions!");
```

## Protected Route Pattern

```tsx
<Route
  path="teacher"
  element={
    <ProtectedRoute allowedRole="teacher">
      <TeacherDashboard />
    </ProtectedRoute>
  }
/>
```

## YouTube Detection

```typescript
const isYouTubeLink = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
  return `https://www.youtube.com/embed/${videoId}`;
};
```

## Common Patterns

### Modal with Form

```tsx
const [open, setOpen] = useState(false)
const [form] = Form.useForm()

<Modal open={open} onOk={async () => {
  const values = await form.validateFields()
  // handle submit
  form.resetFields()
  setOpen(false)
}}>
  <Form form={form}>
    {/* form items */}
  </Form>
</Modal>
```

### Empty State

```tsx
{
  items.length === 0 ? <Empty description="No items yet" /> : <List dataSource={items} />;
}
```

### Confirmation Dialog

```tsx
<Popconfirm
  title="Delete this item?"
  onConfirm={() => handleDelete(id)}
  okText="Yes"
  cancelText="No"
>
  <Button danger>Delete</Button>
</Popconfirm>
```

## Quick Debug Checklist

- [ ] Check browser console for errors
- [ ] Check localStorage (F12 → Application → Local Storage)
- [ ] Verify user is logged in (`its_user` exists)
- [ ] Check TypeScript errors (VSCode Problems panel)
- [ ] Verify route protection (try accessing /teacher as student)
- [ ] Test form validation (submit empty forms)
- [ ] Check data persistence (refresh page)

## Performance Tips

✅ Use React.memo for CoursesList
✅ Debounce search inputs
✅ Lazy load routes
✅ Optimize re-renders with useCallback/useMemo
✅ Code splitting with dynamic imports

## Security Notes

⚠️ **Current implementation:**

- Client-side only (no backend)
- Passwords stored in plain text in localStorage
- No JWT tokens
- No session expiry

🔒 **For production:**

- Add backend API
- Hash passwords (bcrypt)
- Use JWT tokens
- Add HTTPS
- Add CSRF protection
- Rate limiting

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

## Build & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## File Size Budget

- Bundle size: < 500KB (gzipped)
- Initial load: < 3s (Fast 3G)
- Time to Interactive: < 5s

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast (WCAG AA)

## Testing Scenarios

1. **Auth Flow**

   - Sign up → Auto login → Logout → Sign in

2. **Teacher Flow**

   - Create course → Edit → View → Delete
   - Create quiz → Add questions → Edit → Delete

3. **Student Flow**

   - View courses → Watch video
   - Select quiz → Answer all → Submit → View result

4. **Edge Cases**
   - Empty states (no courses, no quizzes)
   - Validation errors (empty forms)
   - Incomplete quiz submission
   - Invalid YouTube URLs

## Troubleshooting

**Problem:** Routes not working after refresh
**Solution:** Vite dev server handles SPA routing automatically. For production, configure server for SPA.

**Problem:** Module not found errors
**Solution:** Check barrel exports in `hooks/index.ts`, `types/index.ts`

**Problem:** Type errors after editing types
**Solution:** Restart TypeScript server (Cmd+Shift+P → "Restart TS Server")

**Problem:** Styles not applying
**Solution:** Check `.module.less` import, verify class names

---

📚 **Full Documentation:**

- `COMPLETE_DEMO_GUIDE.md` - Demo script
- `STRUCTURE.md` - Architecture
- `SUMMARY.md` - Project overview
