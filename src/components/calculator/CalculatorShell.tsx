import Link from "next/link";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { fieldsForEngine } from "@/lib/calculators/fields";
import { CalculatorRunner } from "@/components/calculator/CalculatorRunner";
import { CalculatorGuide } from "@/components/calculator/CalculatorGuide";
import { SimilarCalculatorsWidget } from "@/components/widgets/SimilarCalculatorsWidget";
import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { getSimilarCalculators } from "@/lib/calculators/related";
import { tidbitsForPath } from "@/lib/content/tidbits";
import { calculatorAnswerBlock } from "@/lib/calculators/seo";
import { siteConfig } from "@/config/site";
import { resourceLinks } from "@/config/nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CalculatorShell({ calculator }: { calculator: CalculatorDef }) {
  const category = getCategory(calculator.category);
  const fields = fieldsForEngine(calculator.engine);
  const similar = getSimilarCalculators(calculator, 8);
  const tips = tidbitsForPath(`${calculator.category}/${calculator.slug}`, 3);
  const answerBlock = calculatorAnswerBlock(calculator);

  return (
    <article className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/calculators" />}>Calculators</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/calculators/${calculator.category}`} />}>
              {category?.name ?? calculator.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{calculator.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-5 flex max-w-3xl flex-col gap-4 sm:mt-6">
        <Badge variant="secondary">
          {siteConfig.name}
          {category ? ` · ${category.name}` : ""}
        </Badge>
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {calculator.title} Calculator
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          {answerBlock}
        </p>
        <p className="text-xs text-muted-foreground">
          Free on Stats Calculator Online · Last updated {siteConfig.contentUpdated} · Formulas,
          steps, FAQ, and PDF / Word / CSV exports included
        </p>
        <Alert>
          <AlertTitle>Free PDF reports</AlertTitle>
          <AlertDescription>
            After you calculate, export a Stats Calculator Online–branded PDF that shows what was
            entered, which formulas were used, what was computed step-by-step, and the final answers
            — ready for homework, lab notebooks, or drafts.
          </AlertDescription>
        </Alert>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" className="min-h-10" render={<a href="#calculator" />} nativeButton={false}>
            Open calculator
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-10 bg-card"
            render={<a href="#guide" />}
            nativeButton={false}
          >
            Full guide outline
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-10 bg-card"
            render={<a href="#formula" />}
            nativeButton={false}
          >
            Formula
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-10 bg-card"
            render={<a href="#exports" />}
            nativeButton={false}
          >
            PDF / Word / CSV
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-10 bg-card"
            render={<a href="#similar" />}
            nativeButton={false}
          >
            Similar tools
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-10 bg-card"
            render={<a href="#faq" />}
            nativeButton={false}
          >
            FAQ
          </Button>
        </div>
      </header>

      <div id="calculator" className="mt-6 scroll-mt-24 sm:mt-8">
        <CalculatorRunner calculator={calculator} fields={fields} />
      </div>

      <div className="mt-8">
        <TidbitsWidget items={tips} title="Tidbits while you work" />
      </div>

      <CalculatorGuide calculator={calculator} />

      <div id="similar" className="mt-10 flex scroll-mt-24 flex-col gap-8 sm:mt-12">
        <SimilarCalculatorsWidget
          items={similar}
          title={`Similar calculators to ${calculator.title}`}
          subtitle={`Related tools in ${category?.name ?? "this topic"} and nearby categories on Stats Calculator Online`}
        />

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Keep learning on Stats Calculator Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {category && (
                <li>
                  <Button
                    size="sm"
                    variant="secondary"
                    render={<Link href={`/calculators/${calculator.category}`} />}
                    nativeButton={false}
                  >
                    More {category.name}
                  </Button>
                </li>
              )}
              <li>
                <Button
                  size="sm"
                  variant="secondary"
                  render={
                    <Link href="/calculators/hypothesis-testing/statistical-test-flow-chart" />
                  }
                  nativeButton={false}
                >
                  Test selector
                </Button>
              </li>
              {resourceLinks.slice(0, 4).map((r) => (
                <li key={r.href}>
                  <Button
                    size="sm"
                    variant="secondary"
                    render={<Link href={r.href} />}
                    nativeButton={false}
                  >
                    {r.title}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
