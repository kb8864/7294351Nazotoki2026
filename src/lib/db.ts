import "server-only";
import { Redis } from "@upstash/redis";
import { PlayerProgress, AnsweredEntry, WinnerEntry } from "./types";

// ============================================================
//  ストレージ抽象化
//  - 本番/設定あり: Upstash Redis
//  - 環境変数が無い場合: メモリ内フォールバック（開発・ビルド用、非永続）
// ============================================================

interface Store {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  zadd(member: string, score: number): Promise<void>;
  zrange(): Promise<string[]>;
}

const TTL_SECONDS = 60 * 60 * 24 * 400; // 約400日（最低1年保持）

function makeRedisStore(): Store {
  const redis = Redis.fromEnv();
  return {
    async get<T>(key: string) {
      return (await redis.get<T>(key)) ?? null;
    },
    async set<T>(key: string, value: T) {
      await redis.set(key, value, { ex: TTL_SECONDS });
    },
    async zadd(member: string, score: number) {
      await redis.zadd(WINNERS_ZSET, { score, member });
    },
    async zrange() {
      return (await redis.zrange<string[]>(WINNERS_ZSET, 0, -1)) ?? [];
    },
  };
}

function makeMemoryStore(): Store {
  const kv = new Map<string, unknown>();
  const z = new Map<string, number>();
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[db] UPSTASH_REDIS_* が未設定のためメモリ内ストアを使用します（再起動で消えます）"
    );
  }
  return {
    async get<T>(key: string) {
      return (kv.get(key) as T) ?? null;
    },
    async set<T>(key: string, value: T) {
      kv.set(key, value);
    },
    async zadd(member: string, score: number) {
      z.set(member, score);
    },
    async zrange() {
      return [...z.entries()].sort((a, b) => a[1] - b[1]).map((e) => e[0]);
    },
  };
}

const WINNERS_ZSET = "winners";
let _store: Store | null = null;
function store(): Store {
  if (!_store) {
    const hasRedis =
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
    _store = hasRedis ? makeRedisStore() : makeMemoryStore();
  }
  return _store;
}

// ------------------------------------------------------------

const playerKey = (userId: string) => `player:${userId}`;
const winnerKey = (userId: string) => `winner:${userId}`;

function emptyProgress(displayName: string): PlayerProgress {
  return {
    displayName,
    mainSolved: 0,
    bonusSolved: 0,
    mainCleared: false,
    bonusCleared: false,
    answered: [],
  };
}

/** プレイヤー進捗を取得（なければ初期値）。表示名は最新に更新し、TTLを延長。 */
export async function getOrCreatePlayer(
  userId: string,
  displayName: string
): Promise<PlayerProgress> {
  const data = await store().get<PlayerProgress>(playerKey(userId));
  const progress = data ?? emptyProgress(displayName);
  if (displayName && progress.displayName !== displayName) {
    progress.displayName = displayName;
  }
  await store().set(playerKey(userId), progress);
  return progress;
}

export async function savePlayer(
  userId: string,
  progress: PlayerProgress
): Promise<void> {
  await store().set(playerKey(userId), progress);
}

/** 正解を記録（重複は追加しない） */
export function recordAnswer(
  progress: PlayerProgress,
  entry: AnsweredEntry
): PlayerProgress {
  const exists = progress.answered.some((a) => a.puzzleId === entry.puzzleId);
  if (!exists) {
    progress.answered = [...progress.answered, entry];
  }
  return progress;
}

/** 全問正解者として登録 */
export async function registerWinner(
  userId: string,
  name: string
): Promise<void> {
  const now = Date.now();
  const entry: WinnerEntry = { name, clearedAt: now };
  await store().set(winnerKey(userId), entry);
  await store().zadd(userId, now);
}

/** 全問正解者の一覧（クリアした順） */
export async function listWinners(): Promise<WinnerEntry[]> {
  const userIds = await store().zrange();
  if (userIds.length === 0) return [];
  const entries = await Promise.all(
    userIds.map((id) => store().get<WinnerEntry>(winnerKey(id)))
  );
  return entries.filter((e): e is WinnerEntry => Boolean(e));
}
