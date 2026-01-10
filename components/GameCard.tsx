import { Game } from '@/types/game';
import Link from 'next/link';

interface GameCardProps {
  game: Game;
}

function Star({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <div className="relative w-3.5 h-3.5 inline-block">
        <svg
          className="absolute w-3.5 h-3.5 text-neutral-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <svg
          className="absolute w-3.5 h-3.5 text-amber-500 overflow-hidden"
          style={{ width: '50%' }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
    );
  }

  return (
    <svg
      className={`w-3.5 h-3.5 ${filled ? 'text-amber-500' : 'text-neutral-700'}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function getCategoryColor(category: string | undefined) {
  const colors: Record<string, string> = {
    'Стратегія': 'text-purple-400 border-purple-400/20 bg-purple-400/10',
    'Сімейна': 'text-blue-400 border-blue-400/20 bg-blue-400/10',
    'Природа': 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
    'Кооперативна': 'text-rose-400 border-rose-400/20 bg-rose-400/10',
    'Абстрактна': 'text-amber-400 border-amber-400/20 bg-amber-400/10',
    'Економічна': 'text-green-400 border-green-400/20 bg-green-400/10',
    'Військова': 'text-red-400 border-red-400/20 bg-red-400/10',
    'Детективна': 'text-indigo-400 border-indigo-400/20 bg-indigo-400/10',
    'Фентезі': 'text-violet-400 border-violet-400/20 bg-violet-400/10',
    'Наукова фантастика': 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10',
  };
  return colors[category || ''] || 'text-neutral-400 border-neutral-400/20 bg-neutral-400/10';
}

function getGameImage(gameId: string, gameName: string, category: string | undefined): string {
  const imageMap: Record<string, string> = {
    '1': 'https://images.unsplash.com/photo-1606166188517-4a72c90e49da?w=800&h=600&fit=crop&q=80',
    '2': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80',
    '3': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80',
    '4': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&q=80',
    '5': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&q=80',
    '6': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&q=80',
  };
  
  return imageMap[gameId] || generateGradientImage(gameName, category);
}

function generateGradientImage(gameName: string, category: string | undefined): string {
  const gradients: Record<string, string> = {
    'Стратегія': 'from-purple-600 via-indigo-700 to-purple-800',
    'Сімейна': 'from-blue-500 via-cyan-600 to-blue-700',
    'Природа': 'from-emerald-500 via-teal-600 to-green-700',
    'Кооперативна': 'from-rose-500 via-pink-600 to-red-700',
    'Абстрактна': 'from-amber-500 via-orange-600 to-yellow-700',
    'Економічна': 'from-green-600 via-emerald-700 to-teal-800',
    'Військова': 'from-red-600 via-rose-700 to-red-800',
    'Детективна': 'from-indigo-600 via-purple-700 to-indigo-800',
    'Фентезі': 'from-violet-600 via-purple-700 to-violet-800',
    'Наукова фантастика': 'from-cyan-600 via-blue-700 to-cyan-800',
  };
  
  const gradient = gradients[category || ''] || 'from-neutral-700 via-neutral-800 to-neutral-900';
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:%23${getGradientColors(gradient).start};stop-opacity:1" />
          <stop offset="50%" style="stop-color:%23${getGradientColors(gradient).mid};stop-opacity:1" />
          <stop offset="100%" style="stop-color:%23${getGradientColors(gradient).end};stop-opacity:1" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(%23grad)"/>
      <rect width="800" height="600" fill="url(%23grid)"/>
      <circle cx="400" cy="300" r="150" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
      <circle cx="400" cy="300" r="100" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    </svg>
  `)}`;
}

function getGradientColors(gradient: string): { start: string; mid: string; end: string } {
  const colorMap: Record<string, { start: string; mid: string; end: string }> = {
    'from-purple-600 via-indigo-700 to-purple-800': { start: '9333ea', mid: '6366f1', end: '7e22ce' },
    'from-blue-500 via-cyan-600 to-blue-700': { start: '3b82f6', mid: '0891b2', end: '1d4ed8' },
    'from-emerald-500 via-teal-600 to-green-700': { start: '10b981', mid: '0d9488', end: '15803d' },
    'from-rose-500 via-pink-600 to-red-700': { start: 'f43f5e', mid: 'db2777', end: 'b91c1c' },
    'from-amber-500 via-orange-600 to-yellow-700': { start: 'f59e0b', mid: 'ea580c', end: 'a16207' },
    'from-green-600 via-emerald-700 to-teal-800': { start: '16a34a', mid: '059669', end: '115e59' },
    'from-red-600 via-rose-700 to-red-800': { start: 'dc2626', mid: 'be185d', end: '991b1b' },
    'from-indigo-600 via-purple-700 to-indigo-800': { start: '4f46e5', mid: '7c3aed', end: '3730a3' },
    'from-violet-600 via-purple-700 to-violet-800': { start: '7c3aed', mid: '9333ea', end: '6d28d9' },
    'from-cyan-600 via-blue-700 to-cyan-800': { start: '0891b2', mid: '1d4ed8', end: '155e75' },
    'from-neutral-700 via-neutral-800 to-neutral-900': { start: '404040', mid: '262626', end: '171717' },
  };
  
  return colorMap[gradient] || { start: '404040', mid: '262626', end: '171717' };
}

export default function GameCard({ game }: GameCardProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(game.rating);
    const hasHalfStar = game.rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} filled={true} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" filled={true} half={true} />);
    }

    const emptyStars = 5 - Math.ceil(game.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} filled={false} />);
    }

    return stars;
  };

  return (
    <Link href={`/games/${game.id}`} className="block h-full">
      <div className="group bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-all duration-200 hover:bg-neutral-900 cursor-pointer h-full flex flex-col">
      <div className="h-56 bg-neutral-800/50 flex items-center justify-center relative overflow-hidden flex-shrink-0">
        <img
          src={game.image || getGameImage(game.id, game.name, game.category)}
          alt={game.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getGameImage(game.id, game.name, game.category);
          }}
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-heading text-white truncate">
              {game.name}
            </h3>
            {game.nameEn && (
              <p className="text-xs text-neutral-500 mt-0.5 truncate">{game.nameEn}</p>
            )}
          </div>
          {game.category && (
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded border flex-shrink-0 ml-2 ${getCategoryColor(
                game.category
              )}`}
            >
              {game.category}
            </span>
          )}
        </div>

        <p className="text-neutral-400 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
          {game.shortDescription || game.description}
        </p>

        <div className="flex items-center gap-2 mb-5 flex-shrink-0">
          <div className="flex items-center gap-0.5">
            {renderStars()}
          </div>
          <span className="text-sm font-medium text-neutral-300">
            {game.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {game.minPlayers}-{game.maxPlayers}
          </span>
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {game.playTime} хв
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
}

