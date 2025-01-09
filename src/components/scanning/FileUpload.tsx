import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUpload: (data: string) => void;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onUpload(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12
        flex flex-col items-center justify-center
        cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
      <p className="text-center text-muted-foreground">
        {isDragActive ? (
          'Drop the files here...'
        ) : (
          <>
            Drag & drop files here, or click to select files
            <br />
            <span className="text-sm">
              Supports: PDF, PNG, JPG, GIF
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default FileUpload;