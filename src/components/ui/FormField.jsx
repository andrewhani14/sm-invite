export function FormField({ label, error, children, optional = false }) {
  return (
    <label className="block space-y-2 text-left">
      <span className="text-sm font-medium text-romance-800">
        {label}
        {optional ? <span className="ml-1 text-romance-500">(Optional)</span> : null}
      </span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  )
}
