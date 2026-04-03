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

export function validateTextField(value, label, minLength = 2, maxLength = 200) {
  const normalized = String(value || "").trim();

  if (!normalized) return `${label} is required.`;
  if (normalized.length < minLength) return `${label} must be at least ${minLength} characters.`;
  if (normalized.length > maxLength) return `${label} must be less than ${maxLength} characters.`;
  if (!hasLetters(normalized)) return `${label} must include letters and cannot be only numbers.`;

  return "";
}

export function validateImageUrl(value, required = false) {
  const normalized = String(value || "").trim();

  if (!normalized) return required ? "Image URL is required." : "";

  const ok = /^https?:\/\/.+/i.test(normalized);
  if (!ok) return "Image URL must start with http:// or https://";

  return "";
}

export function validateTagsText(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return "";

  const tags = normalized
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tags.length > 10) return "You can add up to 10 tags only.";

  for (const tag of tags) {
    if (tag.length < 2) return "Each tag must be at least 2 characters.";
    if (tag.length > 20) return "Each tag must be less than 20 characters.";
  }

  return "";
}

export function validateFoundPost(form) {
  return {
    title: validateTextField(form.title, "Item name", 2, 80),
    description: validateTextField(form.description, "Description", 5, 500),
    date: validateTodayOrPastDate(form.date, "Found date"),
  };
}

export function validateSocialPost(form, options = {}) {
  const { requirePostType = false, imageMode = "upload" } = options;
  const postType = String(form?.postType || "").trim();

  return {
    postType: requirePostType && !postType ? "Post type is required." : "",
    title: validateTextField(form?.title, "Title", 2, 80),
    content: validateTextField(form?.content, "Content", 3, 1000),
    imageUrl: imageMode === "url" ? validateImageUrl(form?.imageUrl, false) : "",
    tagsText: validateTagsText(form?.tagsText),
  };
}

export function hasValidationErrors(errors = {}) {
  return Object.values(errors).some(Boolean);
}