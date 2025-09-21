import { apiClient } from "../../lib/api-client";
import { API_ENDPOINTS } from "./endpoints";
import type {
  GenreResponse,
  ImageResponse,
  MovieDetail,
  MovieListResponse,
  SearchResponse,
  VideoResponse,
} from "./types";

class TMDbService {
  private baseURL = process.env.EXPO_PUBLIC_TMDB_BASE_URL;
  private apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

  constructor() {
    if (!this.apiKey) {
      console.warn(
        "⚠️ TMDb API key not found. Please set EXPO_PUBLIC_TMDB_API_KEY in your .env file"
      );
    }
  }

  // Get upcoming movies with pagination
  async getUpcomingMovies(page: number = 1): Promise<MovieListResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.UPCOMING_MOVIES, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
    }
  }

  // Get detailed information about a specific movie
  async getMovieDetails(movieId: number): Promise<MovieDetail> {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.MOVIE_DETAILS(movieId)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      throw error;
    }
  }

  // Get videos/trailers for a movie
  async getMovieVideos(movieId: number): Promise<VideoResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MOVIE_VIDEOS(movieId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie videos for ID ${movieId}:`, error);
      throw error;
    }
  }

  // Get images for a movie
  async getMovieImages(movieId: number): Promise<ImageResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MOVIE_IMAGES(movieId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie images for ID ${movieId}:`, error);
      throw error;
    }
  }

  // Search for movies
  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      if (!query.trim()) {
        return { results: [], page: 1, total_pages: 0, total_results: 0 };
      }

      const response = await apiClient.get(API_ENDPOINTS.SEARCH_MOVIES, {
        params: { query: query.trim(), page },
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching movies with query "${query}":`, error);
      throw error;
    }
  }

  // Get movie genres
  async getGenres(): Promise<GenreResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GENRES);
      return response.data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  }

  // Helper method to get the first available trailer
  async getMovieTrailer(movieId: number): Promise<string | null> {
    try {
      const videosResponse = await this.getMovieVideos(movieId);

      // Find the first official trailer from YouTube
      const trailer = videosResponse.results.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official === true
      );

      // If no official trailer, find any trailer
      const anyTrailer = videosResponse.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );

      const selectedTrailer = trailer || anyTrailer;
      return selectedTrailer ? selectedTrailer.key : null;
    } catch (error) {
      console.error(`Error getting trailer for movie ID ${movieId}:`, error);
      return null;
    }
  }

  // Helper method to build image URLs
  getImageUrl(path: string | null, size: string = "w500"): string {
    if (!path) return "";
    const baseUrl =
      process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL;
    return `${baseUrl}/${path}`;
  }

  // Helper method to get YouTube video URL
  getYouTubeUrl(videoKey: string): string {
    return `https://www.youtube.com/watch?v=${videoKey}`;
  }

  // Helper method to get YouTube thumbnail URL
  getYouTubeThumbnail(
    videoKey: string,
    quality: "default" | "medium" | "high" | "maxres" = "medium"
  ): string {
    return `https://img.youtube.com/vi/${videoKey}/${quality}default.jpg`;
  }
}

// Export singleton instance
export const tmdbService = new TMDbService();
