import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMetricValue } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "info" | "success" | "warning";
}) {
  const badgeTone = tone === "neutral" ? "neutral" : tone === "info" ? "info" : tone === "success" ? "success" : "warning";

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <Badge variant={badgeTone}>{label}</Badge>
        <div>
          <p className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{formatMetricValue(value)}</p>
          <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">Current operational snapshot</p>
        </div>
      </CardContent>
    </Card>
  );
}
