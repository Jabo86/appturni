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

// Traduzioni
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
        viewAnnual: "Visualizzazione Annuale",
        monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        dayNames: ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']
    },
    en: {
        title: "ShiftApp",
        prevMonth: "Previous",
        nextMonth: "Next",
        monday: "MON",
        tuesday: "TUE",
        wednesday: "WED",
        thursday: "THU",
        friday: "FRI",
        saturday: "SAT",
        sunday: "SUN",
        selectShift: "Select Shift",
        clearShift: "Clear Shift",
        addShift: "Add Shift",
        editShift: "Edit Shift",
        deleteShift: "Delete Shift",
        statistics: "Statistics",
        statsTitle: "Complete Statistics",
        workedHours: "Worked Hours",
        totalHoursMonth: "Total hours this month",
        shifts: "Shifts",
        notes: "Notes",
        backToCalendar: "Back to Calendar",
        createShiftTitle: "Create New Shift",
        shiftNameLabel: "Shift Name (e.g. Morning)",
        shiftNamePlaceholder: "Enter shift name",
        shiftAbbreviationLabel: "Abbreviation (e.g. M, optional)",
        shiftAbbreviationPlaceholder: "Enter abbreviation",
        shiftHoursLabel: "Hours (HH:MM)",
        shiftHoursPlaceholder: "E.g. 07:15",
        shiftColorLabel: "Shift Color",
        cancel: "Cancel",
        create: "Create",
        deleteShiftTitle: "Delete Shift",
        selectShiftLabel: "Select Shift",
        selectShiftOption: "Select a shift",
        delete: "Delete",
        editShiftTitle: "Edit Shift",
        save: "Save",
        noteTitle: "Add/Edit Note",
        noteLabel: "Note",
        notePlaceholder: "Enter a note",
        noteTimeLabel: "Notification Time",
        noteTimePlaceholder: "Select time (e.g. 07:00)",
        alertInvalidNameHours: "Enter a valid name and valid hours (e.g. 07:15).",
        alertInvalidHours: "Enter a valid time in the format HH:MM.",
        alertShiftExists: "A shift with this name already exists.",
        alertSelectShiftToEdit: "Select a shift to edit.",
        alertSelectShiftToDelete: "Select a shift to delete.",
        alertMaxShifts: "You can assign a maximum of 5 shifts per day.",
        alertSaveShiftError: "Error saving shifts.",
        alertSaveNoteError: "Error saving the note.",
        alertNotificationPermission: "Allow notifications to receive note alerts.",
        noShiftsAssigned: "No shifts assigned",
        noNotesPresent: "No notes present",
        editNote: "Edit note",
        annualTitle: "Annual View",
        annualStats: "Annual Statistics",
        totalHoursYear: "Total hours this year",
        viewAnnual: "Annual View",
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        dayNames: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    },
    es: {
        title: "AppTurnos",
        prevMonth: "Anterior",
        nextMonth: "Siguiente",
        monday: "LUN",
        tuesday: "MAR",
        wednesday: "MIÉ",
        thursday: "JUE",
        friday: "VIE",
        saturday: "SÁB",
        sunday: "DOM",
        selectShift: "Seleccionar Turno",
        clearShift: "Borrar Turno",
        addShift: "Agregar Turno",
        editShift: "Editar Turno",
        deleteShift: "Eliminar Turno",
        statistics: "Estadísticas",
        statsTitle: "Estadísticas Completas",
        workedHours: "Horas Trabajadas",
        totalHoursMonth: "Total de horas este mes",
        shifts: "Turnos",
        notes: "Notas",
        backToCalendar: "Volver al Calendario",
        createShiftTitle: "Crear Nuevo Turno",
        shiftNameLabel: "Nombre del Turno (ej. Mañana)",
        shiftNamePlaceholder: "Ingresa el nombre del turno",
        shiftAbbreviationLabel: "Abreviatura (ej. M, opcional)",
        shiftAbbreviationPlaceholder: "Ingresa la abreviatura",
        shiftHoursLabel: "Horas (HH:MM)",
        shiftHoursPlaceholder: "Ej. 07:15",
        shiftColorLabel: "Color del Turno",
        cancel: "Cancelar",
        create: "Crear",
        deleteShiftTitle: "Eliminar Turno",
        selectShiftLabel: "Seleccionar Turno",
        selectShiftOption: "Selecciona un turno",
        delete: "Eliminar",
        editShiftTitle: "Editar Turno",
        save: "Guardar",
        noteTitle: "Agregar/Editar Nota",
        noteLabel: "Nota",
        notePlaceholder: "Ingresa una nota",
        noteTimeLabel: "Hora de Notificación",
        noteTimePlaceholder: "Selecciona la hora (ej. 07:00)",
        alertInvalidNameHours: "Ingresa un nombre válido y una hora válida (ej. 07:15).",
        alertInvalidHours: "Ingresa una hora válida en el formato HH:MM.",
        alertShiftExists: "Ya existe un turno con este nombre.",
        alertSelectShiftToEdit: "Selecciona un turno para editar.",
        alertSelectShiftToDelete: "Selecciona un turno para eliminar.",
        alertMaxShifts: "Puedes asignar un máximo de 5 turnos por día.",
        alertSaveShiftError: "Error al guardar los turnos.",
        alertSaveNoteError: "Error al guardar la nota.",
        alertNotificationPermission: "Permite las notificaciones para recibir alertas sobre notas.",
        noShiftsAssigned: "No hay turnos asignados",
        noNotesPresent: "No hay notas presentes",
        editNote: "Editar nota",
        annualTitle: "Vista Anual",
        annualStats: "Estadísticas Anuales",
        totalHoursYear: "Total de horas este año",
        viewAnnual: "Vista Anual",
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        dayNames: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
    },
    de: {
        title: "SchichtApp",
        prevMonth: "Vorheriger",
        nextMonth: "Nächster",
        monday: "MO",
        tuesday: "DI",
        wednesday: "MI",
        thursday: "DO",
        friday: "FR",
        saturday: "SA",
        sunday: "SO",
        selectShift: "Schicht auswählen",
        clearShift: "Schicht entfernen",
        addShift: "Schicht hinzufügen",
        editShift: "Schicht bearbeiten",
        deleteShift: "Schicht löschen",
        statistics: "Statistiken",
        statsTitle: "Vollständige Statistiken",
        workedHours: "Gearbeitete Stunden",
        totalHoursMonth: "Gesamte Stunden in diesem Monat",
        shifts: "Schichten",
        notes: "Notizen",
        backToCalendar: "Zurück zum Kalender",
        createShiftTitle: "Neue Schicht erstellen",
        shiftNameLabel: "Schichtname (z.B. Morgen)",
        shiftNamePlaceholder: "Schichtname eingeben",
        shiftAbbreviationLabel: "Abkürzung (z.B. M, optional)",
        shiftAbbreviationPlaceholder: "Abkürzung eingeben",
        shiftHoursLabel: "Stunden (HH:MM)",
        shiftHoursPlaceholder: "Z.B. 07:15",
        shiftColorLabel: "Schichtfarbe",
        cancel: "Abbrechen",
        create: "Erstellen",
        deleteShiftTitle: "Schicht löschen",
        selectShiftLabel: "Schicht auswählen",
        selectShiftOption: "Wähle eine Schicht",
        delete: "Löschen",
        editShiftTitle: "Schicht bearbeiten",
        save: "Speichern",
        noteTitle: "Notiz hinzufügen/bearbeiten",
        noteLabel: "Notiz",
        notePlaceholder: "Notiz eingeben",
        noteTimeLabel: "Benachrichtigungszeit",
        noteTimePlaceholder: "Zeit auswählen (z.B. 07:00)",
        alertInvalidNameHours: "Gib einen gültigen Namen und gültige Stunden ein (z.B. 07:15).",
        alertInvalidHours: "Gib eine gültige Zeit im Format HH:MM ein.",
        alertShiftExists: "Eine Schicht mit diesem Namen existiert bereits.",
        alertSelectShiftToEdit: "Wähle eine Schicht zum Bearbeiten aus.",
        alertSelectShiftToDelete: "Wähle eine Schicht zum Löschen aus.",
        alertMaxShifts: "Du kannst maximal 5 Schichten pro Tag zuweisen.",
        alertSaveShiftError: "Fehler beim Speichern der Schichten.",
        alertSaveNoteError: "Fehler beim Speichern der Notiz.",
        alertNotificationPermission: "Erlaube Benachrichtigungen, um Notiz-Warnungen zu erhalten.",
        noShiftsAssigned: "Keine Schichten zugewiesen",
        noNotesPresent: "Keine Notizen vorhanden",
        editNote: "Notiz bearbeiten",
        annualTitle: "Jährliche Ansicht",
        annualStats: "Jährliche Statistiken",
        totalHoursYear: "Gesamte Stunden dieses Jahr",
        viewAnnual: "Jährliche Ansicht",
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        dayNames: ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO']
    },
    fr: {
        title: "AppTurnus",
        prevMonth: "Précédent",
        nextMonth: "Suivant",
        monday: "LUN",
        tuesday: "MAR",
        wednesday: "MER",
        thursday: "JEU",
        friday: "VEN",
        saturday: "SAM",
        sunday: "DIM",
        selectShift: "Sélectionner une équipe",
        clearShift: "Supprimer l'équipe",
        addShift: "Ajouter une équipe",
        editShift: "Modifier l'équipe",
        deleteShift: "Supprimer l'équipe",
        statistics: "Statistiques",
        statsTitle: "Statistiques complètes",
        workedHours: "Heures travaillées",
        totalHoursMonth: "Total des heures ce mois-ci",
        shifts: "Équipes",
        notes: "Notes",
        backToCalendar: "Retour au calendrier",
        createShiftTitle: "Créer une nouvelle équipe",
        shiftNameLabel: "Nom de l'équipe (ex. Matin)",
        shiftNamePlaceholder: "Entrez le nom de l'équipe",
        shiftAbbreviationLabel: "Abréviation (ex. M, facultatif)",
        shiftAbbreviationPlaceholder: "Entrez l'abréviation",
        shiftHoursLabel: "Heures (HH:MM)",
        shiftHoursPlaceholder: "Ex. 07:15",
        shiftColorLabel: "Couleur de l'équipe",
        cancel: "Annuler",
        create: "Créer",
        deleteShiftTitle: "Supprimer l'équipe",
        selectShiftLabel: "Sélectionner une équipe",
        selectShiftOption: "Sélectionnez une équipe",
        delete: "Supprimer",
        editShiftTitle: "Modifier l'équipe",
        save: "Enregistrer",
        noteTitle: "Ajouter/Modifier une note",
        noteLabel: "Note",
        notePlaceholder: "Entrez une note",
        noteTimeLabel: "Heure de notification",
        noteTimePlaceholder: "Sélectionnez l'heure (ex. 07:00)",
        alertInvalidNameHours: "Entrez un nom valide et des heures valides (ex. 07:15).",
        alertInvalidHours: "Entrez une heure valide au format HH:MM.",
        alertShiftExists: "Une équipe avec ce nom existe déjà.",
        alertSelectShiftToEdit: "Sélectionnez une équipe à modifier.",
        alertSelectShiftToDelete: "Sélectionnez une équipe à supprimer.",
        alertMaxShifts: "Vous pouvez assigner un maximum de 5 équipes par jour.",
        alertSaveShiftError: "Erreur lors de l'enregistrement des équipes.",
        alertSaveNoteError: "Erreur lors de l'enregistrement de la note.",
        alertNotificationPermission: "Autorisez les notifications pour recevoir des alertes sur les notes.",
        noShiftsAssigned: "Aucune équipe assignée",
        noNotesPresent: "Aucune note présente",
        editNote: "Modifier la note",
        annualTitle: "Vue annuelle",
        annualStats: "Statistiques annuelles",
        totalHoursYear: "Total des heures cette année",
        viewAnnual: "Vue annuelle",
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
    }
};

// Funzioni di supporto
function getTextLengthClass(text) {
    try {
        const length = text?.length || 0;
        if (length <= 4) return 'short-text';
        if (length <= 6) return 'medium-text';
        if (length <= 8) return 'long-text';
        return 'very-long-text';
    } catch (e) {
        console.error('Error in getTextLengthClass:', e);
        return 'medium-text';
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

// Traduzioni e inizializzazione
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
            } else {
                console.warn(`Translation missing for key "${key}" in language "${lang}"`);
            }
        });
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            } else {
                console.warn(`Placeholder translation missing for key "${key}" in language "${lang}"`);
            }
        });
        document.title = translations[lang].title;
        document.querySelectorAll('.note-edit-btn').forEach(btn => {
            btn.title = translations[lang].editNote;
        });
        const monthYearElement = document.getElementById('monthYear');
        if (monthYearElement) {
            monthYearElement.textContent = `${translations[lang].monthNames[currentMonth]} ${currentYear}`;
        }
        const dayHeaders = document.querySelectorAll('.day-header');
        dayHeaders.forEach((header, index) => {
            header.textContent = translations[lang].dayNames[index];
        });
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
        const languageButton = document.getElementById('languageButton');
        const languageDropdown = document.getElementById('languageDropdown');
        const languageFlagSpan = document.getElementById('languageFlag');
        const languageOptions = document.querySelectorAll('.language-option');
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'it';
        const languageMap = {
            'it': { name: 'Italiano', flag: 'flag-icon-it' },
            'en': { name: 'English', flag: 'flag-icon-gb' },
            'es': { name: 'Español', flag: 'flag-icon-es' },
            'de': { name: 'Deutsch', flag: 'flag-icon-de' },
            'fr': { name: 'Français', flag: 'flag-icon-fr' }
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
                    if (languageMap[lang]) {
                        languageFlagSpan.className = `flag-icon ${languageMap[lang].flag}`;
                        localStorage.setItem('selectedLanguage', lang);
                        languageDropdown.classList.remove('active');
                        languageButton.classList.remove('active');
                        updateTranslations(lang);
                        renderCalendar();
                    }
                });
            });

            document.addEventListener('click', (e) => {
                if (!languageButton.contains(e.target) && !languageDropdown.contains(e.target)) {
                    languageDropdown.classList.remove('active');
                    languageButton.classList.remove('active');
                }
            });
        }
    } catch (e) {
        console.error('Error in initializeLanguageSelector:', e);
    }
}

function initializeHamburgerMenu() {
    try {
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
            }
        }
    } catch (e) {
        console.error('Error in initializeHamburgerMenu:', e);
    }
}

// Gestione turni
function createShift() {
    try {
        const shiftName = document.getElementById('shiftName')?.value?.trim().toUpperCase() || '';
        const shiftAbbreviation = document.getElementById('shiftAbbreviation')?.value?.trim().toUpperCase() || shiftName;
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
            abbreviation: shiftAbbreviation,
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

function openCreateShiftModal() {
    try {
        const modal = document.getElementById('createShiftModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    } catch (e) {
        console.error('Error in openCreateShiftModal:', e);
    }
}

function closeCreateShiftModal() {
    try {
        const modal = document.getElementById('createShiftModal');
        if (modal) {
            modal.classList.add('hidden');
            ['shiftName', 'shiftAbbreviation', 'shiftHours', 'shiftColor'].forEach(id => {
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

function openEditShiftModal() {
    try {
        const select = document.createElement('select');
        select.id = 'editShiftSelect';
        select.className = 'w-full p-2 border rounded-lg mb-4';
        select.innerHTML = `<option value="" data-translate="selectShiftOption">${translations[localStorage.getItem('selectedLanguage') || 'it'].selectShiftOption}</option>` +
            Object.keys(shifts).map(
                key => `<option value="${key}">${shifts[key].name} (${decimalToTime(shifts[key].hours)})</option>`
            ).join('');
        select.addEventListener('change', () => {
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
                ['editShiftName', 'editShiftAbbreviation', 'editShiftHours', 'editShiftColor'].forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.value = id === 'editShiftColor' ? '#fef3c7' : '';
                    }
                });
            }
        });
        const modal = document.getElementById('editShiftModal');
        if (modal) {
            const modalContent = modal.querySelector('.bg-white.p-6.rounded-lg.shadow-lg.max-w-sm.w-full');
            const title = modalContent?.querySelector('h3');
            if (modalContent && title) {
                title.insertAdjacentElement('afterend', select);
            }
            modal.classList.remove('hidden');
            updateTranslations(localStorage.getItem('selectedLanguage') || 'it');
        }
    } catch (e) {
        console.error('Error in openEditShiftModal:', e);
    }
}

function closeEditShiftModal() {
    try {
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
        if (!currentEditShiftKey) {
            alert('alertSelectShiftToEdit');
            return;
        }
        const oldShiftName = currentEditShiftKey;
        const newShiftName = document.getElementById('editShiftName')?.value?.trim().toUpperCase() || '';
        const shiftAbbreviation = document.getElementById('editShiftAbbreviation')?.value?.trim().toUpperCase() || newShiftName;
        const shiftHoursInput = document.getElementById('editShiftHours')?.value?.trim() || '';
        const shiftColor = document.getElementById('editShiftColor')?.value || '#fef3c7';
        if (!newShiftName || !shiftHoursInput) {
            alert('alertInvalidNameHours');
            return;
        }
        const shiftHours = timeToDecimal(shiftHoursInput);
        if (isNaN(shiftHours)) {
            alert('alertInvalidHours');
            return;
        }
        if (newShiftName !== oldShiftName && shifts[newShiftName]) {
            alert('alertShiftExists');
            return;
        }

        const updatedShift = {
            name: newShiftName,
            abbreviation: shiftAbbreviation,
            hours: shiftHours,
            color: shiftColor
        };
        if (newShiftName !== oldShiftName) {
            delete shifts[oldShiftName];
            shifts[newShiftName] = updatedShift;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('shift_')) {
                    const shiftNames = loadShift(key);
                    if (shiftNames.includes(oldShiftName)) {
                        const updatedShifts = shiftNames.map(name => name === oldShiftName ? newShiftName : name);
                        saveShift(key, updatedShifts);
                    }
                }
            }
        } else {
            shifts[oldShiftName] = updatedShift;
        }

        saveCustomShifts();
        closeEditShiftModal();
        renderShiftSelector();
        renderCalendar();
        if (document.getElementById('annualPage')?.style.display === 'block') {
            renderAnnualCalendar();
            updateAnnualStats();
        }
        updateWorkedHoursAndSummary();
        if (selectedShift === oldShiftName) {
            selectedShift = newShiftName;
            renderShiftSelector();
        }
    } catch (e) {
        console.error('Error in updateShift:', e);
    }
}

function openDeleteShiftModal() {
    try {
        const select = document.getElementById('deleteShiftSelect');
        if (select) {
            select.innerHTML = `<option value="" data-translate="selectShiftOption">${translations[localStorage.getItem('selectedLanguage') || 'it'].selectShiftOption}</option>` +
                Object.keys(shifts).map(
                    key => `<option value="${key}">${shifts[key].name} (${decimalToTime(shifts[key].hours)})</option>`
                ).join('');
            const modal = document.getElementById('deleteShiftModal');
            if (modal) {
                modal.classList.remove('hidden');
                updateTranslations(localStorage.getItem('selectedLanguage') || 'it');
            }
        }
    } catch (e) {
        console.error('Error in openDeleteShiftModal:', e);
    }
}

function closeDeleteShiftModal() {
    try {
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
        }
        closeDeleteShiftModal();
        renderShiftSelector();
        renderCalendar();
        updateWorkedHoursAndSummary();
    } catch (e) {
        console.error('Error in deleteShift:', e);
    }
}

// Gestione note
function saveNote() {
    try {
        if (currentNoteKey && isStorageAvailable) {
            const noteText = document.getElementById('noteText')?.value?.trim() || '';
            if (noteText) {
                const noteData = { text: noteText };
                localStorage.setItem(currentNoteKey, JSON.stringify(noteData));
            } else {
                localStorage.removeItem(currentNoteKey);
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
            return note ? JSON.parse(note) : { text: '' };
        }
        return { text: '' };
    } catch (e) {
        console.error('Error in loadNote:', e);
        return { text: '' };
    }
}

function openNoteModal(year, month, day) {
    try {
        currentNoteKey = `note_${year}_${month}_${day}`;
        const noteData = loadNote(currentNoteKey);
        const noteText = document.getElementById('noteText');
        if (noteText) noteText.value = noteData.text;
        const modal = document.getElementById('noteModal');
        if (modal) {
            modal.classList.remove('hidden');
            updateTranslations(localStorage.getItem('selectedLanguage') || 'it');
        }
    } catch (e) {
        console.error('Error in openNoteModal:', e);
    }
}

function closeNoteModal() {
    try {
        const modal = document.getElementById('noteModal');
        const noteText = document.getElementById('noteText');
        if (modal) modal.classList.add('hidden');
        if (noteText) noteText.value = '';
        currentNoteKey = null;
    } catch (e) {
        console.error('Error in closeNoteModal:', e);
    }
}

// Rendering e navigazione
function renderShiftSelector() {
    try {
        const shiftSelector = document.getElementById('shiftSelector');
        if (shiftSelector) {
            shiftSelector.innerHTML = '';
            Object.keys(shifts).forEach(shiftKey => {
                const shift = shifts[shiftKey];
                const shiftOption = document.createElement('div');
                shiftOption.className = `shift-option ${selectedShift === shiftKey ? 'selected-shift' : ''} ${getTextLengthClass(shift.name)}`;
                shiftOption.style.backgroundColor = shift.color;
                shiftOption.style.color = isDarkColor(shift.color) ? '#ffffff' : '#000000';
                shiftOption.textContent = shift.name;
                shiftOption.title = `${shift.name} (${shift.abbreviation}, ${decimalToTime(shift.hours)})`;
                shiftOption.addEventListener('click', () => {
                    selectedShift = shiftKey;
                    renderShiftSelector();
                });
                shiftSelector.appendChild(shiftOption);
            });
        }
    } catch (e) {
        console.error('Error in renderShiftSelector:', e);
    }
}

function clearShift() {
    try {
        selectedShift = null;
        renderShiftSelector();
    } catch (e) {
        console.error('Error in clearShift:', e);
    }
}

function renderCalendar() {
    try {
        const calendar = document.getElementById('calendar');
        const monthYear = document.getElementById('monthYear');
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        
        if (!calendar) {
            console.error('Calendar element not found');
            return;
        }

        while (calendar.children.length > 7) {
            calendar.removeChild(calendar.lastChild);
        }

        if (monthYear) {
            monthYear.textContent = `${translations[lang].monthNames[currentMonth]} ${currentYear}`;
        }

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const offset = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < offset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell';
            calendar.appendChild(emptyCell);
        }

        const today = new Date();
        const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

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
                const shiftsContainer = document.createElement('div');
                shiftsContainer.className = 'shifts-container';
                shiftNames.slice(0, 5).forEach(shiftName => {
                    if (shifts[shiftName]) {
                        const shiftBadge = document.createElement('div');
                        shiftBadge.className = `shift-badge shift-count-${shiftNames.length} ${getTextLengthClass(shifts[shiftName].abbreviation)}`;
                        if (shiftNames.length === 1) {
                            shiftBadge.classList.add('single-shift');
                        }
                        shiftBadge.textContent = shifts[shiftName].abbreviation;
                        shiftBadge.title = `${shifts[shiftName].name} (${decimalToTime(shifts[shiftName].hours)})`;
                        shiftBadge.style.backgroundColor = shifts[shiftName].color;
                        shiftBadge.style.color = isDarkColor(shifts[shiftName].color) ? '#ffffff' : '#000000';
                        shiftsContainer.appendChild(shiftBadge);
                    }
                });
                cell.appendChild(shiftsContainer);
            }

            const date = new Date(currentYear, currentMonth, day);
            const isHoliday = holidays.some(h => h.month === currentMonth && h.day === day) || date.getDay() === 0;
            if (isHoliday) {
                cell.classList.add('holiday');
            }

            cell.addEventListener('click', (e) => {
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
                e.stopPropagation();
                openNoteModal(currentYear, currentMonth, day);
            });
            cell.appendChild(noteEditBtn);

            calendar.appendChild(cell);
        }

        const totalCellsNeeded = offset + daysInMonth;
        const rowsNeeded = Math.ceil(totalCellsNeeded / 7);
        const totalCells = rowsNeeded * 7;
        while (calendar.children.length < totalCells) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell';
            calendar.appendChild(emptyCell);
        }
    } catch (e) {
        console.error('Error in renderCalendar:', e);
    }
}

function renderAnnualCalendar() {
    try {
        const annualContainer = document.getElementById('annualCalendar');
        if (!annualContainer) return;

        annualContainer.innerHTML = '';
        const today = new Date();
        const currentYear = today.getFullYear();
        const lang = localStorage.getItem('selectedLanguage') || 'it';

        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'annual-month';
            const titleDiv = document.createElement('div');
            titleDiv.className = 'annual-month-title';
            titleDiv.textContent = translations[lang].monthNames[month];
            monthDiv.appendChild(titleDiv);
            const gridDiv = document.createElement('div');
            gridDiv.className = 'annual-month-grid';
            translations[lang].dayNames.forEach(day => {
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
                    const combinedText = shiftNames.map(name => shifts[name]?.abbreviation || '?').join('');
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

// Statistiche
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
        const statsWorkedHours = document.getElementById('statsWorkedHours');
        const statsShiftsDetails = document.getElementById('statsShiftsDetails');
        if (statsWorkedHours && statsShiftsDetails) {
            const workedHours = calculateWorkedHours();
            statsWorkedHours.textContent = decimalToTime(workedHours);
            statsShiftsDetails.innerHTML = calculateShiftSummary();
            updateStatsNotes();
        }
    } catch (e) {
        console.error('Error in updateWorkedHoursAndSummary:', e);
    }
}

function updateStatsNotes() {
    try {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        let notesHtml = '';
        const statsNotesList = document.getElementById('statsNotesList');
        if (!statsNotesList) return;

        for (let day = 1; day <= daysInMonth; day++) {
            const noteKey = `note_${currentYear}_${currentMonth}_${day}`;
            const noteData = loadNote(noteKey);
            if (noteData.text) {
                const date = new Date(currentYear, currentMonth, day);
                const dayName = translations[lang].dayNames[date.getDay()];
                notesHtml += `
                    <div class="mb-3 pb-3 border-b border-blue-300">
                        <div class="font-bold text-white">${day} ${dayName}</div>
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

function updateAnnualStats() {
    try {
        const annualWorkedHours = document.getElementById('annualWorkedHours');
        const annualShiftsDetails = document.getElementById('annualShiftsDetails');
        if (!annualWorkedHours || !annualShiftsDetails) return;

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

// Navigazione tra pagine
function showStatsPage() {
    try {
        const mainPage = document.getElementById('mainPage');
        const statsPage = document.getElementById('statsPage');
        const annualPage = document.getElementById('annualPage');
        if (mainPage && statsPage && annualPage) {
            mainPage.style.display = 'none';
            statsPage.style.display = 'block';
            annualPage.style.display = 'none';
            updateWorkedHoursAndSummary();
        }
    } catch (e) {
        console.error('Error in showStatsPage:', e);
    }
}

function showMainPage() {
    try {
        const mainPage = document.getElementById('mainPage');
        const statsPage = document.getElementById('statsPage');
        const annualPage = document.getElementById('annualPage');
        if (mainPage && statsPage && annualPage) {
            mainPage.style.display = 'block';
            statsPage.style.display = 'none';
            annualPage.style.display = 'none';
            renderCalendar();
        }
    } catch (e) {
        console.error('Error in showMainPage:', e);
    }
}

function showAnnualPage() {
    try {
        const mainPage = document.getElementById('mainPage');
        const statsPage = document.getElementById('statsPage');
        const annualPage = document.getElementById('annualPage');
        if (mainPage && statsPage && annualPage) {
            mainPage.style.display = 'none';
            statsPage.style.display = 'none';
            annualPage.style.display = 'block';
            renderAnnualCalendar();
            updateAnnualStats();
        }
    } catch (e) {
        console.error('Error in showAnnualPage:', e);
    }
}

function prevMonth() {
    try {
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

// Funzioni di supporto
function getMonthName(month) {
    try {
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        return translations[lang].monthNames[month] || '';
    } catch (e) {
        console.error('Error in getMonthName:', e);
        return '';
    }
}

function getDayNames() {
    try {
        const lang = localStorage.getItem('selectedLanguage') || 'it';
        return translations[lang].dayNames || [];
    } catch (e) {
        console.error('Error in getDayNames:', e);
        return [];
    }
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM content loaded, initializing app');
        initializeLanguageSelector();
        initializeHamburgerMenu();
        loadCustomShifts();
        renderShiftSelector();
        renderCalendar();
        showMainPage();
    } catch (e) {
        console.error('Error in DOMContentLoaded:', e);
    }
});
