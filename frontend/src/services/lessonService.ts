import { STORAGE_KEYS } from "../constants";
import { parseJSON } from "../utils";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  type: "VIDEO" | "PDF" | "WORD";
  content: string; // URL (Blob URL or Link)
  duration: string;
  fileName?: string;
}

function read(): Lesson[] {
  const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
  return parseJSON(raw, []);
}

function write(items: Lesson[]) {
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(items));
}

export function getLessonsByCourse(courseId: string): Lesson[] {
  const allLessons = read();
  return allLessons.filter((lesson) => lesson.courseId === courseId);
}

export function createLesson(payload: Omit<Lesson, "id">): Lesson {
  const items = read();
  const id = Date.now().toString();
  const lesson: Lesson = { id, ...payload };
  items.push(lesson);
  write(items);
  return lesson;
}

export function updateLesson(id: string, patch: Partial<Lesson>) {
  const items = read();
  const idx = items.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  write(items);
  return items[idx];
}

export function deleteLesson(id: string) {
  const items = read();
  const ret = items.filter((l) => l.id !== id);
  write(ret);
}
