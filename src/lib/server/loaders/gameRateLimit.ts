export class GamePlayLimit<T extends string | number> {
  private plays: Map<T, number>;
  private readonly maxPlays: number;

  constructor(maxPlays: number) {
    this.plays = new Map();
    this.maxPlays = maxPlays;
  }

  canPlay(userId: T): boolean {
    const currentPlays = this.plays.get(userId) || 0;
    return currentPlays < this.maxPlays;
  }

  recordPlay(userId: T): boolean {
    const currentPlays = this.plays.get(userId) || 0;
    if (currentPlays >= this.maxPlays) {
      return false;
    }
    
    this.plays.set(userId, currentPlays + 1);
    return true;
  }

  getRemainingPlays(userId: T): number {
    const currentPlays = this.plays.get(userId) || 0;
    return Math.max(0, this.maxPlays - currentPlays);
  }

  reset(userId: T): void {
    this.plays.delete(userId);
  }
}

export const game21QuestionsLimit = new GamePlayLimit<string>(10);