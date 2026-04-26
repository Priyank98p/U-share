import { useCallback, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

function ImageUploadDropzone({ maxImages = 5, onImagesChange, className }) {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Optional: add validation for file type/size here

    const newPreviews = files.slice(0, maxImages - previews.length).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    if (onImagesChange) {
      onImagesChange(updatedPreviews.map(p => p.file));
    }
  }, [previews, maxImages, onImagesChange]);

  const removeImage = (indexToRemove) => {
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(updatedPreviews);
    if (onImagesChange) {
      onImagesChange(updatedPreviews.map(p => p.file));
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {previews.length < maxImages && (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
            <p className="mb-2 text-sm text-slate-500 font-medium">
              <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400">SVG, PNG, JPG or WEBP (Max {maxImages} images)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
              <img 
                src={preview.url} 
                alt={`Preview ${index}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-slate-900/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUploadDropzone;
