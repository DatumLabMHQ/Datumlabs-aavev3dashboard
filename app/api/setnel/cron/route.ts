import { NextResponse } from 'next/server';
import { setSelfUrl } from '@/lib/setnel/detectors'; // also registers detectors via side-effect
import { runDetectors } from '@/lib/setnel/runtime';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/setnel/cron
// Runs this dashboard's detectors and posts results to the Setnel Hub.
// Triggered by datum-scheduler (Cloudflare cron worker) or an external pinger.
// Optionally protect with CRON_SECRET: send `?key=<secret>`.
export async function GET(req: Request) {
  const cronSecret = process.env.SETNEL_CRON_SECRET;
  if (cronSecret) {
    const key = new URL(req.url).searchParams.get('key');
    if (key !== cronSecret) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const hubUrl = process.env.SETNEL_HUB_URL;
  const secret = process.env.SETNEL_SECRET;
  if (!hubUrl || !secret) {
    return NextResponse.json(
      { error: 'SETNEL_HUB_URL / SETNEL_SECRET not set' },
      { status: 500 },
    );
  }

  setSelfUrl(new URL(req.url).origin);
  const report = await runDetectors({ dashboardId: 'aave', hubUrl, secret });
  return NextResponse.json(report);
}
