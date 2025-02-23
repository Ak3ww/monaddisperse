// components/ui/textarea.js

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
