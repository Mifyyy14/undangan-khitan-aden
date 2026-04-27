// ===================== INITIALIZE AOS =====================
AOS.init({
    duration: 600,
    once: false,
    mirror: true,
    offset: 20
});

// ===================== GLOBAL VARIABLES =====================
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const controls = document.getElementById('controls');
const footerNav = document.getElementById('footerNav');
const pagesWrapper = document.getElementById('pagesWrapper');

let currentPage = '1';
let invitationStarted = false;

// ===================== PAGE LOAD =====================
window.addEventListener('load', () => {
    loadWishes();
});

// ===================== START INVITATION =====================
function startInvitation() {
    bgMusic.play().catch(() => {});
    controls.classList.remove('hidden');
    footerNav.classList.remove('hidden');  // MUNCUL SETELAH BUKA UNDANGAN
    invitationStarted = true;
    goToPage('2');
}

// ===================== GO TO PAGE =====================
function goToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(`page-${pageId}`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        currentPage = pageId;
    }

    // Update footer active state
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.footer-btn[data-page="${pageId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // UPDATE FOOTER VISIBILITY BERDASARKAN HALAMAN
    const footerNav = document.getElementById('footerNav');
    const pagesWrapper = document.querySelector('.pages-wrapper');
    
    if (pageId === '1') {
        // COVER PAGE - SEMBUNYIKAN FOOTER
        footerNav.classList.add('hidden');
        pagesWrapper.style.paddingBottom = '0';
    } else {
        // HALAMAN LAIN - TAMPILKAN FOOTER
        if (invitationStarted) {
            footerNav.classList.remove('hidden');
            pagesWrapper.style.paddingBottom = '70px';
        }
    }

    // Refresh AOS
    setTimeout(() => {
        AOS.refresh();
    }, 100);

    // Scroll footer nav if needed
    autoScrollFooterNav(pageId);
}

// ===================== AUTO-SCROLL FOOTER NAV =====================
function autoScrollFooterNav(pageId) {
    const container = document.getElementById('footerNavContainer');
    const buttons = document.querySelectorAll('.footer-btn');
    const pageNum = parseInt(pageId.replace(/[a-z]/g, ''));
    const visibleButtons = window.innerWidth > 768 ? 8 : 5;

    let targetButton = null;
    buttons.forEach(btn => {
        if (btn.dataset.page === pageId) {
            targetButton = btn;
        }
    });

    if (targetButton && window.innerWidth <= 768) {
        const buttonIndex = Array.from(buttons).indexOf(targetButton);
        if (buttonIndex >= visibleButtons - 1) {
            container.scrollLeft = (buttonIndex - visibleButtons + 2) * targetButton.offsetWidth;
        } else {
            container.scrollLeft = 0;
        }
    }
}

// ===================== TOGGLE MUSIC =====================
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicIcon.className = 'fas fa-volume-up';
    } else {
        bgMusic.pause();
        musicIcon.className = 'fas fa-volume-mute';
    }
}

// ===================== TOGGLE FULLSCREEN =====================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        document.getElementById('fsIcon').className = 'fas fa-compress';
    } else {
        document.exitFullscreen();
        document.getElementById('fsIcon').className = 'fas fa-expand';
    }
}

// ===================== SUCCESS MESSAGE =====================
function showSuccessMessage(message = 'Konfirmasi berhasil dikirim!') {
    const msg = document.createElement('div');
    msg.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;"><i class="fas fa-check-circle"></i></div>
        <h3 style="font-size: 1.1rem; margin-bottom: 0.3rem;">Terima Kasih!</h3>
        <p>${message}</p>
    `;
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--gold-primary), var(--gold-light));
        color: #0F0F0F;
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 50px rgba(212, 175, 55, 0.4);
        z-index: 2000;
        text-align: center;
        animation: slideInDown 0.4s ease-out;
    `;
    
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 400);
    }, 2500);
}

// ===================== ERROR MESSAGE =====================
function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right: 0.6rem;"></i> <span>${message}</span>`;
    errorEl.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 1rem;
        background: linear-gradient(135deg, #d32f2f, #f44336);
        color: white;
        padding: 0.8rem 1.2rem;
        border-radius: 0.5rem;
        z-index: 2000;
        animation: slideInDown 0.3s ease-out;
        font-size: 0.85rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
    `;
    
    document.body.appendChild(errorEl);
    setTimeout(() => {
        errorEl.style.opacity = '0';
        setTimeout(() => errorEl.remove(), 300);
    }, 3000);
}

// ===================== COPY TO CLIPBOARD =====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccessMessage('Nomor rekening disalin!');
    }).catch(() => {
        showError('Gagal menyalin');
    });
}

// ===================== ESCAPE HTML =====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================== LOADING INDICATOR =====================
function showLoadingIndicator() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
}

function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').classList.add('hidden');
}

// ===================== GALLERY FULLSCREEN =====================
function openGalleryFullscreen(imageSrc, caption) {
    const fullscreenModal = document.getElementById('galleryFullscreen');
    const fullscreenImg = document.getElementById('galleryFullscreenImg');
    const fullscreenCaption = document.getElementById('galleryFullscreenCaption');

    fullscreenImg.src = imageSrc;
    fullscreenCaption.textContent = caption;
    fullscreenModal.classList.add('active');

    // Disable body scroll
    document.body.style.overflow = 'hidden';
}

function closeGalleryFullscreen() {
    const fullscreenModal = document.getElementById('galleryFullscreen');
    fullscreenModal.classList.remove('active');

    // Enable body scroll
    document.body.style.overflow = 'auto';
}

// Close fullscreen saat ESC ditekan
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeGalleryFullscreen();
    }
});

// Close fullscreen saat klik di luar gambar
document.getElementById('galleryFullscreen').addEventListener('click', function(e) {
    if (e.target === this) {
        closeGalleryFullscreen();
    }
});