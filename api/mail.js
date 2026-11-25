/* ============ EDIT ONLY THIS BLOCK ============ */
const MAIL = {
  // Multiple ids: put each one in quotes, separated by commas
  to:  ["person1@example.com", "person2@example.com"],
  cc:  ["cc1@example.com", "cc2@example.com"],
  bcc: ["bcc1@example.com", "bcc2@example.com"],   // leave as [] if not needed

  subject: "Your subject here",

  // Use backticks so line breaks are kept as typed
  body: `Hello,

Write your email content here.

updated content

Regards,
Your Name`
};
/* ============================================== */

const e = encodeURIComponent;
const join = arr => arr.map(s => s.trim()).filter(Boolean).join(",");

module.exports = (req, res) => {
  const to = join(MAIL.to), cc = join(MAIL.cc), bcc = join(MAIL.bcc);

  const gmail = "https://mail.google.com/mail/?view=cm&fs=1&" +
    [["to", to], ["cc", cc], ["bcc", bcc], ["su", MAIL.subject], ["body", MAIL.body]]
      .filter(p => p[1]).map(p => p[0] + "=" + e(p[1])).join("&");

  const mailto = "mailto:" + to + "?" +
    [["cc", cc], ["bcc", bcc], ["subject", MAIL.subject], ["body", MAIL.body]]
      .filter(p => p[1]).map(p => p[0] + "=" + e(p[1])).join("&");

  const isMobile = /Android|iPhone|iPad|iPod/i.test(req.headers["user-agent"] || "");

  // Server-side redirect: phones open the mail app (Gmail app), computers open Gmail in the browser
  res.statusCode = 302;
  res.setHeader("Location", isMobile ? mailto : gmail);
  res.setHeader("Cache-Control", "no-store");
  res.end();
};
