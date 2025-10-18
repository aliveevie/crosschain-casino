import React from "react";

interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'blue' | 'green' | 'red';
  text?: string;
  className?: string;
}

export function NexusLoadingSpinner({ 
  size = 'md', 
  color = 'purple', 
  text,
  className = '' 
}: Props) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-transparent rounded-full animate-spin ${colorClasses[color]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export function NexusLoadingOverlay({ 
  isVisible, 
  text = "Loading..." 
}: { 
  isVisible: boolean; 
  text?: string; 
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-purple-500/50 rounded-lg p-6 shadow-2xl">
        <NexusLoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}
