import { NextRequest, NextResponse } from "next/server";

const REPO_OWNER = "TarunTomar122";
const REPO_NAME = "pinboard";
const FILE_PATH = "data/pins.json";
const BRANCH = "main";

const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
const RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${FILE_PATH}`;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(RAW_URL, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (res.status === 404) {
      return NextResponse.json([]);
    }

    return NextResponse.json({ error: "Failed to fetch pins" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch pins" }, { status: 500 });
  }
}

async function getFileSha(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
    }

    const pins = await request.json();
    const sha = await getFileSha();

    const body: Record<string, unknown> = {
      message: sha ? "Update pins" : "Create pins.json with initial data",
      content: Buffer.from(JSON.stringify(pins, null, 2)).toString("base64"),
    };
    if (sha) {
      body.sha = sha;
    }

    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Failed to save", details: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save pins" }, { status: 500 });
  }
}
