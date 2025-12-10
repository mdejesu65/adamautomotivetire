// 🚀 Initialize AOS Animations
AOS.init({ duration: 1000, once: true });

// 📅 Appointment Form Submission
const form = document.getElementById("appointment-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      phone: form.phone.value,
      service: form.service.value,
      preferredDate: form.preferredDate.value,
    };

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const reply = await res.json();
      alert(reply.reply || "Appointment request sent!");
      form.reset();
    } catch (error) {
      alert("There was an issue sending your request. Please try again.");
      console.error(error);
    }
  });
}

// ✨ Background Particles Animation
particlesJS("particles-js", {
  particles: {
    number: { value: 45 },
    color: { value: "#ff3b3b" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    move: { enable: true, speed: 1.2 },
  },
  interactivity: {
    events: { onhover: { enable: true, mode: "repulse" } },
  },
  retina_detect: true,
});

// 💬 AutoBot Chat Logic (single version, compact + functional)
const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("closeChat");
const chatBox = document.getElementById("chat-box");
const userMessage = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");

// Ensure elements exist before adding listeners
if (chatToggle && chatbot && closeChat && chatBox && userMessage && sendBtn) {

  chatToggle.addEventListener("click", () => {
    chatbot.classList.remove("hidden");
    chatToggle.style.display = "none";
  });

  closeChat.addEventListener("click", () => {
    chatbot.classList.add("hidden");
    chatToggle.style.display = "flex";
  });

  sendBtn.addEventListener("click", async () => {
    const message = userMessage.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    userMessage.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      chatBox.innerHTML += `<div><strong>AutoBot:</strong> ${
        data.reply || "Sorry, I’m having trouble responding right now."
      }</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      chatBox.innerHTML += `<div><strong>AutoBot:</strong> Error connecting to server.</div>`;
      console.error(error);
    }
  });
}

// Make AutoBot links clickable in chat
document.addEventListener("click", (e) => {
  if (e.target.matches(".book-link")) {
    document.querySelector("#appointment").scrollIntoView({ behavior: "smooth" });
  }
});
