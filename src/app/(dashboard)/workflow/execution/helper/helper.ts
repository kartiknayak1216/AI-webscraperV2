export const dateToDuration = (beginning: Date | null | undefined, ending: Date | null | undefined): string | null => {
    if (!beginning || !ending) {
      return null;
    }
  
    const diff = Math.abs(beginning.getTime() - ending.getTime());
  
    if (diff < 1000) {
      return `${diff}ms`; // Milliseconds
    }
  
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
  
    return parts.join(" ") || "0s";
  };