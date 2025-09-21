import axios, { AxiosError, AxiosInstance } from 'axios';

// API Error types
export enum APIErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMITED = 'RATE_LIMITED',
}

export interface APIError {
  type: APIErrorType;
  message: string;
  statusCode?: number;
  retryable: boolean;
}

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_TMDB_BASE_URL,
      timeout: 10000,
      params: {
        api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (__DEV__) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        if (__DEV__) {
          console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error: AxiosError) => {
        if (__DEV__) {
          console.error('❌ API Error:', error.response?.data || error.message);
        }
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: AxiosError): APIError {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return {
        type: APIErrorType.TIMEOUT_ERROR,
        message: 'Request timed out. Please try again.',
        retryable: true,
      };
    }

    if (!error.response) {
      // Network error
      return {
        type: APIErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your internet connection.',
        retryable: true,
      };
    }

    const { status, data } = error.response;
    const serverMessage = (data as any)?.status_message || (data as any)?.message;

    switch (status) {
      case 401:
        return {
          type: APIErrorType.UNAUTHORIZED,
          message: serverMessage || 'Invalid API key. Please check your configuration.',
          statusCode: status,
          retryable: false,
        };
      case 404:
        return {
          type: APIErrorType.NOT_FOUND,
          message: serverMessage || 'The requested resource was not found.',
          statusCode: status,
          retryable: false,
        };
      case 429:
        return {
          type: APIErrorType.RATE_LIMITED,
          message: serverMessage || 'Too many requests. Please try again later.',
          statusCode: status,
          retryable: true,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: APIErrorType.SERVER_ERROR,
          message: serverMessage || 'Server error. Please try again later.',
          statusCode: status,
          retryable: true,
        };
      default:
        return {
          type: APIErrorType.SERVER_ERROR,
          message: serverMessage || 'An unexpected error occurred.',
          statusCode: status,
          retryable: status >= 500,
        };
    }
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new APIClient().getInstance();