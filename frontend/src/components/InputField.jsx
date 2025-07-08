const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      required
    />
    {error && (
      <p id={`${name}-error`} className="text-red-600 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);

export default InputField;
