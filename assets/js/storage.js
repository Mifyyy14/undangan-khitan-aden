// ===================== SHEETDB API CONFIGURATION =====================
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/99cz9lzd5qxn0';

// ===================== SAVE GUEST =====================
async function saveGuest(formData) {
    try {
        showLoadingIndicator();
        
        const sheetData = {
            data: {
                'Nama': formData.name,
                'Alamat': formData.address,
                'Status': formData.status,
                'Waktu Konfirmasi': formData.timestamp
            }
        };

        const existingGuests = await fetchAllGuests();
        const existingGuest = existingGuests.find(
            g => g['Nama'] && g['Nama'].toLowerCase() === formData.name.toLowerCase()
        );

        if (existingGuest) {
            await updateGuestOnSheet(formData);
        } else {
            await createGuestOnSheet(sheetData);
        }

        hideLoadingIndicator();

        // Backup to localStorage
        const allGuests = JSON.parse(localStorage.getItem('khitananGuests') || '[]');
        const localIdx = allGuests.findIndex(g => g.name.toLowerCase() === formData.name.toLowerCase());
        
        if (localIdx !== -1) {
            allGuests[localIdx] = formData;
        } else {
            allGuests.unshift(formData);
        }
        localStorage.setItem('khitananGuests', JSON.stringify(allGuests));

    } catch (error) {
        hideLoadingIndicator();
        console.error('Error saving guest:', error);
        showError('Gagal menyimpan data');
    }
}

// ===================== CREATE GUEST =====================
async function createGuestOnSheet(data) {
    try {
        const response = await fetch(SHEETDB_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error creating guest:', error);
        throw error;
    }
}

// ===================== UPDATE GUEST =====================
async function updateGuestOnSheet(formData) {
    try {
        const updateData = {
            data: {
                'Nama': formData.name,
                'Alamat': formData.address,
                'Status': formData.status,
                'Waktu Konfirmasi': formData.timestamp
            }
        };

        const encodedName = encodeURIComponent(formData.name);
        const response = await fetch(`${SHEETDB_API_URL}/Nama/${encodedName}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updateData)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error updating guest:', error);
        return await createGuestOnSheet({
            data: {
                'Nama': formData.name,
                'Alamat': formData.address,
                'Status': formData.status,
                'Waktu Konfirmasi': formData.timestamp
            }
        });
    }
}

// ===================== FETCH ALL GUESTS =====================
async function fetchAllGuests() {
    try {
        const response = await fetch(SHEETDB_API_URL, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        return Array.isArray(data) ? data : (data.data || []);

    } catch (error) {
        console.error('Error fetching guests:', error);
        return JSON.parse(localStorage.getItem('khitananGuests') || '[]');
    }
}

// ===================== LOAD WISHES =====================
async function loadWishes() {
    try {
        showLoadingIndicator();
        
        const guests = await fetchAllGuests();
        const container = document.getElementById('wishContainer');
        const stats = document.getElementById('guestStats');

        if (!guests || guests.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(245, 230, 211, 0.5); font-size: 0.8rem; padding: 1rem 0;">Belum ada yang mengkonfirmasi</p>';
            stats.classList.add('hidden');
            hideLoadingIndicator();
            return;
        }

        stats.classList.remove('hidden');

        let hadir = 0, tidakHadir = 0;
        guests.forEach(g => {
            if (g['Status'] === 'Akan Hadir') hadir++;
            else if (g['Status'] === 'Tidak Hadir') tidakHadir++;
        });

        document.getElementById('countHadir').innerText = hadir;
        document.getElementById('countTidakHadir').innerText = tidakHadir;

        // Show only last 5 in preview
        const sorted = guests.sort((a, b) => new Date(b['Waktu Konfirmasi']) - new Date(a['Waktu Konfirmasi'])).slice(0, 5);

        container.innerHTML = sorted.map(g => {
            const statusColor = g['Status'] === 'Akan Hadir' 
                ? 'rgba(16, 185, 129, 0.7)' 
                : 'rgba(239, 68, 68, 0.7)';

            return `
                <div class="wish-item">
                    <div class="wish-name"><i class="fas fa-user-circle mr-1"></i> ${escapeHtml(g['Nama'] || 'Nama')}</div>
                    <div class="wish-status" style="background: ${statusColor}; color: white;">
                        ${g['Status'] || 'Belum Terkonfirmasi'}
                    </div>
                    <div class="wish-text">${escapeHtml(g['Alamat'] || 'Alamat')}</div>
                </div>
            `;
        }).join('');

        hideLoadingIndicator();
        AOS.refresh();

    } catch (error) {
        hideLoadingIndicator();
        console.error('Error loading wishes:', error);
        document.getElementById('wishContainer').innerHTML = '<p style="color: #ef4444; font-size: 0.8rem;">Gagal memuat data</p>';
    }
}

// ===================== REFRESH DATA =====================
async function refreshGuestData() {
    await loadWishes();
}

