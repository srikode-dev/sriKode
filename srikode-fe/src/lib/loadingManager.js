// Global API & Route Loading Manager
class LoadingManager {
  constructor() {
    this.activeRequests = 0;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const isLoading = this.activeRequests > 0;
    this.listeners.forEach((listener) => {
      try {
        listener(isLoading, this.activeRequests);
      } catch (err) {
        console.error("Loading listener error:", err);
      }
    });
  }

  start() {
    this.activeRequests++;
    this.notify();
  }

  stop() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.notify();
  }

  reset() {
    this.activeRequests = 0;
    this.notify();
  }
}

export const loadingManager = new LoadingManager();
