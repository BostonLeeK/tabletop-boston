"use client";

import {
  createCategory,
  createGame,
  deleteCategory,
  deleteGame,
  getCategories,
  getGames,
  getSession,
  getUser,
  signIn,
  signOut,
  updateCategory,
  updateGame,
  uploadImage,
} from "@/lib/supabase";
import { Category } from "@/types/category";
import { Game } from "@/types/game";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    color: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    shortDescription: "",
    fullDescription: "",
    description: "",
    rating: 4.0,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 60,
    image: "",
    category: "",
    videoUrl: "",
  });

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const session = await getSession();
      if (session) {
        const currentUser = await getUser();
        setUser(currentUser);
        setAuthenticated(true);
        await Promise.all([loadGames(), loadCategories()]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      await checkAuth();
    } catch (err: any) {
      setError(err.message || "Помилка авторизації");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setAuthenticated(false);
      setUser(null);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Помилка виходу");
    }
  };

  const loadGames = async () => {
    setLoading(true);
    try {
      const data = await getGames();
      setGames(data);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Розмір файлу не повинен перевищувати 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Файл повинен бути зображенням");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        setUploadingImage(true);
        const gameId = editingGame?.id || "temp";
        const uploadedUrl = await uploadImage(imageFile, gameId);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          alert("Помилка при завантаженні зображення");
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const gameData = { ...formData, image: imageUrl };

      if (editingGame) {
        await updateGame(editingGame.id, gameData);
      } else {
        const newGame = await createGame(gameData);
        if (newGame && imageFile) {
          const uploadedUrl = await uploadImage(imageFile, newGame.id);
          if (uploadedUrl) {
            await updateGame(newGame.id, { image: uploadedUrl });
          }
        }
      }
      await loadGames();
      resetForm();
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Помилка при збереженні гри");
      setUploadingImage(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      nameEn: game.nameEn || "",
      shortDescription: game.shortDescription || "",
      fullDescription: game.fullDescription || "",
      description: game.description,
      rating: game.rating,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      playTime: game.playTime,
      image: game.image || "",
      category: game.category || "",
      videoUrl: game.videoUrl || "",
    });
    setImagePreview(game.image || "");
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю гру?")) {
      return;
    }
    try {
      await deleteGame(id);
      await loadGames();
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Помилка при видаленні гри");
    }
  };

  const resetForm = () => {
    setEditingGame(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      name: "",
      nameEn: "",
      shortDescription: "",
      fullDescription: "",
      description: "",
      rating: 4.0,
      minPlayers: 2,
      maxPlayers: 4,
      playTime: 60,
      image: "",
      category: "",
      videoUrl: "",
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryFormData);
      } else {
        await createCategory(categoryFormData);
      }
      await loadCategories();
      setEditingCategory(null);
      setCategoryFormData({ name: "", color: "" });
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Помилка при збереженні категорії");
    }
  };

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      color: category.color || "",
    });
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю категорію?")) {
      return;
    }
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Помилка при видаленні категорії");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">Завантаження...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-display text-white mb-6 text-center">
            Адмін-панель
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                placeholder="your@email.com"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Пароль
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                placeholder="Введіть пароль"
                minLength={6}
              />
            </div>
            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Увійти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-800/50 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display text-white">Адмін-панель</h1>
              {user && (
                <p className="text-sm text-neutral-400 mt-1">{user.email}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                На головну
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              setShowCategories(false);
              setShowForm(false);
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
              !showCategories && !showForm
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            }`}
          >
            Всі ігри
          </button>
          <button
            onClick={() => {
              setShowCategories(false);
              resetForm();
              setShowForm(true);
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
              !showCategories && showForm
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            }`}
          >
            + Додати гру
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setShowCategories(true);
              setEditingCategory(null);
              setCategoryFormData({ name: "", color: "" });
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
              showCategories
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            }`}
          >
            Керування категоріями
          </button>
        </div>

        {!showCategories && showForm && (
          <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-heading text-white mb-4">
              {editingGame ? "Редагувати гру" : "Нова гра"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Назва
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Назва англійською
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                    placeholder="English name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Категорія
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  >
                    <option value="">Оберіть категорію</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.name}
                        className="bg-neutral-800"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Рейтинг (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Зображення
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg border border-neutral-700"
                      />
                    </div>
                  )}
                  {formData.image && !imageFile && (
                    <div className="mt-4">
                      <p className="text-xs text-neutral-500 mb-2">
                        Поточне зображення:
                      </p>
                      <img
                        src={formData.image}
                        alt="Current"
                        className="max-w-full h-48 object-cover rounded-lg border border-neutral-700"
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <p className="mt-2 text-sm text-neutral-400">
                      Завантаження...
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Мін. гравців
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minPlayers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minPlayers: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Макс. гравців
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.maxPlayers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxPlayers: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Час гри (хвилин)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.playTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        playTime: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Короткий опис (для картки)
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  placeholder="Короткий опис, який відображається на картці гри"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Повний опис
                </label>
                <textarea
                  required
                  value={formData.fullDescription || formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullDescription: e.target.value,
                      description: e.target.value,
                    })
                  }
                  rows={6}
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  placeholder="Детальний опис гри"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  URL відео огляду (YouTube, Vimeo тощо)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingGame ? "Зберегти зміни" : "Створити"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        )}

        {showCategories && (
          <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-heading text-white mb-4">
              {editingCategory ? "Редагувати категорію" : "Нова категорія"}
            </h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Назва категорії
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Колір (hex, наприклад: #9333ea)
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.color}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        color: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                    placeholder="#9333ea"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingCategory ? "Зберегти зміни" : "Створити"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryFormData({ name: "", color: "" });
                  }}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="text-lg font-heading text-white">
                Всі категорії ({categories.length})
              </h3>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  Немає категорій. Додайте першу категорію!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {category.color && (
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <span className="text-white font-medium">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCategoryEdit(category)}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleCategoryDelete(category.id)}
                          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!showCategories && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-white mb-4">
              Всі ігри ({games.length})
            </h2>
            {games.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                Немає ігор. Додайте першу гру!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-heading text-white">
                        {game.name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(game)}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDelete(game.id)}
                          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-400 mb-2 line-clamp-2">
                      {game.description}
                    </p>
                    <div className="text-xs text-neutral-500">
                      Рейтинг: {game.rating} | {game.minPlayers}-
                      {game.maxPlayers} гравців | {game.playTime} хв
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
