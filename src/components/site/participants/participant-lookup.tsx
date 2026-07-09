"use client";

import * as React from "react";
import Image from "next/image";
import { Search, User, Trophy, CheckCircle2, Clock, AlertCircle, Loader2, Medal, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiParticipantDetails } from "@/lib/sahityotsav-api";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: ApiParticipantDetails };

export function ParticipantLookup() {
  const [chestNumber, setChestNumber] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [state, setState] = React.useState<State>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chestNumber.trim() || !dob) return;

    setState({ status: "loading" });

    // Convert date input (YYYY-MM-DD) to DD-MM-YYYY for the API
    const [year, month, day] = dob.split("-");
    const formattedDob = `${day}-${month}-${year}`;

    try {
      const res = await fetch(
        `/api/participant-details?chestNumber=${encodeURIComponent(chestNumber.trim().toUpperCase())}&dob=${encodeURIComponent(formattedDob)}`
      );
      const json = await res.json();

      if (!res.ok) {
        setState({ status: "error", message: json.error ?? "Participant not found. Please check your chest number and date of birth." });
        return;
      }

      setState({ status: "success", data: json });
    } catch {
      setState({ status: "error", message: "Something went wrong. Please try again." });
    }
  }

  function handleReset() {
    setState({ status: "idle" });
    setChestNumber("");
    setDob("");
  }

  return (
    <div className="space-y-8">
      {/* Search form */}
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Search className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Find Participant</h2>
            <p className="text-sm text-muted-foreground">Enter your chest number and date of birth</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="chestNumber">Chest Number</Label>
            <Input
              id="chestNumber"
              placeholder="e.g. A001"
              value={chestNumber}
              onChange={(e) => setChestNumber(e.target.value)}
              disabled={state.status === "loading"}
              className="uppercase"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={state.status === "loading"}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={state.status === "loading" || !chestNumber.trim() || !dob}
          >
            {state.status === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Searching…
              </>
            ) : (
              <>
                <Search className="size-4" />
                Search
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Error */}
      {state.status === "error" && (
        <div className="mx-auto max-w-xl flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Results */}
      {state.status === "success" && (
        <ParticipantCard data={state.data} onReset={handleReset} />
      )}
    </div>
  );
}

function ParticipantCard({ data, onReset }: { data: ApiParticipantDetails; onReset: () => void }) {
  const { participant, competitionOverview, competitions } = data;

  const overviewStats = [
    { label: "Total Competitions", value: competitionOverview.totalCompetitions, icon: Trophy, color: "text-blue-600" },
    { label: "Completed", value: competitionOverview.completedCompetitions, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Prizes Won", value: competitionOverview.prizesWon, icon: Medal, color: "text-amber-600" },
    { label: "Prizes Pending Collection", value: competitionOverview.prizesPendingCollection, icon: Clock, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Participant profile card */}
      <Card>
        <CardContent className="flex flex-col items-center gap-5 py-6 sm:flex-row sm:items-start">
          {/* Photo */}
          <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border bg-muted">
            {participant.photo ? (
              <Image
                src={participant.photo}
                alt={participant.fullName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <User className="size-10 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge variant="outline" className="font-mono font-semibold">
                {participant.chestNumber}
              </Badge>
              {participant.category && <Badge variant="secondary">{participant.category}</Badge>}
              {participant.gender && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="size-3" /> {participant.gender}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{participant.fullName}</h2>
            {participant.teamName && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Users className="size-3.5" />
                {participant.teamName}
              </p>
            )}
            {participant.eventName && (
              <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
                <Calendar className="size-3.5" />
                {participant.eventName}
              </p>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={onReset}>
            Search Again
          </Button>
        </CardContent>
      </Card>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {overviewStats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card px-4 py-3 text-center">
            <s.icon className={`mx-auto mb-1 size-5 ${s.color}`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Competitions list */}
      {competitions && competitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Competitions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {competitions.map((comp, i) => (
                <div key={i} className="flex items-start justify-between gap-3 px-6 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{comp.competitionName}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      {comp.category && (
                        <Badge variant="secondary" className="text-[10px]">{comp.category}</Badge>
                      )}
                      {comp.type && (
                        <span className="text-xs text-muted-foreground">{comp.type}</span>
                      )}
                      {comp.stage && (
                        <span className="text-xs text-muted-foreground">{comp.stage}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {comp.rank ? (
                      <span className="text-sm font-bold">
                        {comp.rank === 1 ? "🥇" : comp.rank === 2 ? "🥈" : comp.rank === 3 ? "🥉" : `#${comp.rank}`}
                      </span>
                    ) : null}
                    {comp.grade && (
                      <p className="text-xs font-semibold text-primary">{comp.grade}</p>
                    )}
                    {comp.point ? (
                      <p className="text-xs text-muted-foreground">{comp.point} pts</p>
                    ) : null}
                    {!comp.rank && !comp.grade && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
