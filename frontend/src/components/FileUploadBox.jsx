const FileUploadBox = ({ label, file, onFileChange, onRemove, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {!file ? (
        <label className="flex flex-col border-2 border-dashed border-gray-300 rounded-md w-full py-6 hover:border-blue-400 cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500">Click to browse or drag file here</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onFileChange(e.target.files[0])}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex justify-between items-center border border-green-300 bg-green-50 rounded-md px-4 py-2">
          <span className="text-green-700 text-sm truncate">✅ {file.name}</span>
          <span
            onClick={onRemove}
            className="text-xl text-red-500 hover:text-red-700 cursor-pointer ml-4"
            title="Remove file"
          >
            ✖
          </span>
        </div>
      )}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FileUploadBox;
