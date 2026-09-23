"use client";

import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, MessageSquare, RotateCcw, Send, User, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AnalyticsRoomStatusChart from "@/components/analytics/analytics-room-status-chart";

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
      // Strip any incomplete ** markers mid-render while streaming
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
  const segments = text.split(/(^#{2,3} .+$)/m);
  segments.forEach((seg, i) => {
    if (/^#{2,3} /.test(seg)) {
      result.push(
        <p key={`h${i}`} className="mb-1.5 mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary first:mt-0">
          {seg.replace(/^#{2,3} /, "")}
        </p>,
      );
    } else if (seg) {
      result.push(...renderInlineMarkdown(seg, `s${i}`));
    }
  });
  return result;
}

function MessageParts({ message, showCursor }: { message: UIMessage; showCursor: boolean }) {
  const nodes: React.ReactNode[] = [];

  message.parts.forEach((part, i) => {
    const isLastPart = i === message.parts.length - 1;

    if (part.type === "text" && "text" in part) {
      const text = (part as { type: "text"; text: string }).text;
      if (text) {
        nodes.push(
          <div key={`text-${i}`} className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {renderMarkdown(text)}
            {showCursor && isLastPart && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-muted-foreground align-middle" />
            )}
          </div>,
        );
      }
      return;
    }

    // AI SDK tool parts are typed "tool-<toolName>"
    if (!part.type.startsWith("tool-")) return;
    const toolPart = part as { type: string; state?: string; output?: unknown };
    if (toolPart.state !== "output-available" || !toolPart.output) return;
    const toolName = part.type.slice("tool-".length);

    if (toolName === "showMetricCards") {
      const { metrics } = toolPart.output as { metrics: MetricCard[] };
      nodes.push(
        <div key={`metrics-${i}`} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
    } else if (toolName === "showRoomStatusChart") {
      const output = toolPart.output as { breakdown: RoomStatusEntry[]; total: number };
      nodes.push(
        <div key={`chart-${i}`} className="mt-4 max-w-xs">
          <AnalyticsRoomStatusChart breakdown={output.breakdown} total={output.total} />
        </div>,
      );
    } else if (toolName === "showRoomList") {
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
    } else if (toolName === "showMaintenanceSummary") {
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
  const { messages, sendMessage, setMessages, status, error, clearError } = useChat();
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleNewChat = () => {
    clearError();
    setMessages([]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    if (error) clearError();
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const lastMessage = messages[messages.length - 1];
  const waitingForReply = isBusy && lastMessage?.role !== "assistant";

  return (
    // Fills the viewport below the fixed header (5rem / 6rem) minus the page padding
    <div className="glass-surface flex h-[calc(100dvh-6.5rem)] min-h-[320px] flex-col overflow-hidden rounded-3xl md:h-[calc(100dvh-7.5rem)]">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
        {messages.length === 0 && !error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <p className="text-base font-semibold">AI Assistant</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Ask anything about occupancy, revenue, or maintenance below.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, i) => {
              const isUser = message.role === "user";
              const isLastAssistant = !isUser && i === messages.length - 1 && isBusy;

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
                    className={`min-w-0 rounded-2xl px-4 py-3 ${
                      isUser ? "max-w-[80%] bg-primary/10 text-foreground" : "max-w-[90%] bg-white/5 text-foreground"
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

            {waitingForReply && (
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 px-4 py-4">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-medium">Could not reach the AI assistant.</p>
                  <p className="mt-0.5 text-xs opacity-80">{error.message}</p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            disabled={isBusy || (messages.length === 0 && !error)}
            className="size-11 shrink-0 text-muted-foreground hover:text-foreground"
            title="New chat"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about occupancy, revenue, maintenance…"
            className="max-h-[120px] min-h-[44px] resize-none border-white/10 bg-white/5 focus-visible:ring-primary/30"
            rows={1}
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
  );
}
