import { Octokit } from "octokit";
import { NextRequest, NextResponse } from "next/server";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function GET(request: NextRequest) {
  const username = new URL(request.url).searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const response: any = await octokit.graphql(query, { username });

    const calendar =
      response.user.contributionsCollection.contributionCalendar;

    const contributions = calendar.weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        count: day.contributionCount,
        date: day.date,
      }))
    );

    return NextResponse.json({
      user: {
        totalContribution: calendar.totalContributions,
      },
      contributions,
    });
  } catch (error) {
    console.error("GitHub API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}