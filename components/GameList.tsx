import { Game } from '@/types/game';
import GameCard from './GameCard';

interface GameListProps {
  games: Game[];
}

export default function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 text-base font-medium">Ігор не знайдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

