"use client";

import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, MessageSquare, RefreshCw, Send, User, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AnalyticsRoomStatusChart from "@/components/analytics/analytics-room-status-chart";

const INITIAL_PROMPT = "Give me a current operational summary of the hotel.";

type RoomStatusEntry = {
  status: string;
  label: string;
  count: number;
  percent: number;
};

type MetricCard = {
  label: string;
  value: string;
  suffix?: string;
  description?: string;
  highlighted?: boolean;
};

type RoomListEntry = {
  number: string;
  status: string;
};

type MaintenanceSummaryData = {
  active: number;
  urgentOrHigh: number;
  completedInPeriod: number;
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  OCCUPIED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  CLEANING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  MAINTENANCE: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  OUT_OF_ORDER: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

function renderRoomLinks(text: string, keyPrefix: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const parts = text.split(/(Room\s+\d+)/gi);
  parts.forEach((part, i) => {
    if (/^Room\s+\d+$/i.test(part)) {
      result.push(
        <Link
          key={`${keyPrefix}-rl${i}`}
          href="/room-management"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {part}
        </Link>,
      );
    } else if (part) {
      result.push(part);
    }
  });
  return result;
}

function renderInlineMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  parts.forEach((part, i) => {
    if (/^\*\*[^*\n]+\*\*$/.test(part)) {
      result.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-foreground">
          {renderRoomLinks(part.slice(2, -2), `${keyPrefix}-b${i}`)}
        </strong>,
      );
    } else {
      // Strip any incomplete ** markers mid-render during typewriter effect
      const cleaned = part.replace(/\*\*/g, "");
      if (cleaned) {
        result.push(...renderRoomLinks(cleaned, `${keyPrefix}-p${i}`));
      }
    }
  });
  return result;
}

function renderMarkdown(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const segments = text.split(/(^## .+$)/m);
  segments.forEach((seg, i) => {
    if (/^## /.test(seg)) {
      result.push(
        <p key={`h${i}`} className="mb-1.5 mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary first:mt-0">
          {seg.slice(3)}
        </p>,
      );
    } else if (seg) {
      result.push(...renderInlineMarkdown(seg, `s${i}`));
    }
  });
  return result;
}

function useTypewriter(fullText: string, active: boolean): string {
  const [displayed, setDisplayed] = useState(active ? "" : fullText);

  useEffect(() => {
    if (!active) {
      setDisplayed(fullText);
      return;
    }
    if (displayed.length >= fullText.length) return;
    const id = setTimeout(() => {
      setDisplayed(fullText.slice(0, displayed.length + 2));
    }, 25);
    return () => clearTimeout(id);
  }, [displayed, fullText, active]);

  useEffect(() => {
    if (!active) setDisplayed(fullText);
  }, [active, fullText]);

  return active ? displayed : fullText;
}

function InsightTextPart({ text, showCursor }: { text: string; showCursor: boolean }) {
  const displayed = useTypewriter(text, showCursor);
  return (
    <span className="whitespace-pre-wrap text-sm leading-relaxed">
      {renderMarkdown(displayed)}
      {showCursor && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-muted-foreground align-middle" />
      )}
    </span>
  );
}

function MessageParts({
  message,
  showCursor,
  animated = false,
}: {
  message: UIMessage;
  showCursor: boolean;
  animated?: boolean;
}) {
  const nodes: React.ReactNode[] = [];

  message.parts.forEach((part, i) => {
    const isLastPart = i === message.parts.length - 1;

    if (part.type === "text" && "text" in part) {
      const text = (part as { type: "text"; text: string }).text;
      if (text) {
        const cursor = showCursor && isLastPart;
        if (animated) {
          nodes.push(<InsightTextPart key={`text-${i}`} text={text} showCursor={cursor} />);
        } else {
          nodes.push(
            <span key={`text-${i}`} className="whitespace-pre-wrap text-sm leading-relaxed">
              {renderMarkdown(text)}
              {cursor && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-muted-foreground align-middle" />
              )}
            </span>,
          );
        }
      }
      return;
    }

    const toolPart = part as { type: string; toolName?: string; state?: string; output?: unknown };
    if (toolPart.state !== "output" || !toolPart.output) return;

    if (toolPart.toolName === "showMetricCards") {
      const { metrics } = toolPart.output as { metrics: MetricCard[] };
      nodes.push(
        <div key={`metrics-${i}`} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {metrics.map((m, j) => (
            <div
              key={j}
              className={`rounded-2xl px-4 py-3 ${m.highlighted ? "border border-primary/20 bg-primary/10" : "bg-white/5"}`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {m.label}
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`text-xl font-semibold tracking-tight ${m.highlighted ? "text-primary" : "text-foreground"}`}
                >
                  {m.value}
                </span>
                {m.suffix && (
                  <span className="text-sm text-muted-foreground">{m.suffix}</span>
                )}
              </div>
              {m.description && (
                <p className="mt-0.5 text-xs text-muted-foreground/70">{m.description}</p>
              )}
            </div>
          ))}
        </div>,
      );
    } else if (toolPart.toolName === "showRoomStatusChart") {
      const output = toolPart.output as { breakdown: RoomStatusEntry[]; total: number };
      nodes.push(
        <div key={`chart-${i}`} className="mt-4 max-w-xs">
          <AnalyticsRoomStatusChart breakdown={output.breakdown} total={output.total} />
        </div>,
      );
    } else if (toolPart.toolName === "showRoomList") {
      const output = toolPart.output as { rooms: RoomListEntry[]; title?: string };
      nodes.push(
        <div key={`rooms-${i}`} className="mt-4">
          {output.title && (
            <p className="mb-2 text-xs font-medium text-muted-foreground">{output.title}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {output.rooms.map((r) => (
              <Link key={r.number} href="/room-management">
                <Badge
                  variant="outline"
                  className={`cursor-pointer text-xs ${STATUS_COLORS[r.status] ?? "border-white/20 text-foreground"}`}
                >
                  Room {r.number}
                </Badge>
              </Link>
            ))}
          </div>
        </div>,
      );
    } else if (toolPart.toolName === "showMaintenanceSummary") {
      const { summary } = toolPart.output as { summary: MaintenanceSummaryData };
      nodes.push(
        <div key={`maint-${i}`} className="mt-4 grid grid-cols-3 gap-3">
          {(
            [
              { label: "Active", value: summary.active, Icon: Wrench, cls: "bg-white/5", textCls: "" },
              {
                label: "High priority",
                value: summary.urgentOrHigh,
                Icon: AlertTriangle,
                cls: summary.urgentOrHigh > 0 ? "border border-destructive/20 bg-destructive/10" : "bg-white/5",
                textCls: summary.urgentOrHigh > 0 ? "text-destructive" : "",
              },
              { label: "Completed", value: summary.completedInPeriod, Icon: CheckCircle2, cls: "bg-white/5", textCls: "text-primary" },
            ] as const
          ).map(({ label, value, Icon, cls, textCls }, j) => (
            <div key={j} className={`rounded-2xl px-3 py-3 ${cls}`}>
              <Icon className={`mb-1.5 size-3.5 ${textCls || "text-muted-foreground"}`} />
              <p className={`text-xl font-semibold ${textCls}`}>{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>,
      );
    }
  });

  return <>{nodes}</>;
}

export default function AiAssistantChat() {
  const { messages, sendMessage, setMessages, status } = useChat();
  const [input, setInput] = useState("");

  const initialized = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    sendMessage({ text: INITIAL_PROMPT });
  }, [sendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // messages[0] = hidden user trigger
  // messages[1] = initial assistant analysis → Insights section
  // messages[2..n] = subsequent Q&A → Chat section
  const insightMessage: UIMessage | undefined = messages[1];
  const chatMessages = messages.slice(2);

  const handleRefresh = useCallback(() => {
    setMessages([]);
    setTimeout(() => sendMessage({ text: INITIAL_PROMPT }), 50);
  }, [setMessages, sendMessage]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insightBusy = isBusy && !insightMessage;
  const insightStreaming = isBusy && !!insightMessage && chatMessages.length === 0;

  return (
    <div className="space-y-6">

      {/* ── Operational Insights ─────────────────────────────────────── */}
      <div className="glass-surface overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Operational Insights</h2>
              <p className="text-xs text-muted-foreground">Auto-generated from live data</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isBusy}
            className="size-8 text-muted-foreground hover:text-foreground"
            title="Refresh insights"
          >
            <RefreshCw className={`size-4 ${isBusy ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="p-6">
          {insightBusy && (
            <div className="flex items-center gap-1.5 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </div>
          )}

          {insightMessage && (
            <MessageParts
              message={insightMessage}
              showCursor={insightStreaming}
              animated
            />
          )}
        </div>
      </div>

      {/* ── Ask the AI ───────────────────────────────────────────────── */}
      <div className="glass-surface overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-muted-foreground">
            <MessageSquare className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Ask the AI</h2>
            <p className="text-xs text-muted-foreground">Follow-up questions about the hotel</p>
          </div>
        </div>

        <div className="min-h-[200px] p-6">
          {chatMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No questions yet. Ask anything about operations, revenue, or maintenance below.
            </p>
          ) : (
            <div className="space-y-6">
              {chatMessages.map((message, i) => {
                const isUser = message.role === "user";
                const isLastAssistant = !isUser && i === chatMessages.length - 1 && isBusy;

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
                        isUser ? "bg-primary/15 text-primary" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        isUser ? "bg-primary/10 text-foreground" : "bg-white/5 text-foreground"
                      }`}
                    >
                      {isUser ? (
                        <span className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.parts
                            .filter((p): p is { type: "text"; text: string } => p.type === "text")
                            .map((p) => p.text)
                            .join("")}
                        </span>
                      ) : (
                        <MessageParts message={message} showCursor={isLastAssistant} />
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about occupancy, revenue, maintenance…"
              className="max-h-[120px] min-h-[44px] resize-none border-white/10 bg-white/5 focus-visible:ring-primary/30"
              rows={1}
              disabled={isBusy}
            />
            <Button
              type="submit"
              disabled={isBusy || !input.trim()}
              size="icon"
              className="size-11 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>

    </div>
  );
}
