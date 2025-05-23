// Variabili globali
let shifts = {};
const holidays = [
    { month: 0, day: 1 },   // 1 gennaio
    { month: 0, day: 6 },   // 6 gennaio
    { month: 3, day: 20 },  // 20 aprile (Pasqua)
    { month: 3, day: 21 },  // 21 aprile (Pasquetta)
    { month: 3, day: 25 },  // 25 aprile
    { month: 4, day: 1 },   // 1 maggio
    { month: 5, day: 2 },   // 2 giugno
    { month: 7, day: 15 },  // 15 agosto
    { month: 10, day: 1 },  // 1 novembre
    { month: 11, day: 8 },  // 8 dicembre
    { month: 11, day: 25 }, // 25 dicembre
    { month: 11, day: 26 }  // 26 dicembre
];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentDay = currentDate.getDate();
let currentNoteKey = null;
let currentEditShiftKey = null;
let selectedShift = null;

const translations = {
    it: {
        title: "AppTurni",
        prevMonth: "Precedente",
        nextMonth: "Successivo",
        monday: "LUN",
        tuesday: "MAR",
        wednesday: "MER",
        thursday: "GIO",
        friday: "VEN",
        saturday: "SAB",
        sunday: "DOM",
        selectShift: "Seleziona Turno",
        clearShift: "Rimuovi Turno",
        addShift: "Aggiungi Turno",
        editShift: "Modifica Turno",
        deleteShift: "Elimina Turno",
        statistics: "Statistiche",
        statsTitle: "Statistiche Complete",
        workedHours: "Ore Lavorate",
        totalHoursMonth: "Totale ore questo mese",
        shifts: "Turni",
        notes: "Note",
        backToCalendar: "Torna al Calendario",
        createShiftTitle: "Crea Nuovo Turno",
        shiftNameLabel: "Nome Turno (es. Mattina)",
        shiftNamePlaceholder: "Inserisci nome turno",
        shiftAbbreviationLabel: "Abbreviazione (es. M, opzionale)",
        shiftAbbreviationPlaceholder: "Inserisci abbreviazione",
        shiftHoursLabel: "Ore (HH:MM)",
        shiftHoursPlaceholder: "Es. 07:15",
        shiftColorLabel: "Colore Turno",
        cancel: "Annulla",
        create: "Crea",
        deleteShiftTitle: "Elimina Turno",
        selectShiftLabel: "Seleziona Turno",
        selectShiftOption: "Seleziona un turno",
        delete: "Elimina",
        editShiftTitle: "Modifica Turno",
        save: "Salva",
        noteTitle: "Aggiungi/Modifica Nota",
        noteLabel: "Nota",
        notePlaceholder: "Inserisci una nota",
        noteTimeLabel: "Orario Notifica",
        noteTimePlaceholder: "Seleziona orario (es. 07:00)",
        alertInvalidNameHours: "Inserisci un nome valido e un orario valido (es. 07:15).",
        alertInvalidHours: "Inserisci un orario valido nel formato HH:MM.",
        alertShiftExists: "Esiste già un turno con questo nome.",
        alertSelectShiftToEdit: "Seleziona un turno da modificare.",
        alertSelectShiftToDelete: "Seleziona un turno da eliminare.",
        alertMaxShifts: "Puoi assegnare al massimo 5 turni per giorno.",
        alertSaveShiftError: "Errore nel salvataggio dei turni.",
        alertSaveNoteError: "Errore nel salvataggio della nota.",
        alertNotificationPermission: "Permetti le notifiche per ricevere avvisi sulle note.",
        noShiftsAssigned: "Nessun turno assegnato",
        noNotesPresent: "Nessuna nota presente",
        editNote: "Modifica nota",
        annualTitle: "Visualizzazione Annuale",
        annualStats: "Statistiche Annuali",
        totalHoursYear: "Totale ore quest'anno",
        viewAnnual: "Visualizzazione Annuale"
    }
    // Altre lingue (en, fr, de, es) omesse per brevità, ma presenti nel codice originale
};

function getTextLengthClass(text) {
    try {
        const length = text?.length || 0;
        if (length <= 4) return 'short-text'; // Es. "M", "P"
        if (length <= 6) return 'medium-text'; // Es. "Smonto"
        if (length <= 8) return 'long-text'; // Es. "Congedo", "Mattina"
        return 'very-long-text'; // Es. "Pomeriggio"
    } catch (e) {
        console.error('Error in getTextLengthClass:', e);
        return 'medium-text';
    }
}

function updateTranslations(lang) {
    try {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                const icon = element.querySelector('i');
                if (icon) {
                    element.innerHTML = '';
                    element.appendChild(icon);
                    element.appendChild(document.createTextNode(' ' + translations[lang][key]));
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
        document.title = translations[lang].title;
        document.querySelectorAll('.note-edit-btn').forEach(btn => {
            btn.title = translations[lang].editNote;
        });
        const monthNames = {
            it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
        };
        const monthYearElement = document.getElementById('monthYear');
        if (monthYearElement) {
            monthYearElement.textContent = `${monthNames[lang][currentMonth]} ${currentYear}`;
        } else {
            console.warn('monthYear element not found');
        }
    } catch (e) {
        console.error('Error in updateTranslations:', e);
    }
}

const originalAlert = window.alert;
window.alert = function(message) {
    try {
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        const translatedMessage = translations[lang][message] || message;
        originalAlert(translatedMessage);
    } catch (e) {
        console.error('Error in alert:', e);
        originalAlert(message);
    }
};

function initializeLanguageSelector() {
    try {
        console.log('Initializing language selector');
        const languageButton = document.getElementById('languageButton');
        const languageDropdown = document.getElementById('languageDropdown');
        const languageFlagSpan = document.getElementById('languageFlag');
        const languageOptions = document.querySelectorAll('.language-option');
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'it';
        const languageMap = {
            'it': { name: 'Italiano', flag: 'flag-icon-it' }
        };

        if (languageFlagSpan) {
            languageFlagSpan.className = `flag-icon ${languageMap[savedLanguage].flag}`;
        }
        updateTranslations(savedLanguage);

        if (languageButton && languageDropdown) {
            languageButton.addEventListener('click', (e) => {
                e.stopPropagation();
                languageDropdown.classList.toggle('active');
                languageButton.classList.toggle('active');
            });

            languageOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const lang = option.getAttribute('data-lang');
                    if (languageFlagSpan) {
                        languageFlagSpan.className = `flag-icon ${languageMap[lang].flag}`;
                    }
                    localStorage.setItem('selectedLanguage', lang);
                    languageDropdown.classList.remove('active');
                    languageButton.classList.remove('active');
                    updateTranslations(lang);
                    renderCalendar();
                });
            });

            document.addEventListener('click', (e) => {
                if (!languageButton.contains(e.target) && !languageDropdown.contains(e.target)) {
                    languageDropdown.classList.remove('active');
                    languageButton.classList.remove('active');
                }
            });
        } else {
            console.warn('Language button or dropdown not found');
        }
    } catch (e) {
        console.error('Error in initializeLanguageSelector:', e);
    }
}

function initializeHamburgerMenu() {
    try {
        console.log('Initializing hamburger menu');
        const hamburgerButton = document.getElementById('hamburgerButton');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (hamburgerButton && hamburgerMenu) {
            hamburgerButton.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburgerMenu.classList.toggle('active');
            });
            document.addEventListener('click', (e) => {
                if (!hamburgerButton.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                    hamburgerMenu.classList.remove('active');
                }
            });
            const viewAnnualBtn = document.getElementById('viewAnnual');
            if (viewAnnualBtn) {
                viewAnnualBtn.addEventListener('click', showAnnualPage);
            } else {
                console.warn('View annual button not found');
            }
        } else {
            console.warn('Hamburger button or menu not found');
        }
    } catch (e) {
        console.error('Error in initializeHamburgerMenu:', e);
    }
}

function initializeNotifications() {
    try {
        console.log('Initializing notifications');
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification) {
            document.addEventListener('deviceready', () => {
                cordova.plugins.notification.local.requestPermission(() => {
                    rescheduleNotifications();
                }, () => {
                    alert('alertNotificationPermission');
                });
                cordova.plugins.notification.local.on('click', (notification) => {
                    console.log('Notifica cliccata:', notification);
                });
            }, { once: true });
        }
    } catch (e) {
        console.error('Error in initializeNotifications:', e);
    }
}

function rescheduleNotifications() {
    try {
        console.log('Rescheduling notifications');
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification) {
            cordova.plugins.notification.local.cancelAll(() => {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('note_')) {
                        const noteData = JSON.parse(localStorage.getItem(key) || '{}');
                        const [_, year, month, day] = key.split('_').map(Number);
                        if (noteData.text && noteData.time) {
                            sendNoteNotification(year, month, day, noteData.text, noteData.time);
                        }
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error in rescheduleNotifications:', e);
    }
}

function sendNoteNotification(year, month, day, noteText, noteTime) {
    try {
        console.log(`Scheduling notification for ${noteText} at ${noteTime} on ${day}/${month + 1}/${year}`);
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        const monthNames = {
            it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
        };
        const title = `Sveglia: ${day} ${monthNames[lang][month]} ${year}`;
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification) {
            document.addEventListener('deviceready', () => {
                const notificationId = parseInt(`${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`);
                const [hours, minutes] = noteTime.split(':').map(Number);
                const triggerTime = new Date(year, month, day, hours, minutes);
                cordova.plugins.notification.local.schedule({
                    id: notificationId,
                    title: title,
                    text: noteText,
                    trigger: { at: triggerTime },
                    foreground: true,
                    sound: 'file://sound.mp3',
                    vibrate: true
                }, () => {
                    console.log(`Notifica programmata per ${noteText} alle ${noteTime} del ${day}/${month + 1}/${year}`);
                });
            }, { once: true });
        }
    } catch (e) {
        console.error('Error in sendNoteNotification:', e);
    }
}

function storageAvailable(type) {
    try {
        let storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        console.error('Error in storageAvailable:', e);
        return false;
    }
}

const isStorageAvailable = storageAvailable('localStorage');

function saveShift(shiftKey, shiftValue) {
    try {
        if (isStorageAvailable) {
            if (shiftValue && shiftValue.length > 0) {
                localStorage.setItem(shiftKey, JSON.stringify(shiftValue));
            } else {
                localStorage.removeItem(shiftKey);
            }
        }
    } catch (e) {
        console.error('Error in saveShift:', e);
        alert('alertSaveShiftError');
    }
}

function loadShift(shiftKey) {
    try {
        if (isStorageAvailable) {
            const shift = localStorage.getItem(shiftKey);
            return shift ? JSON.parse(shift) : [];
        }
        return [];
    } catch (e) {
        console.error('Error in loadShift:', e);
        return [];
    }
}

function saveNote() {
    try {
        console.log('Saving note for key:', currentNoteKey);
        if (currentNoteKey && isStorageAvailable) {
            const noteText = document.getElementById('noteText')?.value?.trim() || '';
            const noteTime = document.getElementById('noteTime')?.value || '';
            if (noteText) {
                const noteData = { text: noteText, time: noteTime };
                localStorage.setItem(currentNoteKey, JSON.stringify(noteData));
                const [_, year, month, day] = currentNoteKey.split('_').map(Number);
                if (noteTime) {
                    sendNoteNotification(year, month, day, noteText, noteTime);
                }
            } else {
                localStorage.removeItem(currentNoteKey);
                const [_, year, month, day] = currentNoteKey.split('_').map(Number);
                const notificationId = parseInt(`${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`);
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification) {
                    cordova.plugins.notification.local.cancel(notificationId);
                }
            }
            closeNoteModal();
            renderCalendar();
        }
    } catch (e) {
        console.error('Error in saveNote:', e);
        alert('alertSaveNoteError');
    }
}

function loadNote(noteKey) {
    try {
        if (isStorageAvailable) {
            const note = localStorage.getItem(noteKey);
            return note ? JSON.parse(note) : { text: '', time: '' };
        }
        return { text: '', time: '' };
    } catch (e) {
        console.error('Error in loadNote:', e);
        return { text: '', time: '' };
    }
}

function loadCustomShifts() {
    try {
        console.log('Loading custom shifts');
        if (isStorageAvailable) {
            const customShifts = localStorage.getItem('customShifts');
            if (customShifts) {
                shifts = JSON.parse(customShifts);
            }
        }
    } catch (e) {
        console.error('Error in loadCustomShifts:', e);
    }
}

function saveCustomShifts() {
    try {
        if (isStorageAvailable) {
            localStorage.setItem('customShifts', JSON.stringify(shifts));
        }
    } catch (e) {
        console.error('Error in saveCustomShifts:', e);
        alert('alertSaveShiftError');
    }
}

function timeToDecimal(time) {
    try {
        if (!time || !time.includes(':')) return 0;
        const [hours, minutes] = time.split(':').map(Number);
        return hours + (minutes / 60);
    } catch (e) {
        console.error('Error in timeToDecimal:', e);
        return 0;
    }
}

function decimalToTime(decimal) {
    try {
        const hours = Math.floor(decimal);
        const minutes = Math.round((decimal - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    } catch (e) {
        console.error('Error in decimalToTime:', e);
        return '0:00';
    }
}

function openCreateShiftModal() {
    try {
        console.log('Opening create shift modal');
        const modal = document.getElementById('createShiftModal');
        if (modal) {
            modal.classList.remove('hidden');
        } else {
            console.warn('Create shift modal not found');
        }
    } catch (e) {
        console.error('Error in openCreateShiftModal:', e);
    }
}

function closeCreateShiftModal() {
    try {
        console.log('Closing create shift modal');
        const modal = document.getElementById('createShiftModal');
        if (modal) {
            modal.classList.add('hidden');
            const inputs = ['shiftName', 'shiftAbbreviation', 'shiftHours', 'shiftColor'];
            inputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = id === 'shiftColor' ? '#fef3c7' : '';
                }
            });
        }
    } catch (e) {
        console.error('Error in closeCreateShiftModal:', e);
    }
}

function createShift() {
    try {
        console.log('Creating shift');
        const shiftName = document.getElementById('shiftName')?.value?.trim().toUpperCase() || '';
        const shiftAbbreviation = document.getElementById('shiftAbbreviation')?.value?.trim().toUpperCase() || '';
        const shiftHoursInput = document.getElementById('shiftHours')?.value?.trim() || '';
        const shiftColor = document.getElementById('shiftColor')?.value || '#fef3c7';
        if (!shiftName || !shiftHoursInput) {
            alert('alertInvalidNameHours');
            return;
        }
        const shiftHours = timeToDecimal(shiftHoursInput);
        if (isNaN(shiftHours)) {
            alert('alertInvalidHours');
            return;
        }
        if (shifts[shiftName]) {
            alert('alertShiftExists');
            return;
        }
        shifts[shiftName] = { 
            name: shiftName, 
            abbreviation: shiftAbbreviation || shiftName,
            hours: shiftHours, 
            color: shiftColor 
        };
        saveCustomShifts();
        closeCreateShiftModal();
        renderShiftSelector();
        renderCalendar();
    } catch (e) {
        console.error('Error in createShift:', e);
    }
}

function openEditShiftModal() {
    try {
        console.log('Opening edit shift modal');
        const select = document.createElement('select');
        select.id = 'editShiftSelect';
        select.className = 'w-full p-2 border rounded-lg mb-4';
        select.innerHTML = '<option value="" data-translate="selectShiftOption">Seleziona un turno</option>' + 
            Object.keys(shifts).map(
                key => `<option value="${key}">${shifts[key].name} (${decimalToTime(shifts[key].hours)})</option>`
            ).join('');
        select.addEventListener('change', () => {
            try {
                const shiftKey = select.value;
                if (shiftKey && shifts[shiftKey]) {
                    currentEditShiftKey = shiftKey;
                    const inputs = {
                        editShiftName: shifts[shiftKey].name,
                        editShiftAbbreviation: shifts[shiftKey].abbreviation,
                        editShiftHours: decimalToTime(shifts[shiftKey].hours),
                        editShiftColor: shifts[shiftKey].color
                    };
                    Object.entries(inputs).forEach(([id, value]) => {
                        const element = document.getElementById(id);
                        if (element) element.value = value;
                    });
                } else {
                    currentEditShiftKey = null;
                    const inputs = ['editShiftName', 'editShiftAbbreviation', 'editShiftHours', 'editShiftColor'];
                    inputs.forEach(id => {
                        const element = document.getElementById(id);
                        if (element) {
                            element.value = id === 'editShiftColor' ? '#fef3c7' : '';
                        }
                    });
                }
            } catch (e) {
                console.error('Error in editShiftSelect change:', e);
            }
        });
        const modal = document.getElementById('editShiftModal');
        if (modal) {
            const modalContent = modal.querySelector('.bg-white.p-6.rounded-lg.shadow-lg.max-w-sm.w-full');
            const title = modalContent ? modalContent.querySelector('h3') : null;
            if (modalContent && title) {
                title.insertAdjacentElement('afterend', select);
            } else {
                console.warn('Modal content or title not found, using fallback');
                modal.appendChild(select);
            }
            modal.classList.remove('hidden');
            updateTranslations(localStorage.getItem('selectedLanguage') || 'it');
        } else {
            console.warn('Edit shift modal not found');
        }
    } catch (e) {
        console.error('Error in openEditShiftModal:', e);
    }
}

function closeEditShiftModal() {
    try {
        console.log('Closing edit shift modal');
        const modal = document.getElementById('editShiftModal');
        const select = document.getElementById('editShiftSelect');
        if (select) select.remove();
        if (modal) modal.classList.add('hidden');
        currentEditShiftKey = null;
    } catch (e) {
        console.error('Error in closeEditShiftModal:', e);
    }
}

function updateShift() {
    try {
        console.log('Updating shift');
        if (!currentEditShiftKey) {
            alert('alertSelectShiftToEdit');
            return;
        }
        const shiftAbbreviation = document.getElementById('editShiftAbbreviation')?.value?.trim().toUpperCase() || '';
        const shiftHoursInput = document.getElementById('editShiftHours')?.value?.trim() || '';
        const shiftColor = document.getElementById('editShiftColor')?.value || '#fef3c7';
        const shiftHours = timeToDecimal(shiftHoursInput);
        if (isNaN(shiftHours)) {
            alert('alertInvalidHours');
            return;
        }
        shifts[currentEditShiftKey] = {
            name: shifts[currentEditShiftKey].name,
            abbreviation: shiftAbbreviation || shifts[currentEditShiftKey].name,
            hours: shiftHours,
            color: shiftColor
        };
        saveCustomShifts();
        closeEditShiftModal();
        renderShiftSelector();
        renderCalendar();
    } catch (e) {
        console.error('Error in updateShift:', e);
    }
}

function openDeleteShiftModal() {
    try {
        console.log('Opening delete shift modal');
        const select = document.getElementById('deleteShiftSelect');
        if (select) {
            select.innerHTML = '<option value="" data-translate="selectShiftOption">Seleziona un turno</option>' + 
                Object.keys(shifts).map(
                    key => `<option value="${key}">${shifts[key].name} (${decimalToTime(shifts[key].hours)})</option>`
                ).join('');
            const modal = document.getElementById('deleteShiftModal');
            if (modal) {
                modal.classList.remove('hidden');
                updateTranslations(localStorage.getItem('selectedLanguage') || 'it');
            } else {
                console.warn('Delete shift modal not found');
            }
        } else {
            console.warn('Delete shift select not found');
        }
    } catch (e) {
        console.error('Error in openDeleteShiftModal:', e);
    }
}

function closeDeleteShiftModal() {
    try {
        console.log('Closing delete shift modal');
        const modal = document.getElementById('deleteShiftModal');
        const select = document.getElementById('deleteShiftSelect');
        if (modal) modal.classList.add('hidden');
        if (select) select.value = '';
    } catch (e) {
        console.error('Error in closeDeleteShiftModal:', e);
    }
}

function deleteShift() {
    try {
        console.log('Deleting shift');
        const shiftName = document.getElementById('deleteShiftSelect')?.value;
        if (!shiftName) {
            alert('alertSelectShiftToDelete');
            return;
        }
        delete shifts[shiftName];
        saveCustomShifts();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const shiftKey = `shift_${currentYear}_${currentMonth}_${day}`;
            const savedShifts = loadShift(shiftKey);
            const updatedShifts = savedShifts.filter(s => s !== shiftName);
            saveShift(shiftKey, updatedShifts);
        }
        if (selectedShift === shiftName) {
            selectedShift = null;
            renderShiftSelector();
        }
        closeDeleteShiftModal();
        renderShiftSelector();
        renderCalendar();
        updateWorkedHoursAndSummary();
    } catch (e) {
        console.error('Error in deleteShift:', e);
    }
}

function openNoteModal(year, month, day) {
    try {
        console.log('Opening note modal for', year, month, day);
        currentNoteKey = `note_${year}_${month}_${day}`;
        const noteData = loadNote(currentNoteKey);
        const noteText = document.getElementById('noteText');
        const noteTime = document.getElementById('noteTime');
        if (noteText) noteText.value = noteData.text;
        if (noteTime) noteTime.value = noteData.time;
        const modal = document.getElementById('noteModal');
        if (modal) {
            modal.classList.remove('hidden');
            updateTranslations(localStorage.getItem('selectedLanguage') || 'it');
        } else {
            console.warn('Note modal not found');
        }
    } catch (e) {
        console.error('Error in openNoteModal:', e);
    }
}

function closeNoteModal() {
    try {
        console.log('Closing note modal');
        const modal = document.getElementById('noteModal');
        const noteText = document.getElementById('noteText');
        const noteTime = document.getElementById('noteTime');
        if (modal) modal.classList.add('hidden');
        if (noteText) noteText.value = '';
        if (noteTime) noteTime.value = '';
        currentNoteKey = null;
    } catch (e) {
        console.error('Error in closeNoteModal:', e);
    }
}

function calculateWorkedHours() {
    try {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        let totalWorked = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const shiftKey = `shift_${currentYear}_${currentMonth}_${day}`;
            const shiftNames = loadShift(shiftKey);
            shiftNames.forEach(shiftName => {
                if (shifts[shiftName]) {
                    totalWorked += shifts[shiftName].hours;
                }
            });
        }
        return totalWorked;
    } catch (e) {
        console.error('Error in calculateWorkedHours:', e);
        return 0;
    }
}

function calculateShiftSummary() {
    try {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const shiftCounts = {};
        const shiftHours = {};
        Object.keys(shifts).forEach(shift => {
            shiftCounts[shift] = 0;
            shiftHours[shift] = 0;
        });
        for (let day = 1; day <= daysInMonth; day++) {
            const shiftKey = `shift_${currentYear}_${currentMonth}_${day}`;
            const shiftNames = loadShift(shiftKey);
            shiftNames.forEach(shiftName => {
                if (shifts[shiftName]) {
                    shiftCounts[shiftName]++;
                    shiftHours[shiftName] += shifts[shiftName].hours;
                }
            });
        }
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        let summaryHtml = '';
        Object.keys(shifts).forEach(shift => {
            const totalHours = shiftHours[shift];
            const formattedHours = decimalToTime(totalHours);
            summaryHtml += `
                <div class="stats-item">
                    <div class="stats-item-title">${shifts[shift].name}</div>
                    <div class="stats-item-value">${shiftCounts[shift]}</div>
                    <div class="stats-item-title">${formattedHours}</div>
                </div>
            `;
        });
        if (!Object.keys(shifts).length) {
            summaryHtml = `<div class="stats-item">${translations[lang].noShiftsAssigned}</div>`;
        }
        return summaryHtml;
    } catch (e) {
        console.error('Error in calculateShiftSummary:', e);
        return '';
    }
}

function updateWorkedHoursAndSummary() {
    try {
        console.log('Updating worked hours and summary');
        const statsWorkedHours = document.getElementById('statsWorkedHours');
        const statsShiftsDetails = document.getElementById('statsShiftsDetails');
        if (statsWorkedHours && statsShiftsDetails) {
            const workedHours = calculateWorkedHours();
            statsWorkedHours.textContent = decimalToTime(workedHours);
            const shiftSummary = calculateShiftSummary();
            statsShiftsDetails.innerHTML = shiftSummary;
            updateStatsNotes();
        } else {
            console.warn('Stats elements not found');
        }
    } catch (e) {
        console.error('Error in updateWorkedHoursAndSummary:', e);
    }
}

function updateStatsNotes() {
    try {
        console.log('Updating stats notes');
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        let notesHtml = '';
        const statsNotesList = document.getElementById('statsNotesList');
        if (!statsNotesList) {
            console.warn('Stats notes list not found');
            return;
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const noteKey = `note_${currentYear}_${currentMonth}_${day}`;
            const noteData = loadNote(noteKey);
            if (noteData.text) {
                const date = new Date(currentYear, currentMonth, day);
                const dayNames = {
                    it: ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB']
                };
                const dayName = dayNames[lang][date.getDay()];
                const timeText = noteData.time ? ` (${noteData.time})` : '';
                notesHtml += `
                    <div class="mb-3 pb-3 border-b border-blue-300">
                        <div class="font-bold text-white">${day} ${dayName}${timeText}</div>
                        <div class="text-sm text-white">${noteData.text}</div>
                    </div>
                `;
            }
        }
        if (!notesHtml) {
            notesHtml = `<div class="text-white text-center">${translations[lang].noNotesPresent}</div>`;
        }
        statsNotesList.innerHTML = notesHtml;
    } catch (e) {
        console.error('Error in updateStatsNotes:', e);
    }
}

function showStatsPage() {
    try {
        console.log('Showing stats page');
        const mainPage = document.getElementById('mainPage');
        const statsPage = document.getElementById('statsPage');
        const annualPage = document.getElementById('annualPage');
        if (mainPage && statsPage && annualPage) {
            mainPage.style.display = 'none';
            statsPage.style.display = 'block';
            annualPage.style.display = 'none';
            updateWorkedHoursAndSummary();
        } else {
            console.warn('Page elements not found');
        }
    } catch (e) {
        console.error('Error in showStatsPage:', e);
    }
}

function showMainPage() {
    try {
        console.log('Showing main page');
        const mainPage = document.getElementById('mainPage');
        const statsPage = document.getElementById('statsPage');
        const annualPage = document.getElementById('annualPage');
        if (mainPage && statsPage && annualPage) {
            mainPage.style.display = 'block';
            statsPage.style.display = 'none';
            annualPage.style.display = 'none';
            renderCalendar();
        } else {
            console.warn('Page elements not found');
        }
    } catch (e) {
        console.error('Error in showMainPage:', e);
    }
}

function showAnnualPage() {
    try {
        console.log('Showing annual page');
        const mainPage = document.getElementById('mainPage');
        const statsPage = document.getElementById('statsPage');
        const annualPage = document.getElementById('annualPage');
        if (mainPage && statsPage && annualPage) {
            mainPage.style.display = 'none';
            statsPage.style.display = 'none';
            annualPage.style.display = 'block';
            renderAnnualCalendar();
            updateAnnualStats();
        } else {
            console.warn('Page elements not found');
        }
    } catch (e) {
        console.error('Error in showAnnualPage:', e);
    }
}

function renderShiftSelector() {
    try {
        console.log('Rendering shift selector');
        const shiftSelector = document.getElementById('shiftSelector');
        if (shiftSelector) {
            shiftSelector.innerHTML = '';
            Object.keys(shifts).forEach(shiftKey => {
                const shift = shifts[shiftKey];
                const shiftOption = document.createElement('div');
                shiftOption.className = `shift-option ${selectedShift === shiftKey ? 'selected-shift' : ''}`;
                shiftOption.style.backgroundColor = shift.color;
                shiftOption.textContent = shift.abbreviation;
                shiftOption.title = `${shift.name} (${decimalToTime(shifts[shiftKey].hours)})`;
                shiftOption.addEventListener('click', () => {
                    try {
                        selectedShift = shiftKey;
                        renderShiftSelector();
                    } catch (e) {
                        console.error('Error in shiftOption click:', e);
                    }
                });
                shiftSelector.appendChild(shiftOption);
            });
        } else {
            console.warn('Shift selector not found');
        }
    } catch (e) {
        console.error('Error in renderShiftSelector:', e);
    }
}

function clearShift() {
    try {
        console.log('Clearing shift');
        selectedShift = null;
        renderShiftSelector();
    } catch (e) {
        console.error('Error in clearShift:', e);
    }
}

function renderCalendar() {
    try {
        console.log('Starting renderCalendar for', currentMonth, currentYear);
        const calendar = document.getElementById('calendar');
        const monthYear = document.getElementById('monthYear');
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        
        if (!calendar) {
            console.error('Calendar element not found in DOM');
            return;
        }
        console.log('Calendar element found:', calendar);

        // Forza visibilità per debug
        calendar.style.display = 'grid';
        calendar.style.visibility = 'visible';

        if (!monthYear) {
            console.warn('monthYear element not found');
        }

        console.log('Clearing existing calendar children');
        while (calendar.children.length > 7) {
            calendar.removeChild(calendar.lastChild);
        }

        const monthNames = {
            it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
        };
        if (monthYear) {
            monthYear.textContent = `${monthNames[lang][currentMonth]} ${currentYear}`;
        }

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const offset = firstDay === 0 ? 6 : firstDay - 1;

        console.log(`Rendering ${offset} empty cells for offset`);
        for (let i = 0; i < offset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell';
            calendar.appendChild(emptyCell);
        }

        const today = new Date();
        const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

        console.log(`Rendering ${daysInMonth} day cells`);
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            if (isCurrentMonth && day === today.getDate()) {
                cell.classList.add('current-day', 'today');
            }

            const dayNumber = document.createElement('span');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            cell.appendChild(dayNumber);

            const shiftKey = `shift_${currentYear}_${currentMonth}_${day}`;
            const shiftNames = loadShift(shiftKey);
            if (shiftNames.length > 0) {
                console.log(`Rendering shifts for day ${day}:`, shiftNames);
                const shiftsContainer = document.createElement('div');
                shiftsContainer.className = 'shifts-container';
                shiftNames.slice(0, 5).forEach(shiftName => {
                    if (shifts[shiftName]) {
                        const shiftBadge = document.createElement('div');
                        shiftBadge.className = `shift-badge shift-count-${shiftNames.length} ${getTextLengthClass(shifts[shiftName].name)}`;
                        if (shiftNames.length === 1) {
                            shiftBadge.classList.add('single-shift');
                        }
                        shiftBadge.textContent = shifts[shiftName].name;
                        shiftBadge.title = `${shifts[shiftName].name} (${decimalToTime(shifts[shiftName].hours)})`;
                        shiftBadge.style.backgroundColor = shifts[shiftName].color;
                        shiftBadge.style.color = isDarkColor(shifts[shiftName].color) ? '#ffffff' : '#000000';
                        shiftsContainer.appendChild(shiftBadge);
                    } else {
                        console.warn(`Shift ${shiftName} not found in shifts object`);
                    }
                });
                cell.appendChild(shiftsContainer);
            }

            const date = new Date(currentYear, currentMonth, day);
            const isHoliday = holidays.some(h => h.month === currentMonth && h.day === day);
            const isSunday = date.getDay() === 0;
            if (isHoliday || isSunday) {
                cell.classList.add('holiday');
            }

            cell.addEventListener('click', (e) => {
                try {
                    if (e.target.classList.contains('note-edit-btn')) return;
                    if (selectedShift) {
                        const currentShifts = loadShift(shiftKey);
                        const shiftIndex = currentShifts.indexOf(selectedShift);
                        if (shiftIndex === -1) {
                            if (currentShifts.length < 5) {
                                currentShifts.push(selectedShift);
                                saveShift(shiftKey, currentShifts);
                                renderCalendar();
                                updateWorkedHoursAndSummary();
                            } else {
                                alert('alertMaxShifts');
                            }
                        } else {
                            currentShifts.splice(shiftIndex, 1);
                            saveShift(shiftKey, currentShifts);
                            renderCalendar();
                            updateWorkedHoursAndSummary();
                        }
                    }
                } catch (e) {
                    console.error('Error in day cell click:', e);
                }
            });

            const noteKey = `note_${currentYear}_${currentMonth}_${day}`;
            const noteData = loadNote(noteKey);
            if (noteData.text) {
                cell.classList.add('has-note');
                const noteDiv = document.createElement('div');
                noteDiv.className = 'note-text';
                noteDiv.textContent = noteData.text;
                if (shiftNames.length < 5) {
                    noteDiv.style.display = 'block';
                }
                cell.appendChild(noteDiv);
            }

            const noteEditBtn = document.createElement('div');
            noteEditBtn.className = 'note-edit-btn';
            noteEditBtn.innerHTML = '<i class="fas fa-edit"></i>';
            noteEditBtn.title = translations[lang].editNote;
            noteEditBtn.addEventListener('click', (e) => {
                try {
                    e.stopPropagation();
                    openNoteModal(currentYear, currentMonth, day);
                } catch (e) {
                    console.error('Error in note edit button click:', e);
                }
            });
            cell.appendChild(noteEditBtn);

            calendar.appendChild(cell);
        }

        const totalCellsNeeded = offset + daysInMonth;
        const rowsNeeded = Math.ceil(totalCellsNeeded / 7);
        const totalCells = rowsNeeded * 7;
        console.log(`Filling remaining ${totalCells - calendar.children.length} cells`);
        while (calendar.children.length < totalCells) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell';
            calendar.appendChild(emptyCell);
        }

        console.log('renderCalendar completed');
    } catch (e) {
        console.error('Error in renderCalendar:', e);
    }
}

function prevMonth() {
    try {
        console.log('Navigating to previous month');
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        if (document.getElementById('statsPage')?.style.display === 'block') {
            updateWorkedHoursAndSummary();
        }
    } catch (e) {
        console.error('Error in prevMonth:', e);
    }
}

function nextMonth() {
    try {
        console.log('Navigating to next month');
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        if (document.getElementById('statsPage')?.style.display === 'block') {
            updateWorkedHoursAndSummary();
        }
    } catch (e) {
        console.error('Error in nextMonth:', e);
    }
}

function renderAnnualCalendar() {
    try {
        console.log('Rendering annual calendar');
        const annualContainer = document.getElementById('annualCalendar');
        if (!annualContainer) {
            console.warn('Annual calendar container not found');
            return;
        }
        annualContainer.innerHTML = '';
        const today = new Date();
        const currentYear = today.getFullYear();
        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'annual-month';
            const titleDiv = document.createElement('div');
            titleDiv.className = 'annual-month-title';
            titleDiv.textContent = getMonthName(month, currentYear);
            monthDiv.appendChild(titleDiv);
            const gridDiv = document.createElement('div');
            gridDiv.className = 'annual-month-grid';
            const dayNames = getDayNames();
            dayNames.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'annual-day-cell';
                dayHeader.textContent = day;
                gridDiv.appendChild(dayHeader);
            });
            const firstDay = new Date(currentYear, month, 1).getDay();
            const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
            const offset = firstDay === 0 ? 6 : firstDay - 1;
            for (let i = 0; i < offset; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'annual-day-cell';
                gridDiv.appendChild(emptyCell);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const cell = document.createElement('div');
                cell.className = 'annual-day-cell';
                if (today.getFullYear() === currentYear && today.getMonth() === month && today.getDate() === day) {
                    cell.classList.add('today');
                }
                const date = new Date(currentYear, month, day);
                const isHoliday = holidays.some(h => h.month === month && h.day === day) || date.getDay() === 0;
                if (isHoliday) {
                    cell.classList.add('holiday');
                }
                const shiftKey = `shift_${currentYear}_${month}_${day}`;
                const shiftNames = loadShift(shiftKey);
                if (shiftNames.length > 0) {
                    cell.classList.add('has-shift');
                    const combinedText = shiftNames.map(name => shifts[name]?.name || '?').join('');
                    cell.textContent = combinedText;
                    cell.classList.add(getTextLengthClass(combinedText));
                    if (shifts[shiftNames[0]]) {
                        cell.style.backgroundColor = shifts[shiftNames[0]].color;
                        cell.style.color = isDarkColor(shifts[shiftNames[0]].color) ? '#ffffff' : '#000000';
                    }
                } else {
                    cell.textContent = day;
                }
                gridDiv.appendChild(cell);
            }
            monthDiv.appendChild(gridDiv);
            annualContainer.appendChild(monthDiv);
        }
    } catch (e) {
        console.error('Error in renderAnnualCalendar:', e);
    }
}

function isDarkColor(hex) {
    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    } catch (e) {
        console.error('Error in isDarkColor:', e);
        return false;
    }
}

function updateAnnualStats() {
    try {
        console.log('Updating annual stats');
        const annualWorkedHours = document.getElementById('annualWorkedHours');
        const annualShiftsDetails = document.getElementById('annualShiftsDetails');
        if (!annualWorkedHours || !annualShiftsDetails) {
            console.warn('Annual stats elements not found');
            return;
        }
        const currentYear = new Date().getFullYear();
        let totalWorked = 0;
        const shiftCounts = {};
        const shiftHours = {};
        Object.keys(shifts).forEach(shift => {
            shiftCounts[shift] = 0;
            shiftHours[shift] = 0;
        });
        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const shiftKey = `shift_${currentYear}_${month}_${day}`;
                const shiftNames = loadShift(shiftKey);
                shiftNames.forEach(shiftName => {
                    if (shifts[shiftName]) {
                        shiftCounts[shiftName]++;
                        shiftHours[shiftName] += shifts[shiftName].hours;
                        totalWorked += shifts[shiftName].hours;
                    }
                });
            }
        }
        annualWorkedHours.textContent = decimalToTime(totalWorked);
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        let summaryHtml = '';
        Object.keys(shifts).forEach(shift => {
            const totalHours = shiftHours[shift];
            const formattedHours = decimalToTime(totalHours);
            summaryHtml += `
                <div class="stats-item">
                    <div class="stats-item-title">${shifts[shift].name}</div>
                    <div class="stats-item-value">${shiftCounts[shift]}</div>
                    <div class="stats-item-title">${formattedHours}</div>
                </div>
            `;
        });
        if (!Object.keys(shifts).length) {
            summaryHtml = `<div class="stats-item">${translations[lang].noShiftsAssigned}</div>`;
        }
        annualShiftsDetails.innerHTML = summaryHtml;
    } catch (e) {
        console.error('Error in updateAnnualStats:', e);
    }
}

function getMonthName(month, year) {
    try {
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        const monthNames = {
            it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
        };
        return monthNames[lang][month];
    } catch (e) {
        console.error('Error in getMonthName:', e);
        return '';
    }
}

function getDayNames() {
    try {
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        return {
            it: ['L', 'M', 'M', 'G', 'V', 'S', 'D']
        }[lang];
    } catch (e) {
        console.error('Error in getDayNames:', e);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM content loaded, initializing app');
        initializeLanguageSelector();
        initializeHamburgerMenu();
        initializeNotifications();
        loadCustomShifts();
        renderShiftSelector();
        renderCalendar();
        showMainPage();
    } catch (e) {
        console.error('Error in DOMContentLoaded:', e);
    }
});
