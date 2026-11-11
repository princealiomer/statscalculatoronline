/** Keep Windows / phone download managers happy with a clean ASCII filename + forced extension. */
export function safeFilename(name: string, extension: string) {
  const ext = extension.replace(/^\./, "").toLowerCase();
  const base = name
    .replace(/\.[a-z0-9]{1,8}$/i, "")
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${base || "statscalc-report"}.${ext}`;
}

/** Trigger a file download from binary/text bytes with a reliable extension. */
export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.type = blob.type || "application/octet-stream";
  a.style.display = "none";
  document.body.appendChild(a);
  // Some mobile browsers need the element in-DOM + a real user-gesture click.
  a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  window.setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 4000);
}

function utf8Blob(text: string, mime: string) {
  // Prefer string BlobPart — avoids TS DOM lib friction with Uint8Array generics.
  return new Blob([text], { type: mime });
}

export function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  downloadBlob(filename, utf8Blob(content, mime));
}

/**
 * CSV for Excel / Google Sheets / Numbers.
 * Uses UTF-8 BOM + CRLF so Windows Excel recognizes encoding and opens cleanly.
 */
export function downloadCsv(filename: string, csv: string) {
  const name = safeFilename(filename, "csv");
  const normalized = `\uFEFF${csv.replace(/\r?\n/g, "\r\n")}`;
  // application/octet-stream + .csv extension is the most reliable way to force the extension
  // on Windows when browsers ignore text/csv for blob downloads.
  downloadBlob(name, utf8Blob(normalized, "application/octet-stream"));
}

/** Plain-text report — opens in Notepad, phones, and screen readers. */
export function downloadTxt(filename: string, text: string) {
  const name = safeFilename(filename, "txt");
  const normalized = text.replace(/\r?\n/g, "\r\n");
  downloadBlob(name, utf8Blob(normalized, "text/plain;charset=utf-8"));
}

/**
 * RTF report for Microsoft Word / WordPad / LibreOffice / Google Docs (upload).
 * Real RTF — not HTML renamed as .doc (which modern Word often marks corrupt).
 */
export function downloadRtf(filename: string, rtf: string) {
  const name = safeFilename(filename, "rtf");
  downloadBlob(name, utf8Blob(rtf, "application/rtf"));
}

/** @deprecated Prefer downloadRtf — kept for any older callers. */
export function downloadDoc(filename: string, htmlBody: string, title: string) {
  // Serve as .html so the file is never a fake binary .doc
  downloadPrintableHtml(filename.replace(/\.docx?$/i, ".html"), title, htmlBody);
}

/** Download a self-contained printable HTML report (PDF fallback / open in browser). */
export function downloadPrintableHtml(filename: string, title: string, htmlBody: string) {
  const name = safeFilename(filename, "html");
  const html = printableDocument(title, htmlBody, { autoPrint: false });
  downloadBlob(name, utf8Blob(html, "text/html;charset=utf-8"));
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
