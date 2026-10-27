const methods = new Set(["correspondence", "telephone"]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "The note could not be read." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "The note could not be read." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  if (typeof data.company === "string" && data.company.trim()) {
    return Response.json({ ok: true });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const method = typeof data.method === "string" ? data.method : "correspondence";
  const residence = typeof data.residence === "string" ? data.residence.trim() : "";

  if (name.length < 1 || name.length > 120) {
    return Response.json({ ok: false, error: "A name is required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) {
    return Response.json(
      { ok: false, error: "An email address is required." },
      { status: 400 },
    );
  }

  if (message.length < 1 || message.length > 4000) {
    return Response.json({ ok: false, error: "A short note is required." }, { status: 400 });
  }

  if (!methods.has(method)) {
    return Response.json({ ok: false, error: "Choose a way to reply." }, { status: 400 });
  }

  if (residence.length > 160) {
    return Response.json({ ok: false, error: "The note could not be read." }, { status: 400 });
  }

  return Response.json({ ok: true });
}
