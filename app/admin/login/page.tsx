import { LoginForm } from "@/components/admin/LoginForm";

const MESSAGES: Record<string, string> = {
  expired: "That link has expired. Request a new one.",
  bad_signature: "That link is not valid.",
  malformed: "That link is not valid.",
  not_allowed: "That address is not authorised.",
  unconfigured: "Sign-in is not configured on this deployment.",
  signed_out: "You have been signed out.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  // Only known keys are rendered, so the query string cannot be used to put
  // arbitrary text on a Trafficomm page.
  const message = error && MESSAGES[error] ? MESSAGES[error] : null;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-signal-ink">Trafficomm internal</p>
      <h1 className="mt-4 text-[2rem] leading-tight tracking-[-0.03em] text-ink">Lead dashboard</h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-steel">
        Enter your Trafficomm address. If it is authorised, a sign-in link will arrive by email.
      </p>
      {message && (
        <p role="alert" className="mt-6 rounded-[10px] bg-signal-soft px-4 py-3 text-[0.92rem] text-signal-ink ring-1 ring-inset ring-signal/30">
          {message}
        </p>
      )}
      <LoginForm />
    </main>
  );
}
