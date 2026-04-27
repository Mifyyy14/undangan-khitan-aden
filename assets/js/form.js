// ===================== FORM SUBMISSION =====================
const rsvpForm = document.getElementById('rsvpForm');

rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const status = document.querySelector('input[name="status"]:checked')?.value;

    // Validation
    if (!name || name.length < 3) {
        showError('Nama minimal 3 karakter');
        return;
    }

    if (!address || address.length < 5) {
        showError('Alamat minimal 5 karakter');
        return;
    }

    if (!status) {
        showError('Pilih status kehadiran');
        return;
    }

    const formData = {
        name: name,
        address: address,
        status: status,
        timestamp: new Date().toLocaleString('id-ID')
    };

    await saveGuest(formData);
    showSuccessMessage('Ucapan Anda terima kasih!');
    rsvpForm.reset();
    await loadWishes();
});