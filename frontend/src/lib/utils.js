// Basic cn utility to combine class names, replacing clsx and tailwind-merge
// WARNING: This does NOT resolve Tailwind class conflicts (e.g. p-4 vs p-2)
export function cn(...inputs) {
    return inputs.filter(Boolean).join(" ")
}