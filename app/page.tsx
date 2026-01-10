"use client";

import GameList from "@/components/GameList";
import { getCategories, getGames } from "@/lib/supabase";
import { Category } from "@/types/category";
import { Game } from "@/types/game";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "name" | "playTime">(
    "rating"
  );
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesData, categoriesData] = await Promise.all([
          getGames(),
          getCategories(),
        ]);
        setGames(gamesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAndSortedGames = useMemo(() => {
    let filtered: Game[] = games;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.nameEn?.toLowerCase().includes(query) ||
          game.shortDescription?.toLowerCase().includes(query) ||
          game.fullDescription?.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query)
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((game) => game.category === filterCategory);
    }

    if (showFavoritesOnly) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      filtered = filtered.filter(
        (game) => game.isFavorite || favorites.includes(game.id)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name, "uk");
        case "playTime":
          return a.playTime - b.playTime;
        default:
          return 0;
      }
    });

    return sorted;
  }, [games, searchQuery, sortBy, filterCategory, showFavoritesOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="md:sticky top-0 z-50 border-b border-neutral-800/50 overflow-hidden">
        <div className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.squarespace-cdn.com/content/v1/59230491cd0f6848c4b2f9f5/1746197104478-MZP751BI5Q7OA8DCVDV6/InterstellarAdventuresKickstarterGraphic.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/80 to-neutral-950/90"></div>
            <div className="absolute inset-0 bg-neutral-950/40"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <h1 className="text-5xl md:text-6xl font-display text-white mb-3 drop-shadow-lg">
              Моя колекція настільних ігор
            </h1>
            <p className="text-neutral-300 text-lg font-body font-light drop-shadow-md">
              Можемо зіграти разом!
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="mb-12 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Пошук ігор..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 focus:bg-neutral-900 transition-colors text-sm"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-700 focus:bg-neutral-900 transition-colors text-sm"
            >
              <option value="">Всі категорії</option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.name}
                  className="bg-neutral-900"
                >
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "rating" | "name" | "playTime")
              }
              className="px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-700 focus:bg-neutral-900 transition-colors text-sm"
            >
              <option value="rating" className="bg-neutral-900">
                За рейтингом
              </option>
              <option value="name" className="bg-neutral-900">
                За назвою
              </option>
              <option value="playTime" className="bg-neutral-900">
                За часом гри
              </option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showFavoritesOnly"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-neutral-900 border-neutral-700 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label
              htmlFor="showFavoritesOnly"
              className="text-sm text-neutral-400 cursor-pointer"
            >
              Тільки улюблені
            </label>
          </div>
          <div className="text-sm text-neutral-500 font-medium">
            Знайдено ігор:{" "}
            <span className="text-neutral-300">
              {filteredAndSortedGames.length}
            </span>
          </div>
        </div>

        <GameList games={filteredAndSortedGames} />
      </main>
    </div>
  );
}
