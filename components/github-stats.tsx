
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  GitBranch,
  GitCommit,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  username: string;
}

interface ContributionDay {
  count: number;
  date: string;
}

interface GithubStats {
  user: {
    totalContribution: number;
  };
  contributions: ContributionDay[];
}

const GithubStats = ({ username }: Props) => {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGithubStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/github?username=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub stats (${response.status})`);
        }

        const data: GithubStats = await response.json();

        if (!data.contributions || !data.user) {
          throw new Error("Invalid GitHub API response");
        }

        setStats(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("GitHub stats error:", err);
        setError("Failed to fetch GitHub stats. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchGithubStats();

    return () => controller.abort();
  }, [username]);

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border/50">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/2 rounded bg-muted" />
          <div className="h-24 rounded bg-muted" />
          <div className="h-32 rounded bg-muted" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-card border-border/50">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (!stats) return null;

  // Use UTC calendar-day numbers to avoid timezone errors.
  const toDayNumber = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  };

  const todayString = new Date().toISOString().slice(0, 10);
  const todayNumber = toDayNumber(todayString);

  const contributions = [...stats.contributions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const contributionMap = new Map(
    contributions.map((day) => [day.date, day.count])
  );

  // Current streak: today if active, otherwise yesterday.
  const currentStreak = (() => {
    let streak = 0;
    let dayNumber = todayNumber;

    if ((contributionMap.get(todayString) ?? 0) === 0) {
      dayNumber--;
    }

    while (true) {
      const date = new Date(dayNumber * 86400000)
        .toISOString()
        .slice(0, 10);

      const count = contributionMap.get(date);

      if (count === undefined || count === 0) break;

      streak++;
      dayNumber--;
    }

    return streak;
  })();

  // Best contribution day.
  const maxContributions = Math.max(
    0,
    ...contributions.map((day) => day.count)
  );

  // Keep approximately one year of daily contributions.
  const lastYearDays = contributions.slice(-366);

  const getContributionLevel = (count: number) => {
    if (count === 0) return "bg-muted";

    const percentage = (count / Math.max(1, maxContributions)) * 100;

    if (percentage <= 25) return "bg-primary/30";
    if (percentage <= 50) return "bg-primary/50";
    if (percentage <= 75) return "bg-primary/75";

    return "bg-primary";
  };

  // Group days into seven-row calendar weeks.
  // GitHub's contribution calendar starts on Sunday.
  const firstDate = lastYearDays[0]?.date;

  const leadingEmptyDays = firstDate
    ? new Date(`${firstDate}T12:00:00Z`).getUTCDay()
    : 0;

  const calendarCells: (ContributionDay | null)[] = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...lastYearDays,
  ];

  // Pad to a complete final week.
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const weeks: (ContributionDay | null)[][] = [];

  for (let i = 0; i < calendarCells.length; i += 7) {
    weeks.push(calendarCells.slice(i, i + 7));
  }

  const monthLabels = weeks.map((week, index) => {
    const firstDay = week.find(
      (day): day is ContributionDay => day !== null
    );

    if (!firstDay) return "";

    const date = new Date(`${firstDay.date}T12:00:00Z`);
    const month = date.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });

    // Show the label at the first week of each month.
    const previousWeek = weeks[index - 1];
    const previousDay = previousWeek?.find(
      (day): day is ContributionDay => day !== null
    );

    if (!previousDay) return month;

    const previousMonth = new Date(
      `${previousDay.date}T12:00:00Z`
    ).getUTCMonth();

    return date.getUTCMonth() !== previousMonth ? month : "";
  });

  return (
    <Card className="overflow-hidden rounded-3xl border border-border/50 bg-card p-4 shadow-sm backdrop-blur-sm sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <GitCommit className="h-5 w-5 text-primary" />
          </div>

          <h3 className="text-lg font-semibold sm:text-xl">
            Contribution Activity
          </h3>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-secondary/50 p-4"
          >
            <Calendar className="mb-2 h-5 w-5 text-primary" />

            <p className="text-sm text-muted-foreground">
              Current Streak
            </p>

            <p className="text-2xl font-bold text-primary">
              {currentStreak} days
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-secondary/50 p-4"
          >
            <GitBranch className="mb-2 h-5 w-5 text-primary" />

            <p className="text-sm text-muted-foreground">
              Total Contributions
            </p>

            <p className="text-2xl font-bold">
              {stats.user.totalContribution.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-secondary/50 p-4 sm:col-span-2"
          >
            <Star className="mb-2 h-5 w-5 text-primary" />

            <p className="text-sm text-muted-foreground">
              Best Day
            </p>

            <p className="text-2xl font-bold">
              {maxContributions} contributions
            </p>
          </motion.div>
        </div>

        {/* One-year contribution graph */}
        <div className="space-y-4 ">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Contributions in this year
            </h4>

            <span className="text-xs text-muted-foreground">
              {lastYearDays.length} days
            </span>
          </div>

          <div className="overflow-x-auto pb-3">
            <div className="min-w-max">
              {/* Month labels */}
              <div
                className="mb-2 grid gap-0.75"
                style={{
                  gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
                }}
              >
                {monthLabels.map((month, index) => (
                  <span
                    key={index}
                    className="h-4 whitespace-nowrap text-[10px] text-muted-foreground"
                  >
                    {month}
                  </span>
                ))}
              </div>

              <TooltipProvider >
                <div className="flex gap-0.75">
                  {/* Weekday labels */}
                  <div className="mr-1 grid grid-rows-7 gap-0.75">
                    {["", "Mon", "", "Wed", "", "Fri", ""].map(
                      (label, index) => (
                        <span
                          key={index}
                          className="flex h-3 items-center text-[9px] text-muted-foreground"
                        >
                          {label}
                        </span>
                      )
                    )}
                  </div>

                  {/* Calendar weeks */}
                  {weeks.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="grid grid-rows-7 gap-0.75"
                    >
                      {week.map((day, dayIndex) => (
                        <div key={day?.date ?? `empty-${dayIndex}`}>
                          {day ? (
                            <Tooltip>
                              <TooltipTrigger >
                                <div
                                  aria-label={`${day.count} contributions on ${day.date}`}
                                  className={cn(
                                    "h-3 w-3 rounded-xs",
                                    "transition-transform hover:scale-125",
                                    getContributionLevel(day.count)
                                  )}
                                />
                              </TooltipTrigger>

                              <TooltipContent>
                                <p className="text-xs">
                                  {day.count} contributions on{" "}
                                  {new Date(
                                    `${day.date}T12:00:00Z`
                                  ).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="h-3 w-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* Contribution intensity legend */}
          <div className="flex items-center justify-end gap-1.5">
            <span className="mr-1 text-xs text-muted-foreground">
              Less
            </span>

            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-3 w-3 rounded-xs",
                  level === 0 && "bg-muted",
                  level === 1 && "bg-primary/30",
                  level === 2 && "bg-primary/50",
                  level === 3 && "bg-primary/75",
                  level === 4 && "bg-primary"
                )}
              />
            ))}

            <span className="ml-1 text-xs text-muted-foreground">
              More
            </span>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default GithubStats;
