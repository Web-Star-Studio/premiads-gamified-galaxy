
// Local storage with type safety and error handling
class StorageService {
  private prefix = 'premiads_';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Cache with expiration
  setWithExpiration<T>(key: string, value: T, expirationMs: number): void {
    const item = {
      value,
      expiration: Date.now() + expirationMs
    };
    this.set(key, item);
  }

  getWithExpiration<T>(key: string): T | null {
    const item = this.get<{ value: T; expiration: number }>(key);
    if (!item) return null;

    if (Date.now() > item.expiration) {
      this.remove(key);
      return null;
    }

    return item.value;
  }
}

export const storageService = new StorageService();
