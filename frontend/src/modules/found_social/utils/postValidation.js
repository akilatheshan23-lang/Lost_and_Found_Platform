export function hasLetters(value = "") {
  return /\p{L}/u.test(String(value));
}

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateTodayOrPastDate(value, label = "Date") {
  const normalized = String(value || "").trim();

  if (!normalized) return `${label} is required.`;
  if (normalized > getTodayDateString()) return `${label} cannot be a future date.`;

  return "";
}

export function validateTextField(value, label, minLength = 2) {
  const normalized = String(value || "").trim();

  if (!normalized) return `${label} is required.`;
  if (normalized.length < minLength) return `${label} must be at least ${minLength} characters.`;
  if (!hasLetters(normalized)) return `${label} must include letters and cannot be only numbers.`;

  return "";
}

export function validateFoundPost(form) {
  return {
    title: validateTextField(form.title, "Item name", 2),
    description: validateTextField(form.description, "Description", 5),
    date: validateTodayOrPastDate(form.date, "Found date"),
  };
}

export function validateSocialPost(form) {
  return {
    title: validateTextField(form.title, "Title", 2),
    content: validateTextField(form.content, "Content", 3),
  };
}

export function hasValidationErrors(errors = {}) {
  return Object.values(errors).some(Boolean);
}
