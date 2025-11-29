/* ---------------------------------------------------------
   GENERAL COUNSELING TIPS — LOAD ON PAGE START
---------------------------------------------------------- */
function loadGeneralCounseling() {
  const generalTips = [
    { title: "📚 Academic Focus", desc: "Prioritize consistent study time, homework completion, and seeking help immediately when struggling." },
    { title: "🤝 Social Engagement", desc: "Encourage participation in extracurricular activities or clubs to build a positive connection with the school environment." },
    { title: "👨‍👩‍👧‍👦 Parental Contact", desc: "Maintain an open line of communication with parents/guardians to ensure continuous support." },
    { title: "💡 Wellness Check", desc: "Ensure the student is aware of mental health services and is getting adequate sleep and nutrition." }
  ];

  const container = document.getElementById("counseling-tips-container");
  container.innerHTML = "";

  // Dynamically create and append the general tips to the DOM
  generalTips.forEach(t => {
    const div = document.createElement("div");
    div.className = "tip-box";
    div.innerHTML = `
      <strong>${t.title}</strong>
      <div style="margin-top:6px;font-size:14px">${t.desc}</div>
    `;
    container.appendChild(div);
  });
}

// Ensure general tips are loaded immediately when the page loads
window.addEventListener("load", loadGeneralCounseling);


/* ---------------------------------------------------------
   THEME SWITCHING LOGIC (Updated to 'theme-violet')
---------------------------------------------------------- */
const THEMES = ['', 'theme-dark', 'theme-violet']; // Theme classes
let currentThemeIndex = 0;

function changeTheme() {
  const body = document.body;
  
  // Remove current theme class
  if (THEMES[currentThemeIndex]) {
    body.classList.remove(THEMES[currentThemeIndex]);
  }

  // Move to the next theme index, looping back to 0
  currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;

  // Add the new theme class
  if (THEMES[currentThemeIndex]) {
    body.classList.add(THEMES[currentThemeIndex]);
  }
}

// Attach the theme change function to the new button
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("themeToggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", changeTheme);
  }
});


/* ---------------------------------------------------------
   UTILITY FUNCTIONS
---------------------------------------------------------- */
function sanitizePhone(raw) {
  if (!raw) return "";
  // Remove all non-digit characters for WhatsApp link
  return raw.replace(/[^0-9]/g, "");
}

function makeWhatsAppLink(phoneDigits, message) {
  // Creates the official wa.me link with URL-encoded message
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}


/* ---------------------------------------------------------
   RISK CALCULATION LOGIC
---------------------------------------------------------- */
function calculateRisk(data) {
  let risk = 0;

  // Simple rule-based model for demonstration
  if (data.failures >= 2) risk += 25;
  if (data.study <= 2) risk += 20;

  if (data.absences > 20) risk += 20;
  if (data.absences > 50) risk += 30;

  if (data.g1 < 10 || data.g2 < 10 || data.g3 < 10) risk += 25;

  if (data.internet === 0) risk += 10;
  if (data.famrel <= 2) risk += 10;

  // Clamp the risk between 0 and 100
  return Math.min(100, Math.max(0, Math.round(risk)));
}


/* ---------------------------------------------------------
   COUNSELING GENERATION (DYNAMIC)
---------------------------------------------------------- */
function generateTips(risk, data) {
  const tips = [];

  // Conditional logic to generate specific counseling tips based on risk factors
  if (data.g3 < 40 || data.failures >= 3) {
    tips.push({
      title:"🚨 CRITICAL ACADEMIC RISK",
      text:`Immediate one-on-one counseling and tutoring. Final grade ${data.g3} or failures ${data.failures}.`,
      high:true
    });
  } else if (data.g3 < 60 || data.failures >= 1) {
    tips.push({
      title:"📚 Focused Academic Support",
      text:"Schedule weekly check-ins and after-school support."
    });
  }

  if (data.absences >= 15) {
    tips.push({
      title:"📅 Severe Attendance Issue",
      text:`Absences: ${data.absences}. Contact parents daily and investigate causes.`,
      high:true
    });
  } else if (data.absences >= 5) {
    tips.push({
      title:"🗓️ Monitor Attendance",
      text:`Absences: ${data.absences}. Send notifications for missed classes.`
    });
  }

  if (data.study <= 1) {
    tips.push({
      title:"⏰ Establish Study Routine",
      text:`Study time low (${data.study}/4). Introduce mentor and 30-minute study blocks.`,
      high:true
    });
  } else if (data.study <= 2) {
    tips.push({
      title:"📈 Improve Study Efficiency",
      text:"Introduce active recall and spaced repetition techniques."
    });
  }

  if (data.famrel <= 2) {
    tips.push({
      title:"💛 Urgent Family Counseling",
      text:"Refer family to school social worker.",
      high:true
    });
  } else if (data.family_edu === 'Poorly Educated') {
    tips.push({
      title:"👪 Parent Education Outreach",
      text:"Provide simple resources for parents to support study at home."
    });
  }

  if (data.internet === 0 || data.locality === 'Rural') {
    tips.push({
      title:"🌐 Bridge Resource Gaps",
      text:"Provide laptops/hotspots or dedicated school time for online tasks."
    });
  }

  if (data.age >= 18) {
    tips.push({
      title:"💼 Post-Secondary Planning",
      text:`Age ${data.age}. Discuss career/college plans to boost motivation.`
    });
  }

  // Fallback tip if no specific issues were flagged
  if (tips.length === 0) {
    if (risk < 20) {
      tips.push({
        title:"🌟 Low Risk — Maintain Progress",
        text:"Continue positive reinforcement and annual check-ins."
      });
    } else {
      tips.push({
        title:"✅ General Monitoring",
        text:`Risk ${risk}%. Monitor progress and maintain contact.`
      });
    }
  }

  return tips;
}


/* ---------------------------------------------------------
   RENDER RISK BAR + NUMBER
---------------------------------------------------------- */
function renderRisk(risk) {
  document.getElementById("riskNumber").textContent = risk + "%";
  document.getElementById("riskText").textContent = `Calculated risk score: ${risk}%`;

  const bar = document.getElementById("riskFill");
  bar.style.width = risk + "%";

  // The risk bar uses a fixed rainbow gradient defined in style.css.
}


/* ---------------------------------------------------------
   RENDER COUNSELING TIPS (RIGHT SIDE)
---------------------------------------------------------- */
function renderTipsDOM(tips) {
  const c = document.getElementById("tipsContainer");
  c.innerHTML = "";

  // Render each generated tip
  tips.forEach(t => {
    const div = document.createElement("div");
    div.className = "tip" + (t.high ? " high" : "");
    div.innerHTML = `
      <strong>${t.title}</strong>
      <div style="margin-top:6px;font-size:14px">${t.text}</div>
    `;
    c.appendChild(div);
  });
}


/* ---------------------------------------------------------
   WHATSAPP ALERT GENERATION
---------------------------------------------------------- */
function renderWhatsAppArea(risk, data) {
  const waActions = document.getElementById("waActions");
  waActions.innerHTML = "";

  if (risk < 70) {
    waActions.innerHTML = `<div style="color:var(--primary-color)">Risk below threshold — no immediate WhatsApp alert.</div>`;
    return;
  }

  const phoneDigits = sanitizePhone(data.phone);
  if (!phoneDigits) {
    waActions.innerHTML = `<div style="color:#ffc107">Invalid or missing phone number.</div>`;
    return;
  }

  const tips = generateTips(risk, data);

  // Format the message content with risk data and specific tips
  let counselingText = "📘 *Recommended Counseling Strategies:*\n\n";
  tips.forEach((t, i) => {
    counselingText += `*${i + 1}. ${t.title}*\n${t.text}\n\n`;
  });

  const message =
    `⚠️ *STUDENT DROPOUT ALERT*\n\n` +
    `*Risk Level:* ${risk}%\n` +
    `*Age:* ${data.age}\n` +
    `*Absences:* ${data.absences}\n` +
    `*Failures:* ${data.failures}\n\n` +
    counselingText +
    `Please contact the school counselor immediately.`;

  const waLink = makeWhatsAppLink(phoneDigits, message);

  // Create buttons for user interaction
  const sendBtn = document.createElement("button");
  sendBtn.className = "open-wa";
  sendBtn.textContent = "📲 Send WhatsApp Alert";
  sendBtn.onclick = () => window.open(waLink, "_blank");

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "📋 Copy Message";
  copyBtn.onclick = () =>
    navigator.clipboard.writeText(message).then(() => alert("Message copied!"));

  waActions.appendChild(sendBtn);
  waActions.appendChild(copyBtn);
}


/* ---------------------------------------------------------
   FORM SUBMIT HANDLER
---------------------------------------------------------- */
document.getElementById("predictForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // 1. Get form data
  const data = Object.fromEntries(new FormData(e.target).entries());
  // Convert fields that are numbers back to number type
  Object.keys(data).forEach(k => (data[k] = isNaN(data[k]) ? data[k] : Number(data[k])));

  // 2. Calculate risk
  const risk = calculateRisk(data);

  // 3. Render results
  renderRisk(risk);
  renderTipsDOM(generateTips(risk, data));
  renderWhatsAppArea(risk, data);

  // 4. Scroll to the results (UX improvement)
  document.getElementById("riskNumber").scrollIntoView({ behavior: "smooth" });
});


/* ---------------------------------------------------------
   PREFILL PHONE WITH +91 (UX feature)
---------------------------------------------------------- */
(function prefillPhone() {
  const input = document.querySelector('input[name="phone"]');
  if (input && !input.value) input.value = "+91";
})();