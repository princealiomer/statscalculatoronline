export function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, csv: string) {
  downloadText(filename, csv, "text/csv;charset=utf-8");
}

/** HTML Word doc — opens cleanly in Microsoft Word / Google Docs. */
export function downloadDoc(filename: string, htmlBody: string, title: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body>${htmlBody}</body></html>`;
  downloadText(filename, html, "application/msword;charset=utf-8");
}

export function printPdfHtml(title: string, htmlBody: string) {
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!win) {
    throw new Error("Pop-up blocked. Allow pop-ups to save/print the PDF report.");
  }
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; color: #042f2e; margin: 40px; line-height: 1.5; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    h2 { font-size: 16px; margin-top: 24px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; font-size: 13px; }
    th { background: #f3faf7; }
    .meta { color: #555; font-size: 12px; margin-bottom: 16px; }
    .mono { font-family: ui-monospace, Consolas, monospace; }
    ul { padding-left: 18px; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  ${htmlBody}
  <script>window.onload = function(){ window.focus(); window.print(); };<\/script>
</body>
</html>`);
  win.document.close();
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export { escapeHtml };
