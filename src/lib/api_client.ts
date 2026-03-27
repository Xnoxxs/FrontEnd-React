export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
export const TMDB_POSTER_LARGE = "https://image.tmdb.org/t/p/w500";
export const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  /** May be omitted on some search results */
  genre_ids?: number[];
};
/*
Ex:  
  {
    adult: false,
    backdrop_path: '/6yeVcxFR0j08vlv2OlL6zbewm4D.jpg',
    genre_ids: [ 28, 878, 53 ],
    id: 1265609,
    original_language: 'en',
    original_title: 'War Machine',
    overview: 'On one last grueling mission during Army Ranger training, a combat engineer must lead his unit in a fight against a giant otherworldly killing machine.',
    popularity: 345.151,
    poster_path: '/tlPgDzwIE7VYYIIAGCTUOnN4wI1.jpg',
    release_date: '2026-02-12',
    title: 'War Machine',
    video: false,
    vote_average: 7.263,
    vote_count: 1112
  },
  {
    adult: false,
    backdrop_path: '/1fkuBPid72KGS6WmtkEXMftZtkE.jpg',
    genre_ids: [ 80, 18 ],
    id: 875828,
    original_language: 'en',
    original_title: 'Peaky Blinders: The Immortal Man',
    overview: 'After his estranged son gets embroiled in a Nazi plot, self-exiled gangster Tommy Shelby must return to Birmingham to save his family — and his nation.',
    popularity: 363.0395,
    poster_path: '/gRMalasZEzsZi4w2VFuYusfSfqf.jpg',
    release_date: '2026-03-05',
    title: 'Peaky Blinders: The Immortal Man',
    video: false,
    vote_average: 7.461,
    vote_count: 348
  },
*/

export type Genre = {
  id: number;
  name: string;
};

export type MovieDetails = {
  id: number;
  title: string;
  original_title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  status: string;
  budget: number;
  revenue: number;
  genres: { id: number; name: string }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  homepage: string;
  imdb_id: string | null;
  original_language: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { status_message?: string };
  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "status_message" in data &&
      typeof data.status_message === "string"
        ? data.status_message
        : res.statusText;
    throw new Error(msg || "Request failed");
  }
  return data as T;
}

export async function fetchPopularMovies(apiKey: string): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
  );
  const data = await parseJson<{ results: Movie[] }>(res);
  return data.results ?? [];
}

export async function searchMovies(
  apiKey: string,
  query: string,
): Promise<Movie[]> {
  const params = new URLSearchParams({
    api_key: apiKey,
    query: query.trim(),
  });
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?${params.toString()}`,
  );
  const data = await parseJson<{ results: Movie[] }>(res);
  return data.results ?? [];
}

export async function fetchMovieGenres(apiKey: string): Promise<Genre[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`,
  );
  const data = await parseJson<{ genres: Genre[] }>(res);
  return data.genres ?? [];
}

export async function fetchMovieDetails(
  apiKey: string,
  movieId: number,
): Promise<MovieDetails> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`,
  );
  return parseJson<MovieDetails>(res);
}
