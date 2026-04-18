export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-romance-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-romance-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-romance-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
