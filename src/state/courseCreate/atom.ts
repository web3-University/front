import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { defaultCourseFormState, type CourseFormData } from "./types";

export const COURSE_DRAFT_STORAGE_KEY = "course_draft";

export const courseFormAtom = atomWithStorage<CourseFormData>(
  COURSE_DRAFT_STORAGE_KEY,
  defaultCourseFormState,
);

export const courseErrorsAtom = atom<Record<string, string>>({});

export const courseLoadingAtom = atom(false);
