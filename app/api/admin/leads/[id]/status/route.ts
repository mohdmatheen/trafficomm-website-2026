import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/auth/require";
import { changeLeadStatus } from "@/lib/leads/store";
import { isLeadStatus } from "@/lib/leads/types";

/**
 * Changes a lead's status.
 *
 * Authorisation first, before the body is even read: an unauthenticated request
 * must not be able to learn whether an id exists by the shape of the error it
 * gets back. The transition itself is validated in the store against the
 * server-side map, so a client that posts an illegal move is refused regardless
 * of which buttons the dashboard happened to render.
 *
 * The authenticated address becomes `changed_by`, which is why a shared password
 * would not have been sufficient: the audit trail needs to name a person.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false, message: "Not authorised." }, { status: 401 });

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });

  let status: unknown;
  let note: unknown;
  try {
    const body = (await request.json()) as { status?: unknown; note?: unknown };
    status = body.status;
    note = body.note;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!isLeadStatus(status)) return NextResponse.json({ ok: false, message: "Unknown status." }, { status: 422 });

  const result = await changeLeadStatus(id, status, admin, typeof note === "string" ? note.trim().slice(0, 500) || undefined : undefined);

  if (!result.ok) {
    const code = result.reason === "not_found" ? 404 : result.reason === "no_database" ? 503 : 409;
    return NextResponse.json({ ok: false, reason: result.reason }, { status: code });
  }

  // `dispatchCreated` is reported so the dashboard can say whether this
  // qualification reserved a LinkedIn conversion or found one already reserved.
  // Nothing is sent to LinkedIn in this phase.
  return NextResponse.json({ ok: true, status: result.lead.status, dispatchCreated: result.dispatchCreated });
}
