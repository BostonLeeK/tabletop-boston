import { Category } from "@/types/category";
import { Game } from "@/types/game";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function mapGameFromDb(row: any): Game {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    description: row.description,
    rating: row.rating,
    minPlayers: row.min_players,
    maxPlayers: row.max_players,
    playTime: row.play_time,
    image: row.image,
    category: row.categories?.name || row.category,
    videoUrl: row.video_url,
    isFavorite: row.is_favorite || false,
    language: row.language,
  };
}

async function mapGameToDb(game: Omit<Game, "id"> | Partial<Game>) {
  const dbGame: any = {};
  if (game.name !== undefined) dbGame.name = game.name;
  if (game.nameEn !== undefined) dbGame.name_en = game.nameEn;
  if (game.shortDescription !== undefined)
    dbGame.short_description = game.shortDescription;
  if (game.fullDescription !== undefined)
    dbGame.full_description = game.fullDescription;
  if (game.description !== undefined) dbGame.description = game.description;
  if (game.rating !== undefined) dbGame.rating = game.rating;
  if (game.minPlayers !== undefined) dbGame.min_players = game.minPlayers;
  if (game.maxPlayers !== undefined) dbGame.max_players = game.maxPlayers;
  if (game.playTime !== undefined) dbGame.play_time = game.playTime;
  if (game.image !== undefined) dbGame.image = game.image;
  if (game.videoUrl !== undefined) dbGame.video_url = game.videoUrl;
  if (game.isFavorite !== undefined) dbGame.is_favorite = game.isFavorite;
  if (game.language !== undefined) dbGame.language = game.language;

  if (game.category !== undefined) {
    if (game.category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", game.category)
        .single();

      if (categoryData) {
        dbGame.category_id = categoryData.id;
      }
    } else {
      dbGame.category_id = null;
    }
  }

  return dbGame;
}

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
      *,
      categories:category_id (
        name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching games:", error);
    return [];
  }

  return (data || []).map(mapGameFromDb);
}

export async function getGameById(id: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
      *,
      categories:category_id (
        name
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching game:", error);
    return null;
  }

  return data ? mapGameFromDb(data) : null;
}

export async function createGame(game: Omit<Game, "id">): Promise<Game | null> {
  const dbGame = await mapGameToDb(game);
  const { data, error } = await supabase
    .from("games")
    .insert([dbGame])
    .select(
      `
      *,
      categories:category_id (
        name
      )
    `
    )
    .single();

  if (error) {
    console.error("Error creating game:", error);
    return null;
  }

  return data ? mapGameFromDb(data) : null;
}

export async function updateGame(
  id: string,
  game: Partial<Game>
): Promise<Game | null> {
  const dbGame = await mapGameToDb(game as Omit<Game, "id">);
  const { data, error } = await supabase
    .from("games")
    .update(dbGame)
    .eq("id", id)
    .select(
      `
      *,
      categories:category_id (
        name
      )
    `
    )
    .single();

  if (error) {
    console.error("Error updating game:", error);
    return null;
  }

  return data ? mapGameFromDb(data) : null;
}

export async function deleteGame(id: string): Promise<boolean> {
  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error) {
    console.error("Error deleting game:", error);
    return false;
  }

  return true;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function uploadImage(
  file: File,
  gameId: string
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${gameId}-${Date.now()}.${fileExt}`;
  const filePath = `games/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("game-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return null;
  }

  const { data } = supabase.storage.from("game-images").getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const filePath = pathParts
      .slice(pathParts.indexOf("game-images"))
      .join("/")
      .replace("game-images/", "");

    const { error } = await supabase.storage
      .from("game-images")
      .remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error parsing image URL:", error);
    return false;
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    color: row.color,
    created_at: row.created_at,
  }));
}

export async function createCategory(
  category: Omit<Category, "id" | "created_at">
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return null;
  }

  return data
    ? {
        id: data.id,
        name: data.name,
        color: data.color,
        created_at: data.created_at,
      }
    : null;
}

export async function updateCategory(
  id: string,
  category: Partial<Category>
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    return null;
  }

  return data
    ? {
        id: data.id,
        name: data.name,
        color: data.color,
        created_at: data.created_at,
      }
    : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return false;
  }

  return true;
}
