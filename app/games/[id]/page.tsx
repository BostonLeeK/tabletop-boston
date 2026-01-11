"use client";

import { getGameById } from "@/lib/supabase";
import { Game } from "@/types/game";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Star({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <div className="relative w-4 h-4 inline-block">
        <svg
          className="absolute w-4 h-4 text-neutral-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <svg
          className="absolute w-4 h-4 text-amber-500 overflow-hidden"
          style={{ width: "50%" }}
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
      className={`w-4 h-4 ${filled ? "text-amber-500" : "text-neutral-700"}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function getCategoryColor(category: string | undefined) {
  const colors: Record<string, string> = {
    Стратегія: "text-purple-400 border-purple-400/20 bg-purple-400/10",
    Сімейна: "text-blue-400 border-blue-400/20 bg-blue-400/10",
    Природа: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
    Кооперативна: "text-rose-400 border-rose-400/20 bg-rose-400/10",
    Абстрактна: "text-amber-400 border-amber-400/20 bg-amber-400/10",
    Економічна: "text-green-400 border-green-400/20 bg-green-400/10",
    Військова: "text-red-400 border-red-400/20 bg-red-400/10",
    Детективна: "text-indigo-400 border-indigo-400/20 bg-indigo-400/10",
    Фентезі: "text-violet-400 border-violet-400/20 bg-violet-400/10",
    "Наукова фантастика": "text-cyan-400 border-cyan-400/20 bg-cyan-400/10",
  };
  return (
    colors[category || ""] ||
    "text-neutral-400 border-neutral-400/20 bg-neutral-400/10"
  );
}

function getGameImage(
  gameId: string,
  gameName: string,
  category: string | undefined,
  image?: string
): string {
  if (image) return image;

  const imageMap: Record<string, string> = {
    "1": "https://images.unsplash.com/photo-1606166188517-4a72c90e49da?w=800&h=600&fit=crop&q=80",
    "2": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&q=80",
    "3": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80",
    "4": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&q=80",
    "5": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&q=80",
    "6": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&q=80",
  };

  return (
    imageMap[gameId] ||
    "https://images.unsplash.com/photo-1606166188517-4a72c90e49da?w=800&h=600&fit=crop&q=80"
  );
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);

  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGame() {
      if (!params.id || typeof params.id !== "string") {
        setLoading(false);
        return;
      }

      try {
        const data = await getGameById(params.id);
        if (!data) {
          router.push("/");
          return;
        }
        setGame(data);
      } catch (error) {
        console.error("Error loading game:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">Завантаження...</div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

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

  const videoEmbedUrl = game.videoUrl
    ? getYouTubeEmbedUrl(game.videoUrl)
    : null;

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-800/50 bg-neutral-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Назад до каталогу
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="aspect-[4/3] bg-neutral-800/50 rounded-lg overflow-hidden mb-6">
              <img
                src={getGameImage(
                  game.id,
                  game.name,
                  game.category,
                  game.image
                )}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-display text-white mb-2">
                  {game.name}
                </h1>
                {game.nameEn && (
                  <p className="text-lg text-neutral-500">{game.nameEn}</p>
                )}
              </div>
              {game.category && (
                <span
                  className={`px-3 py-1.5 text-sm font-medium rounded border ${getCategoryColor(
                    game.category
                  )}`}
                >
                  {game.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">{renderStars()}</div>
              <span className="text-lg font-medium text-neutral-300">
                {game.rating.toFixed(1)}
              </span>
            </div>

            <div className={`grid gap-4 mb-8 p-6 bg-neutral-900/50 rounded-lg border border-neutral-800 ${game.language ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <div>
                <div className="text-sm text-neutral-500 mb-1">Гравці</div>
                <div className="text-xl font-heading text-white">
                  {game.minPlayers}-{game.maxPlayers}
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-500 mb-1">Час гри</div>
                <div className="text-xl font-heading text-white">
                  {game.playTime} хв
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-500 mb-1">Рейтинг</div>
                <div className="text-xl font-heading text-white">
                  {game.rating.toFixed(1)}/5
                </div>
              </div>
              {game.language && (
                <div>
                  <div className="text-sm text-neutral-500 mb-1">Мова</div>
                  <div className="text-xl font-heading text-white">
                    {game.language}
                  </div>
                </div>
              )}
            </div>

            {game.shortDescription && (
              <div className="mb-8">
                <p className="text-neutral-300 text-lg leading-relaxed">
                  {game.shortDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        {game.fullDescription && (
          <div className="mb-12">
            <h2 className="text-2xl font-heading text-white mb-4">Опис</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-line">
                {game.fullDescription}
              </p>
            </div>
          </div>
        )}

        {videoEmbedUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-heading text-white mb-4">
              Відео огляд
            </h2>
            <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden">
              <iframe
                src={videoEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
