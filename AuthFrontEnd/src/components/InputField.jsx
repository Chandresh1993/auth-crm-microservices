const InputField = ({ label, type = "text", name, placeholder, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg  outline-none "
      
      />
    </div>
  );
  
  export default InputField;
  