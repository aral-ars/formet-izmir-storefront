import { Heart } from 'lucide-react';

interface LikeButtonProps {
  isLiked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export function LikeButton({ isLiked, onClick, className = '' }: LikeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full glass shadow-lg transition-all duration-500 z-10 cursor-pointer ${
        isLiked
          ? 'opacity-100 translate-y-0 text-red-500 hover:scale-110 active:scale-95'
          : 'opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 text-earth-dark hover:text-red-500 hover:scale-110 active:scale-95'
      } ${className}`}
    >
      <Heart className="w-4 h-4 md:w-4 md:h-4" fill={isLiked ? "currentColor" : "none"} />
    </button>
  );
}
