/** Trigger a file download from a Blob or string. */
export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the browser has a chance to start the download
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  downloadBlob(filename, new Blob([content], { type: mime }));
}

/** CSV with UTF-8 BOM so Excel opens accented characters correctly. */
export function downloadCsv(filename: string, csv: string) {
  const bom = "\uFEFF";
  downloadBlob(filename, new Blob([bom + csv], { type: "text/csv;charset=utf-8" }));
}

/** HTML Word doc — opens cleanly in Microsoft Word / Google Docs / LibreOffice. */
export function downloadDoc(filename: string, htmlBody: string, title: string) {
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <meta name="ProgId" content="Word.Document" />
  <meta name="Generator" content="Stats Calculator Online" />
  <title>${escapeHtml(title)}</title>
  <!--[if gte mso 9]><xml>
    <w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument>
  </xml><![endif]-->
  <style>
    body { font-family: Calibri, Arial, sans-serif; color: #1a1f2c; margin: 36px; line-height: 1.5; font-size: 12pt; }
    .brand-banner { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #1a1f2c; color: #fff; margin: -36px -36px 18px; }
    .brand-mark { width: 36px; height: 36px; background: #0d7377; color: #f5d78e; font-weight: 700; font-family: Georgia, serif; display: flex; align-items: center; justify-content: center; font-size: 11pt; }
    .brand-name { margin: 0; font-size: 14pt; font-weight: 700; }
    .brand-tag { margin: 2px 0 0; font-size: 9pt; opacity: 0.85; }
    .report-kicker { color: #0d7377; font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 6px; }
    h1 { font-size: 20pt; color: #0d7377; margin: 0 0 6px; }
    h2 { font-size: 13pt; color: #1a1f2c; margin-top: 20px; border-bottom: 1px solid #d8dce3; padding-bottom: 4px; }
    .sec { display: inline-block; min-width: 1.4em; color: #0d7377; }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; }
    th, td { border: 1px solid #c5cad3; padding: 6px 8px; text-align: left; font-size: 11pt; vertical-align: top; }
    th { background: #f3f4f6; width: 34%; }
    .meta { color: #4b5568; font-size: 10pt; margin-bottom: 12px; }
    .mono { font-family: Consolas, "Courier New", monospace; }
    .toc { background: #f3f4f6; padding: 10px 14px; margin: 14px 0; border-left: 4px solid #0d7377; }
    .formula-card { border: 1px solid #d8dce3; padding: 8px 10px; margin: 8px 0; }
    .formula-label { font-weight: 700; margin: 0 0 4px; }
    .formula-math { margin: 0; background: #f8faf9; padding: 6px; }
    .formula-note { margin: 4px 0 0; color: #4b5568; font-size: 10pt; }
    .work-list { list-style: none; padding: 0; }
    .work-item { display: flex; gap: 10px; margin: 8px 0; }
    .work-num { background: #0d7377; color: #fff; width: 22px; height: 22px; text-align: center; border-radius: 4px; font-size: 10pt; line-height: 22px; flex-shrink: 0; }
    .work-title { margin: 0; font-weight: 700; }
    .work-detail { margin: 2px 0 0; color: #4b5568; }
    .result-value { font-weight: 700; }
    .brand-footer { margin-top: 28px; padding-top: 12px; border-top: 2px solid #0d7377; color: #4b5568; font-size: 9pt; }
    ul, ol { padding-left: 22px; }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;
  // .doc HTML is widely supported; .docx would need a binary package.
  const safeName = filename.endsWith(".doc") ? filename : `${filename.replace(/\.docx?$/i, "")}.doc`;
  downloadBlob(safeName, new Blob([html], { type: "application/msword;charset=utf-8" }));
}

/** Download a self-contained printable HTML report (PDF fallback when pop-ups are blocked). */
export function downloadPrintableHtml(filename: string, title: string, htmlBody: string) {
  const html = printableDocument(title, htmlBody, { autoPrint: false });
  const safeName = filename.endsWith(".html") ? filename : `${filename}.html`;
  downloadBlob(safeName, new Blob([html], { type: "text/html;charset=utf-8" }));
}

/**
 * Open a print-ready window so the user can Save as PDF.
 * Returns false if the pop-up was blocked (caller should offer HTML download).
 */
export function printPdfHtml(title: string, htmlBody: string): boolean {
  const win = window.open("", "_blank", "noopener,noreferrer,width=920,height=720");
  if (!win) return false;
  win.document.open();
  win.document.write(printableDocument(title, htmlBody, { autoPrint: true }));
  win.document.close();
  return true;
}

function printableDocument(title: string, htmlBody: string, opts: { autoPrint: boolean }) {
  const printScript = opts.autoPrint
    ? `<script>
        window.onload = function () {
          window.focus();
          setTimeout(function () { window.print(); }, 250);
        };
      <\/script>`
    : `<p class="meta print-hint"><strong>Tip:</strong> Use your browser’s Print → Save as PDF to keep a PDF copy.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light; }
    body { font-family: Georgia, "Times New Roman", serif; color: #1a1f2c; margin: 0; padding: 0 0 36px; line-height: 1.55; background: #fff; }
    .brand-banner { display: flex; align-items: center; gap: 14px; padding: 16px 36px; background: #1a1f2c; color: #fff; }
    .report-body { padding: 18px 36px 8px; }
    .brand-mark { width: 42px; height: 42px; background: #0d7377; color: #f5d78e; font-weight: 700; font-family: Georgia, "Times New Roman", serif; display: flex; align-items: center; justify-content: center; font-size: 13px; letter-spacing: 0.02em; border-radius: 4px; }
    .brand-name { margin: 0; font-size: 18px; font-weight: 700; }
    .brand-tag { margin: 3px 0 0; font-size: 11px; opacity: 0.82; letter-spacing: 0.04em; text-transform: uppercase; }
    .report-kicker { color: #0d7377; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; margin: 18px 0 6px; }
    h1 { font-size: 24px; margin: 0 0 6px; color: #0d7377; }
    h2 { font-size: 15px; margin-top: 26px; border-bottom: 1px solid #d8dce3; padding-bottom: 5px; color: #1a1f2c; }
    .sec { display: inline-flex; align-items: center; justify-content: center; min-width: 1.35em; margin-right: 6px; color: #0d7377; font-weight: 700; }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; }
    th, td { border: 1px solid #c5cad3; padding: 8px 10px; text-align: left; font-size: 13px; vertical-align: top; }
    th { background: #f3f4f6; width: 34%; font-weight: 600; }
    .results-table th { background: #e8f3f3; }
    .result-value { font-weight: 700; color: #0a5c5f; }
    .meta { color: #4b5568; font-size: 12px; margin-bottom: 14px; }
    .mono { font-family: ui-monospace, Consolas, monospace; font-size: 12px; white-space: pre-wrap; word-break: break-word; }
    ul, ol { padding-left: 18px; margin: 8px 0; }
    pre.mono { background: #f3f4f6; padding: 10px; border-radius: 6px; overflow: auto; }
    .toc { background: #f3f4f6; border-left: 4px solid #0d7377; padding: 12px 16px; margin: 16px 0 8px; border-radius: 0 8px 8px 0; }
    .toc ol { margin: 6px 0 0; }
    .formula-card { border: 1px solid #d8dce3; border-radius: 8px; padding: 10px 12px; margin: 10px 0; background: #fafbfc; }
    .formula-label { font-weight: 700; margin: 0 0 4px; font-size: 13px; }
    .formula-math { margin: 0; background: #fff; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; }
    .formula-note { margin: 6px 0 0; color: #4b5568; font-size: 12px; }
    .work-list { list-style: none; padding: 0; margin: 10px 0; }
    .work-item { display: flex; gap: 12px; margin: 10px 0; align-items: flex-start; }
    .work-num { flex-shrink: 0; width: 26px; height: 26px; border-radius: 6px; background: #0d7377; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; }
    .work-title { margin: 0; font-weight: 700; font-size: 14px; }
    .work-detail { margin: 3px 0 0; color: #4b5568; font-size: 13px; }
    .brand-footer { margin-top: 32px; padding: 16px 0 8px; border-top: 3px solid #0d7377; color: #4b5568; font-size: 11px; }
    .brand-footer p { margin: 4px 0; }
    .print-hint { margin: 28px 36px; padding: 10px 12px; background: #f3f4f6; border-radius: 8px; }
    @media print {
      .brand-banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .work-num, .brand-mark, .results-table th, .toc { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-hint { display: none; }
      a { color: inherit; text-decoration: none; }
      body { padding-bottom: 12px; }
      .report-body { padding: 12px 20px 4px; }
      .brand-banner { padding: 12px 20px; }
    }
  </style>
</head>
<body>
  ${htmlBody}
  ${printScript}
</body>
</html>`;
}

export async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // fall through to textarea fallback
    }
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  if (!ok) throw new Error("Could not copy to clipboard.");
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export { escapeHtml };
