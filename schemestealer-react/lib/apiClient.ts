/**
 * API Client Utility
 * Centralised HTTP client with base URL configuration and common headers
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request configuration options
 */
interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
}

/**
 * API Client for making HTTP requests
 * Handles base URL configuration, common headers, and error handling
 */
export const apiClient = {
  /**
   * Get the full URL for an endpoint
   */
  getUrl(endpoint: string): string {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${path}`;
  },

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  },

  /**
   * Make a POST request with JSON body
   */
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body,
    });
  },

  /**
   * Make a POST request with FormData (for file uploads)
   */
  async postForm<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<T> {
    const url = this.getUrl(endpoint);
    const controller = new AbortController();
    const timeout = config?.timeout || 60000; // 60s default for uploads

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        ...config,
        // Don't set Content-Type for FormData - browser sets it with boundary
        headers: {
          ...config?.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          error.detail || `Request failed with status ${response.status}`,
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }

      throw new ApiError(
        error instanceof Error ? `Network error: ${error.message}` : 'Network error: Failed to connect to backend'
      );
    }
  },

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body,
    });
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  },

  /**
   * Core request method
   */
  async request<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.getUrl(endpoint);
    const controller = new AbortController();
    const timeout = config?.timeout || 30000; // 30s default

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    try {
      const response = await fetch(url, {
        ...config,
        headers,
        body: config?.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          error.detail || `Request failed with status ${response.status}`,
          response.status,
          error
        );
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return undefined as T;
      }

      return JSON.parse(text);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }

      throw new ApiError(
        error instanceof Error ? `Network error: ${error.message}` : 'Network error: Failed to connect to backend'
      );
    }
  },

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};

export default apiClient;
