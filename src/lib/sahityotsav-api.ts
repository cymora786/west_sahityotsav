import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const BASE_URL = process.env.SAHITYOTSAV_BASE_URL ?? "https://demo.sahityotsav.com";
const API_KEY = process.env.SAHITYOTSAV_API_KEY ?? "";

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const url = `${BASE_URL}${path}`;
    const { stdout } = await execAsync(
      `curl -s --location -H "x-api-key: ${API_KEY}" "${url}"`,
      { timeout: 15000 }
    );
    const json = JSON.parse(stdout);
    if (!json || json.status === 401 || json.status === 403) return null;
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
export async function getApiCategoryLeaders(): Promise<ApiCategoryLeader[]> {
  const competitions = await getPublishedCompetitions();
  if (!competitions || competitions.length === 0) return [];

  // Fetch all competition results in parallel
  const allResults = await Promise.all(
    competitions.map(async (comp) => {
      const results = await getCompetitionResults(comp.id);
      const winner = results?.find((r) => r.rank === 1);
      return { category: comp.category, winner };
    })
  );

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

  return leaders.sort((a, b) => a.category.localeCompare(b.category));
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
