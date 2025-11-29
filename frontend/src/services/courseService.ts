import { Course } from "../types";
import { STORAGE_KEYS } from "../constants";
import { parseJSON } from "../utils";

function read(): Course[] {
  const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
  return parseJSON(raw, []);
}

function write(items: Course[]) {
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(items));
}

export function getCourses(): Course[] {
  return read();
}

export function createCourse(payload: Omit<Course, "id">): Course {
  const items = read();
  const id = Date.now().toString();
  const course: Course = { id, ...payload };
  items.unshift(course);
  write(items);
  return course;
}

export function updateCourse(id: string, patch: Partial<Course>) {
  const items = read();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  write(items);
  return items[idx];
}

export function deleteCourse(id: string) {
  const items = read();
  const ret = items.filter((c) => c.id !== id);
  write(ret);
}
