const storage = typeof window !== "undefined" ? window.localStorage : undefined;

export default {
  async getItem(key: string) {
    if (!storage) return null;
    return storage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (!storage) return;
    storage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (!storage) return;
    storage.removeItem(key);
  },
  async clear() {
    if (!storage) return;
    storage.clear();
  },
};
