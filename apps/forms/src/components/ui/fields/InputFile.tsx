'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormField } from '@/types/form';

interface InputFileProps {
  field: FormField;
  value: string | File[];
  onChange: (name: string, value: File[]) => void;
  error?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export function InputFile({ field, value, onChange, error }: InputFileProps) {
  const { attributes, settings } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Get accepted file types
  const acceptedTypes = attributes.accept || '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif';
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const simulateUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const fileId = Math.random().toString(36).substring(7);
      const uploadFile: UploadedFile = {
        file,
        id: fileId,
        progress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, uploadFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 100) }
              : f
          )
        );
      }, 200);

      // Complete upload after 2-3 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          )
        );
        resolve();
      }, 2000 + Math.random() * 1000);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (max 10MB)`);
        return;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        errors.push(`${file.name} is not an accepted file type`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      // Handle errors (you could show these in the UI)
      console.warn('File upload errors:', errors);
    }

    // Simulate upload for valid files
    for (const file of validFiles) {
      await simulateUpload(file);
    }

    // Update form value
    const allFiles = uploadedFiles
      .filter(f => f.status === 'completed')
      .map(f => f.file)
      .concat(validFiles);
    
    if (attributes.name) {
      onChange(attributes.name, allFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    const remainingFiles = uploadedFiles
      .filter(f => f.id !== fileId && f.status === 'completed')
      .map(f => f.file);
    if (attributes.name) {
      onChange(attributes.name, remainingFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="block font-medium mb-2"
          style={{ 
            fontSize: '17px', 
            fontWeight: 500, 
            color: '#000000' 
          }}
        >
          {label}
          {attributes.required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-out
          ${isDragOver 
            ? 'border-orange-400 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-300 hover:bg-orange-25'
          }
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <motion.div
          animate={{ 
            scale: isDragOver ? 1.1 : 1,
            rotate: isDragOver ? 5 : 0 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg 
            className="w-12 h-12 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: isDragOver ? '#f8981d' : '#9ca3af' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </motion.div>

        <div className="space-y-2">
          <p className="text-lg font-medium" style={{ color: '#000000' }}>
            {isDragOver ? 'Drop files here' : 'Drop files or click to upload'}
          </p>
          <p className="text-sm" style={{ color: '#858b8b' }}>
            Supports: {acceptedTypes.replace(/\./g, '').toUpperCase()} • Max 10MB per file
          </p>
        </div>

        {/* Upload animation overlay */}
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-xl border-2 border-orange-400"
            style={{ backgroundColor: 'rgba(248, 152, 29, 0.1)' }}
          />
        )}
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-medium" style={{ color: '#000000', fontSize: '17px' }}>
              Uploaded Files ({uploadedFiles.length})
            </h4>
            
            {uploadedFiles.map((uploadFile, index) => (
              <motion.div
                key={uploadFile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border"
              >
                {/* File Icon */}
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#f8981d' }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: '#000000' }}>
                    {uploadFile.file.name}
                  </p>
                  <p className="text-sm" style={{ color: '#858b8b' }}>
                    {formatFileSize(uploadFile.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: '#f8981d' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadFile.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#858b8b' }}>
                        {Math.round(uploadFile.progress)}% uploaded
                      </p>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-2">
                  {uploadFile.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#10b981' }}
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}

                  {uploadFile.status === 'uploading' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6"
                    >
                      <svg className="w-6 h-6" style={{ color: '#f8981d' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </motion.div>
                  )}

                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(uploadFile.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {settings.help_message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm"
          style={{ color: '#858b8b' }}
        >
          {settings.help_message}
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}