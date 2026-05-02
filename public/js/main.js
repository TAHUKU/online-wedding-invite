const API_URL = '/api';

// Buka undangan
function openInvitation() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('invitation').style.display = 'block';
    window.scrollTo(0, 0);
}

// Load daftar tamu
async function loadGuests() {
    try {
        const response = await fetch(`${API_URL}/guests`);
        const guests = await response.json();
        
        const guestListDiv = document.getElementById('guestList');
        if (guestListDiv) {
            guestListDiv.innerHTML = guests.slice(0, 30).map(guest => `
                <div class="guest-card">
                    <strong>${escapeHtml(guest.name)}</strong>
                    <p>Kehadiran: ${guest.attendance === 'hadir' ? '✅ Hadir' : '❌ Tidak Hadir'}</p>
                    ${guest.message ? `<p>💬 ${escapeHtml(guest.message)}</p>` : ''}
                    <small>${new Date(guest.createdAt).toLocaleDateString('id-ID')}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading guests:', error);
    }
}

// Submit RSVP
const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            attendance: document.getElementById('attendance').value,
            numberOfGuests: parseInt(document.getElementById('numberOfGuests').value),
            message: document.getElementById('message').value
        };
        
        try {
            const response = await fetch(`${API_URL}/rsvp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const messageBox = document.getElementById('messageBox');
            if (response.ok) {
                messageBox.innerHTML = '<p style="color: green;">✅ Terima kasih! Konfirmasi Anda telah tersimpan.</p>';
                rsvpForm.reset();
                loadGuests();
            } else {
                messageBox.innerHTML = '<p style="color: red;">❌ Gagal mengirim konfirmasi.</p>';
            }
        } catch (error) {
            document.getElementById('messageBox').innerHTML = '<p style="color: red;">❌ Error koneksi ke server.</p>';
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Load data saat halaman siap
loadGuests();