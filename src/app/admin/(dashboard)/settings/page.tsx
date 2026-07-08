import { getEventSettings } from "@/lib/queries";
import { ShareSettingsForm } from "@/components/admin/share-settings-form";

export const metadata = { title: "Share Settings — Admin" };

const DEFAULT_WHATSAPP = `🏆 *{competition}* — {category}
📍 *SSF Malappuram West Sahityotsav 2026*

🥇 1st: *{winner1}* ({team1})
🥈 2nd: *{winner2}* ({team2})
🥉 3rd: *{winner3}* ({team3})

🔗 View full result:
{url}`;

const DEFAULT_INSTAGRAM = `🏆 {competition} Results — {category}
📍 SSF Malappuram West Sahityotsav 2026

🥇 {winner1} — {team1}
🥈 {winner2} — {team2}
🥉 {winner3} — {team3}

#SSFMalappuram #Sahityotsav2026 #Results #Kerala`;

const VARIABLES = [
  { key: "{competition}", desc: "Competition / item name" },
  { key: "{category}", desc: "Category name" },
  { key: "{winner1}", desc: "1st place participant name" },
  { key: "{winner2}", desc: "2nd place participant name" },
  { key: "{winner3}", desc: "3rd place participant name" },
  { key: "{team1}", desc: "1st place team/division" },
  { key: "{team2}", desc: "2nd place team/division" },
  { key: "{team3}", desc: "3rd place team/division" },
  { key: "{url}", desc: "Direct link to result page" },
];

export default async function SettingsPage() {
  const settings = await getEventSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Share Settings</h1>
        <p className="text-sm text-muted-foreground">
          Customize the text that gets shared when users tap the WhatsApp or Instagram share button on a result poster.
        </p>
      </div>

      {/* Variable reference */}
      <div className="rounded-xl border bg-muted/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Available variables — insert these in your templates
        </p>
        <div className="flex flex-wrap gap-2">
          {VARIABLES.map((v) => (
            <div
              key={v.key}
              className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1 text-xs"
            >
              <code className="font-mono font-semibold text-primary">{v.key}</code>
              <span className="text-muted-foreground">— {v.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <ShareSettingsForm
        whatsappTemplate={settings?.whatsappTemplate ?? DEFAULT_WHATSAPP}
        instagramCaption={settings?.instagramCaption ?? DEFAULT_INSTAGRAM}
      />
    </div>
  );
}
