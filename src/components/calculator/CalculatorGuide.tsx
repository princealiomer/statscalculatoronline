import Link from "next/link";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCalculatorOutline } from "@/lib/calculators/explain";
import { Formula } from "@/components/calculator/Formula";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

function SectionNav({ tool }: { tool: string }) {
  const items = [
    { href: "#what-is", label: "1. What is it?" },
    { href: "#why", label: "2. Why it matters" },
    { href: "#how-used", label: "3. How it’s used" },
    { href: "#formula", label: "4. Formula" },
    { href: "#results-guide", label: "5. Results" },
    { href: "#workflow", label: "6. How to act" },
    { href: "#ui-tips", label: "UI tips" },
    { href: "#faq", label: "Troubleshooting" },
    { href: "#benchmarks", label: "Benchmarks" },
    { href: "#integrations", label: "Integrations" },
  ];
  return (
    <nav aria-label={`${tool} guide sections`} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Button
          key={item.href}
          size="sm"
          variant="outline"
          className="bg-card"
          render={<a href={item.href} />}
          nativeButton={false}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}

export function CalculatorGuide({ calculator }: { calculator: CalculatorDef }) {
  const o = getCalculatorOutline(calculator);
  const tool = o.toolName;

  return (
    <section
      id="guide"
      className="mt-10 flex scroll-mt-24 flex-col gap-10 sm:mt-12 sm:gap-12"
      aria-labelledby="guide-heading"
    >
      <header className="flex flex-col gap-3">
        <Badge variant="secondary">{siteConfig.name} guide</Badge>
        <h2
          id="guide-heading"
          className="font-display text-2xl leading-tight text-foreground sm:text-3xl"
        >
          Understanding &amp; Using {tool}
        </h2>
        <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          A complete outline for the free {tool} calculator: definition, purpose, practical uses,
          formulas, how to read results, action workflow, troubleshooting, benchmarks, and how this
          metric connects to the rest of your stack.
        </p>
        <SectionNav tool={tool} />
      </header>

      <section id="what-is" className="flex scroll-mt-24 flex-col gap-4">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          1. What Is {tool}? (Definition &amp; Core Concept)
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="outline">High-level definition</Badge>
              <CardDescription className="text-[15px] leading-relaxed text-foreground/80">
                {o.whatIs.definition}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="outline">What problem it solves</Badge>
              <CardDescription className="text-[15px] leading-relaxed text-foreground/80">
                {o.whatIs.problemSolved}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground">Key components</h4>
          <ul className="list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
            {o.whatIs.keyComponents.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="why" className="flex scroll-mt-24 flex-col gap-4">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          2. Why Is {tool}? (Purpose &amp; Importance)
        </h3>
        <Card>
          <CardContent className="flex flex-col gap-3 pt-(--card-spacing) text-[15px] leading-relaxed text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Business &amp; SEO value: </span>
              {o.why.value}
            </p>
            <p>
              <span className="font-semibold text-foreground">What happens without it: </span>
              {o.why.withoutIt}
            </p>
            <p>
              <span className="font-semibold text-foreground">When to rely on it: </span>
              {o.why.whenToRely}
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="how-used" className="flex scroll-mt-24 flex-col gap-4">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          3. How Is {tool} Used? (Context &amp; Practical Applications)
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          {o.howUsed.roles.map((r) => (
            <Card key={r.role}>
              <CardHeader>
                <CardTitle className="text-sm">{r.role}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-xs leading-relaxed text-muted-foreground">
                  {r.uses.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <Alert>
          <AlertTitle>Real-world scenario</AlertTitle>
          <AlertDescription>{o.howUsed.scenario}</AlertDescription>
        </Alert>
      </section>

      <section id="formula" className="flex scroll-mt-24 flex-col gap-4">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          4. What Is the Formula? (The Mechanics Behind {tool})
        </h3>
        <p className="text-sm text-muted-foreground">{o.formula.intro}</p>
        {o.formula.formulas.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {o.formula.formulas.map((f) => (
              <li key={f.label + f.latex}>
                <Card className="min-w-0">
                  <CardHeader>
                    <Badge variant="secondary">{f.label}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="formula-scroll min-h-9 max-w-full overflow-x-auto">
                      <Formula latex={f.latex} />
                    </div>
                    {f.note ? <p className="mt-2 text-xs text-muted-foreground">{f.note}</p> : null}
                    <p className="sr-only">
                      {f.label}: {f.latex}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground">Variable breakdown</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {o.formula.variableBreakdown.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sample calculation</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {o.formula.sampleCalculation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tip: use the live calculator above as your interactive mini-worksheet—enter your own
              numbers to regenerate the result instantly.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="results-guide" className="flex scroll-mt-24 flex-col gap-4">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          5. What Are the Results? (Interpreting Outputs &amp; Benchmarks)
        </h3>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground">Decoding the numbers</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {o.results.decoding.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Alert variant="destructive">
            <AlertTitle>Common patterns &amp; red flags</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc pl-5">
                {o.results.redFlags.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Hidden wins</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc pl-5">
                {o.results.hiddenWins.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Impact assessment: </span>
          {o.results.impact}
        </p>
      </section>

      <section id="workflow" className="flex scroll-mt-24 flex-col gap-4">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          6. How to Use {tool}? (Actionable Implementation Guide)
        </h3>
        <ol className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["Audit", o.workflow.audit],
              ["Diagnose", o.workflow.diagnose],
              ["Execute", o.workflow.execute],
              ["Measure", o.workflow.measure],
            ] as const
          ).map(([label, text], i) => (
            <li key={label}>
              <Card>
                <CardHeader>
                  <Badge variant="secondary">
                    Step {i + 1} · {label}
                  </Badge>
                  <CardDescription className="text-sm leading-relaxed">{text}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section id="ui-tips" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          Visual &amp; interactive enhancements on this page
        </h3>
        <p className="text-sm text-muted-foreground">
          Annotated path through the Stats Calculator Online {tool} interface—no separate dashboard
          login required.
        </p>
        <ol className="list-decimal pl-5 text-sm text-muted-foreground">
          {o.uiTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button variant="link" className="h-auto px-0" render={<a href="#calculator" />} nativeButton={false}>
            ↑ Jump to the live {tool} calculator
          </Button>
          <Button
            variant="link"
            className="h-auto px-0"
            render={<Link href="/sitemap" />}
            nativeButton={false}
          >
            Browse all calculators in the HTML sitemap
          </Button>
        </div>
      </section>

      <section id="faq" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          Troubleshooting &amp; FAQ
        </h3>
        {/* Visible Q&A (not accordion-only) so crawlers and AI agents can extract answers from HTML */}
        <dl className="flex flex-col gap-3">
          {o.troubleshooting.map((item) => (
            <div
              key={item.q}
              className="rounded-md border bg-card px-3 py-3 sm:px-4"
            >
              <dt className="text-[15px] font-medium text-foreground">{item.q}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-sm">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="benchmarks" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          Industry benchmarks &amp; segment variations
        </h3>
        <p className="text-sm text-muted-foreground">
          Acceptable thresholds for {tool} shift by business model and channel—use these as starting
          guidance, not universal law.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {o.benchmarks.map((b) => (
            <li key={b.segment}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{b.segment}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{b.guidance}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section id="integrations" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="font-display text-xl text-foreground sm:text-2xl">
          Integration with other metrics (the holistic view)
        </h3>
        <Separator />
        <ul className="list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
          {o.integrations.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
