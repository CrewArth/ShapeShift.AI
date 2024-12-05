'use client';

interface LoadingSpinnerProps {
  size?: number;
  progress?: number;
  message?: string;
}

export const LoadingSpinner = ({ size = 24, progress, message }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin" style={{ width: size, height: size }}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {message && (
        <p className="text-[var(--text-primary)] text-center">{message}</p>
      )}
    </div>
  );
} 