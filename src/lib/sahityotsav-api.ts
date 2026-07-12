import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const BASE_URL = process.env.SAHITYOTSAV_BASE_URL ?? "https://demo.sahityotsav.com";
const API_KEY = process.env.SAHITYOTSAV_API_KEY ?? "";

// In-process cache to avoid hammering the rate-limited API
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds

async function apiFetch<T>(path: string): Promise<T | null> {
  const cached = cache.get(path);
  if (cached && cached.expiresAt > Date.now()) return cached.data as T;

  try {
    const url = `${BASE_URL}${path}`;
    const { stdout } = await execAsync(
      `curl -s --location -H "x-api-key: ${API_KEY}" "${url}"`,
      { timeout: 15000 }
    );
    const json = JSON.parse(stdout);
    if (!json || json.status === 401 || json.status === 403 || json.status === 429) return null;
    cache.set(path, { data: json.data, expiresAt: Date.now() + CACHE_TTL_MS });
    return json.data as T;
  } catch {
    return null;
  }
}

export type ApiTeamPoint = {
  name: string;
  point: number;
};

export type ApiCompetition = {
  id: string;
  code?: string;
  name: string;
  category: string;
  type: "Individual" | "Group";
  stage?: string;
  resultNumber: number;
  publishedAt?: string;
};

export type ApiCompetitionResult = {
  rank: number;
  teamName: string;
  participantName?: string;
  groupName?: string;
  leaderName?: string;
  point: number;
  grade: string;
  prize: "FIRST" | "SECOND" | "THIRD" | null;
};

export type ApiScheduleEntry = {
  competitionId: string;
  competitionName: string;
  category: string;
  type: string;
  stageName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Upcoming" | "In Progress" | "Completed";
};

export type ApiSchedule = {
  timezone?: string;
  stages: { id: string; name: string; number: number }[];
  schedule: ApiScheduleEntry[];
};

export type ApiParticipantCompetition = {
  competitionName: string;
  category?: string;
  type?: string;
  stage?: string;
  result?: string;
  grade?: string;
  point?: number;
  prize?: string | null;
  rank?: number;
};

export type ApiParticipantDetails = {
  participant: {
    id: string;
    chestNumber: string;
    fullName: string;
    gender?: string;
    category?: string;
    teamName?: string;
    photo?: string;
    eventName?: string;
  };
  competitionOverview: {
    totalCompetitions: number;
    completedCompetitions: number;
    prizesWon: number;
    prizesPendingCollection: number;
  };
  competitions: ApiParticipantCompetition[];
};

export type ApiCategoryLeader = {
  category: string;
  teamName: string;
  wins: number;
};

// ── Core endpoints ───────────────────────────────────────────────────────────

export function getTeamPoints(limit = 0) {
  return apiFetch<ApiTeamPoint[]>(`/api/public/team-points?limit=${limit}&teamTypeName=General`);
}

export function getCategoryTeamPoints(category: string, limit = 0) {
  return apiFetch<ApiTeamPoint[]>(
    `/api/public/team-points?limit=${limit}&teamTypeName=${encodeURIComponent(category)}`
  );
}

export function getPublishedCompetitions() {
  return apiFetch<ApiCompetition[]>("/api/public/competitions");
}

export function getCompetitionResults(competitionId: string) {
  return apiFetch<ApiCompetitionResult[]>(
    `/api/public/competitions/${competitionId}/results`
  );
}

export function getApiSchedule() {
  return apiFetch<ApiSchedule>("/api/public/schedule");
}

// ── Derived helpers ──────────────────────────────────────────────────────────

/**
 * Computes which team leads each category based on first-place wins.
 * Fetches all competition results in parallel (cached per request).
 */
const LEADERS_CACHE_KEY = "__category_leaders__";
const LEADERS_TTL_MS = 5 * 60_000; // 5 minutes

export async function getApiCategoryLeaders(): Promise<ApiCategoryLeader[]> {
  const cached = cache.get(LEADERS_CACHE_KEY);
  if (cached && cached.expiresAt > Date.now()) return cached.data as ApiCategoryLeader[];

  const competitions = await getPublishedCompetitions();
  if (!competitions || competitions.length === 0) return [];

  // Fetch results in small batches to avoid rate-limit bursts
  const BATCH = 5;
  const allResults: { category: string; winner: ApiCompetitionResult | undefined }[] = [];
  for (let i = 0; i < competitions.length; i += BATCH) {
    const batch = competitions.slice(i, i + BATCH);
    const batchResults = await Promise.all(
      batch.map(async (comp) => {
        const results = await getCompetitionResults(comp.id);
        const winner = results?.find((r) => r.rank === 1);
        return { category: comp.category, winner };
      })
    );
    allResults.push(...batchResults);
  }

  // Count first-place wins per team per category
  const winsMap = new Map<string, Map<string, number>>();
  for (const { category, winner } of allResults) {
    if (!winner) continue;
    if (!winsMap.has(category)) winsMap.set(category, new Map());
    const teamMap = winsMap.get(category)!;
    teamMap.set(winner.teamName, (teamMap.get(winner.teamName) ?? 0) + 1);
  }

  // Determine leader per category
  const leaders: ApiCategoryLeader[] = [];
  for (const [category, teamMap] of winsMap.entries()) {
    let topTeam = "";
    let topWins = 0;
    for (const [team, wins] of teamMap.entries()) {
      if (wins > topWins) {
        topTeam = team;
        topWins = wins;
      }
    }
    if (topTeam) leaders.push({ category, teamName: topTeam, wins: topWins });
  }

  const result = leaders.sort((a, b) => a.category.localeCompare(b.category));
  cache.set(LEADERS_CACHE_KEY, { data: result, expiresAt: Date.now() + LEADERS_TTL_MS });
  return result;
}

/**
 * Returns competitions where the given team name placed 1st, 2nd, or 3rd.
 */
export async function getApiDivisionResults(
  teamName: string
): Promise<
  { competition: ApiCompetition; rank: number; participantName: string }[]
> {
  const competitions = await getPublishedCompetitions();
  if (!competitions || competitions.length === 0) return [];

  const allResults = await Promise.all(
    competitions.map(async (comp) => {
      const results = await getCompetitionResults(comp.id);
      const entry = results?.find((r) => r.teamName === teamName);
      return entry ? { competition: comp, rank: entry.rank, participantName: entry.participantName ?? entry.groupName ?? "" } : null;
    })
  );

  return allResults.filter(Boolean) as {
    competition: ApiCompetition;
    rank: number;
    participantName: string;
  }[];
}

/**
 * Fetches latest Shorts video IDs from the SSF YouTube channel page.
 */
export async function getYouTubeShorts(limit = 8): Promise<{ id: string }[]> {
  try {
    const res = await fetch("https://www.youtube.com/@SSFMlpmWestMedia/shorts", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 300 },
    });
    const html = await res.text();
    const matches = [...html.matchAll(/(?:\\\/|\/|%2F)shorts(?:\\\/|\/|%2F)([a-zA-Z0-9_-]{11})/g)];
    const seen = new Set<string>();
    const ids: { id: string }[] = [];
    for (const m of matches) {
      if (!seen.has(m[1])) { seen.add(m[1]); ids.push({ id: m[1] }); }
      if (ids.length >= limit) break;
    }
    return ids;
  } catch {
    return [];
  }
}

/**
 * Computes programme progress from schedule statuses.
 */
export async function getApiProgrammeProgress() {
  const schedule = await getApiSchedule();
  const entries = schedule?.schedule ?? [];

  const completed = entries.filter((e) => e.status === "Completed").length;
  const ongoing = entries.filter((e) => e.status === "In Progress").length;
  const pending = entries.filter((e) => e.status === "Upcoming").length;
  const total = entries.length;

  return { completed, ongoing, pending, total };
}
