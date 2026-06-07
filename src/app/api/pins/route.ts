import { NextResponse } from "next/server";

const REPO = "TarunTomar122/pinboard";
const FILE_PATH = "data/pins.json";
const API = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };
}

export async function GET() {
  try {
    const res = await fetch(API, { headers: getHeaders(), cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return NextResponse.json(JSON.parse(content), {
        headers: { "x-sha": data.sha },
      });
    }
    if (res.status === 404) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: `GitHub ${res.status}` }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { pins, sha } = await request.json();

    // If no SHA provided, fetch current
    let currentSha = sha;
    if (!currentSha) {
      const head = await fetch(API, { headers: getHeaders() });
      if (head.ok) {
        const d = await head.json();
        currentSha = d.sha;
      }
    }

    const body = {
      message: `update pins (${new Date().toISOString()})`,
      content: Buffer.from(JSON.stringify(pins, null, 2)).toString("base64"),
      ...(currentSha ? { sha: currentSha } : {}),
    };

    const res = await fetch(API, {
      method: "PUT",
      headers: { ...getHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ ok: true, sha: data.content.sha });
    }

    // SHA conflict — refetch and retry once
    if (res.status === 409) {
      const head = await fetch(API, { headers: getHeaders() });
      if (head.ok) {
        const d = await head.json();
        body.sha = d.sha;
        const retry = await fetch(API, {
          method: "PUT",
          headers: { ...getHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (retry.ok) {
          const data = await retry.json();
          return NextResponse.json({ ok: true, sha: data.content.sha });
        }
      }
    }

    return NextResponse.json({ error: `GitHub ${res.status}` }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
