import { Injectable } from '@nestjs/common'

@Injectable()
export class AiRateLimitService {
  private readonly requests = new Map<string, number[]>()
  private readonly LIMIT = 1
  private readonly WINDOW = 60 * 60 * 1000 // 1h

  canAnalyze(userId: string): boolean {
    const now = Date.now()
    const history = this.requests.get(userId) ?? []

    const recent = history.filter(ts => now - ts < this.WINDOW)

    if (recent.length >= this.LIMIT) {
      return false
    }

    recent.push(now)
    this.requests.set(userId, recent)
    return true
  }
}
