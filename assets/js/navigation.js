// ===================== FOOTER NAVIGATION STYLING =====================
const style = document.createElement('style');
style.textContent = `
/* ===================== FOOTER NAVIGATION ===================== */
.footer-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, rgba(15, 15, 15, 0.95) 0%, rgba(15, 15, 15, 1) 100%);
    border-top: 2px solid rgba(212, 175, 55, 0.3);
    z-index: 900;
    backdrop-filter: blur(10px);
}

.footer-nav.hidden {
    display: none;
}

.footer-nav-container {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    height: 70px;
}

.footer-nav-container::-webkit-scrollbar {
    height: 2px;
}

.footer-nav-container::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.5);
    border-radius: 1px;
}

.footer-btn {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    padding: 0.6rem 0.9rem;
    background: transparent;
    border: none;
    color: rgba(245, 230, 211, 0.6);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    font-weight: 600;
    min-width: 55px;
    border-bottom: 2px solid transparent;
}

.footer-btn i {
    font-size: 1.2rem;
}

.footer-btn:hover {
    color: var(--gold-light);
    background: rgba(212, 175, 55, 0.1);
}

.footer-btn.active {
    color: var(--gold-light);
    background: rgba(212, 175, 55, 0.15);
    border-bottom-color: var(--gold-light);
}

/* ===================== PAGE WRAPPER PADDING ===================== */
.pages-wrapper {
    padding-bottom: 70px;
    height: 100vh;
}

/* ===================== FLOATING CONTROLS ===================== */
.floating-controls {
    position: fixed;
    bottom: 80px;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    z-index: 950;
}

.floating-controls.hidden {
    display: none;
}

.control-btn {
    width: 2.8rem;
    height: 2.8rem;
    background: linear-gradient(135deg, var(--gold-primary), var(--gold-light));
    color: #0F0F0F;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    box-shadow: 0 6px 18px rgba(212, 175, 55, 0.3);
    transition: all 0.3s ease;
    font-weight: 700;
}

.control-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
}

.control-btn:active {
    transform: scale(0.95);
}

.refresh-btn {
    background: linear-gradient(135deg, #E8B547, #D4AF37);
    animation: pulse-refresh 2.5s infinite ease-in-out;
}

@keyframes pulse-refresh {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.5);
    }
    50% {
        box-shadow: 0 0 0 10px rgba(212, 175, 55, 0);
    }
}

@media (max-width: 768px) {
    .footer-btn {
        min-width: 50px;
        font-size: 0.65rem;
        padding: 0.5rem 0.7rem;
    }

    .footer-btn i {
        font-size: 1rem;
    }

    .control-btn {
        width: 2.6rem;
        height: 2.6rem;
        font-size: 0.9rem;
    }
}
`;

document.head.appendChild(style);

// ===================== HIDE FOOTER WHEN ON COVER PAGE =====================
function updateFooterVisibility(pageId) {
    const footerNav = document.getElementById('footerNav');
    
    // Sembunyikan footer jika di halaman cover (page 1)
    if (pageId === '1') {
        footerNav.classList.add('hidden');
        document.querySelector('.pages-wrapper').style.paddingBottom = '0';
    } else {
        // Tampilkan footer untuk halaman lain (jika undangan sudah dibuka)
        if (invitationStarted) {
            footerNav.classList.remove('hidden');
            document.querySelector('.pages-wrapper').style.paddingBottom = '70px';
        }
    }
}

// Panggil setiap kali halaman berubah (tambahkan di fungsi goToPage)
// Modifikasi fungsi goToPage di atas untuk memanggil ini