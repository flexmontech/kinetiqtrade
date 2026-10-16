import { useState, type FormEvent } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { CHAT_QUESTIONS, chatAnswer, type Lead } from "@/lib/leads";

type Msg = { from: "bot" | "you"; text: string };

export function DemoChat({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: `Hi! I'm the ${lead.business_name} assistant. How can I help?` }]);

  function ask(q: string) {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "you", text: q }, { from: "bot", text: chatAnswer(q, lead) }]);
    setInput("");
  }
  function submit(e: FormEvent) { e.preventDefault(); ask(input); }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
      {open && (
        <div className="mb-3 flex h-[26rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-brand-contrast">
            <span className="flex items-center gap-2 text-sm font-bold"><Bot className="h-4 w-4" />AI assistant · 24/7</span>
            <button aria-label="Close chat" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
            {msgs.map((m, i) => (
              <p key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.from === "you" ? "ml-auto bg-brand text-brand-contrast" : "bg-muted"}`}>{m.text}</p>
            ))}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CHAT_QUESTIONS.map((q) => <button key={q} onClick={() => ask(q)} className="rounded-full border px-2.5 py-1 text-xs font-medium hover:bg-muted">{q}</button>)}
              </div>
            )}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t p-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question…" className="h-10 flex-1 rounded-md border bg-background px-3 text-sm" />
            <button aria-label="Send" className="grid h-10 w-10 place-items-center rounded-md bg-brand text-brand-contrast"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
      <button aria-label="Open chat" onClick={() => setOpen((o) => !o)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-contrast shadow-xl transition hover:scale-105">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
