// ===================== COUNTDOWN TIMER =====================
const targetDate = new Date("May 7, 2026 09:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if(diff < 0) {
        setCountdownValues('00', '00', '00', '00');
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdownValues(
        String(days).padStart(2, '0'),
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    );
}

function setCountdownValues(d, h, m, s) {
    // Main countdown
    const ids = ['days', 'hours', 'minutes', 'seconds'];
    const values = [d, h, m, s];
    
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.innerText = values[i];
    });

    // RSVP countdown
    ids.forEach((id, i) => {
        const el = document.getElementById(`${id}-rsvp`);
        if (el) el.innerText = values[i];
    });
}

setInterval(updateCountdown, 1000);
updateCountdown();