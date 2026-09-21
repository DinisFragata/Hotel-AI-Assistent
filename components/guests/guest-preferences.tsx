type GuestPreferencesProps = {
  preferredLanguage: string | null;
  preferredRoomType: string | null;
  specialRequests: string | null;
};

export function GuestPreferences({
  preferredLanguage,
  preferredRoomType,
  specialRequests,
}: GuestPreferencesProps) {
  const hasPreferences =
    preferredLanguage ||
    preferredRoomType ||
    specialRequests;

  if (!hasPreferences) {
    return (
      <section>
        <h2 className="text-sm font-semibold">
          Preferences
        </h2>

        <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-white/2 p-4">
          <p className="text-sm text-muted-foreground">
            No guest preferences recorded.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <PreferenceItem
          label="Preferred language"
          value={preferredLanguage}
        />

        <PreferenceItem
          label="Room preference"
          value={preferredRoomType}
        />

        <div className="sm:col-span-2">
          <PreferenceItem
            label="Special requests"
            value={specialRequests}
            multiline
          />
        </div>
      </div>
    </section>
  );
}

function PreferenceItem({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-2 text-sm font-medium",
          multiline && "whitespace-pre-wrap leading-6",
          !value && "text-muted-foreground",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value ?? "Not specified"}
      </p>
    </div>
  );
}