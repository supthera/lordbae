"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { getProperty } from "@/lib/properties";

type Method = "correspondence" | "telephone";
type Status = "idle" | "sending" | "sent" | "error";

export function Inquiry() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const residenceSlug = params.get("residence") ?? "";
  const residence = residenceSlug ? getProperty(residenceSlug) : undefined;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<Method>("correspondence");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          method,
          company,
          residence: residence?.name ?? "",
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setStatus("error");
        setError(payload.error || "The note could not be sent. Please try once more.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("The note could not be sent. Please try once more.");
    }
  }

  return (
    <section
      id="inquiry"
      className="scroll-mt-8 border-t border-[rgba(244,239,230,0.14)] px-[6vw] py-28 md:py-40"
    >
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">04 — Inquiry</p>
          <h2 className="display mt-4 text-[clamp(3rem,5.5vw,5.4rem)]">
            Request an introduction.
          </h2>
          <p className="quiet mt-6 max-w-md">
            A name, an email, and a few lines are enough. The office replies when
            there is a reason to — quietly, and without a mailing list.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                role="status"
                className="border border-[rgba(244,239,230,0.16)] px-8 py-12"
              >
                <p className="eyebrow">Received</p>
                <p className="display mt-4 text-5xl">Your note is with the office.</p>
                <p className="quiet mt-5 max-w-md">
                  If a reply is warranted, it will come by the method you chose.
                  Nothing further is required.
                </p>
                <button
                  type="button"
                  className="cta mt-8"
                  onClick={() => {
                    setStatus("idle");
                    setMessage("");
                  }}
                >
                  Send another note
                  <i />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                className="space-y-8"
              >
                {residence ? (
                  <p className="text-sm tracking-[0.14em] text-[#c6b49a] uppercase">
                    Regarding {residence.name}
                  </p>
                ) : null}
                <label className="block">
                  <span className="eyebrow">Name</span>
                  <span className="field mt-2 block">
                    <input
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      maxLength={120}
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="eyebrow">Email</span>
                  <span className="field mt-2 block">
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      maxLength={180}
                    />
                  </span>
                </label>
                <fieldset>
                  <legend className="eyebrow">Preferred reply</legend>
                  <div className="mt-4 flex gap-3" role="radiogroup" aria-label="Preferred reply">
                    {(
                      [
                        ["correspondence", "Correspondence"],
                        ["telephone", "Telephone"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={method === value}
                        onClick={() => setMethod(value)}
                        className={`border px-4 py-2 text-[0.68rem] tracking-[0.18em] uppercase transition-colors ${
                          method === value
                            ? "border-[#c80e0e] text-[#f4efe6]"
                            : "border-[rgba(244,239,230,0.2)] text-[#a39c92]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="block">
                  <span className="eyebrow">Note</span>
                  <span className="field mt-2 block">
                    <textarea
                      name="message"
                      rows={5}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      required
                      maxLength={4000}
                      placeholder="A residence, a question, or simply an introduction."
                    />
                  </span>
                </label>
                <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </label>
                {status === "error" ? (
                  <p role="alert" className="text-sm text-[#e7e1d6]">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="cta"
                  disabled={status === "sending"}
                  aria-busy={status === "sending"}
                >
                  {status === "sending" ? "Sending" : "Send a note"}
                  <i />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
