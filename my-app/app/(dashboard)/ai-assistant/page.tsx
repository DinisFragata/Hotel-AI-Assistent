import AiAssistantChat from "@/components/ai-assistant/ai-assistant-chat";

export default function AiAssistantPage() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">

        <div className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Intelligence
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
            AI Assistant
          </h1>
        </div>

        <AiAssistantChat />

      </div>
    </section>
  );
}
