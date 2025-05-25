// widget.js
class AppTurniWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          background: #1e293b;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          color: #e2e8f0;
        }
        
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #334155;
        }
        
        .widget-title {
          font-weight: bold;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .widget-date {
          font-size: 14px;
          color: #94a3b8;
        }
        
        .shifts-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .shift-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border-radius: 8px;
          background: #334155;
        }
        
        .shift-name {
          font-weight: bold;
        }
        
        .shift-hours {
          color: #94a3b8;
          font-size: 14px;
        }
        
        .no-shifts {
          text-align: center;
          padding: 12px;
          color: #94a3b8;
          font-size: 14px;
        }
        
        .widget-footer {
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
        }
        
        .widget-button {
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .widget-button.secondary {
          background: #475569;
        }
      </style>
      
      <div class="widget-header">
        <div class="widget-title">
          <i class="fas fa-calendar-alt"></i>
          <span data-translate="widgetTitle">Turni di oggi</span>
        </div>
        <div class="widget-date" id="currentDate"></div>
      </div>
      
      <div class="shifts-container" id="shiftsList">
        <div class="no-shifts" data-translate="noShiftsToday">Nessun turno oggi</div>
      </div>
      
      <div class="widget-footer">
        <button class="widget-button secondary" id="openCalendarBtn">
          <i class="fas fa-calendar"></i>
          <span data-translate="openCalendar">Calendario</span>
        </button>
        <button class="widget-button" id="addShiftBtn">
          <i class="fas fa-plus"></i>
          <span data-translate="addShift">Aggiungi</span>
        </button>
      </div>
    `;
    
    this.currentDate = new Date();
    this.shifts = {};
    this.loadCustomShifts();
    this.updateWidget();
  }
  
  connectedCallback() {
    this.shadowRoot.getElementById('openCalendarBtn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('open-app'));
    });
    
    this.shadowRoot.getElementById('addShiftBtn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('add-shift', {
        detail: {
          date: this.currentDate
        }
      }));
    });
    
    this.updateTranslations();
  }
  
  loadCustomShifts() {
    try {
      const customShifts = localStorage.getItem('customShifts');
      if (customShifts) {
        this.shifts = JSON.parse(customShifts);
      }
    } catch (e) {
      console.error('Error loading shifts:', e);
    }
  }
  
  updateWidget() {
    const dateStr = `${this.currentDate.getDate()} ${this.getMonthName(this.currentDate.getMonth())} ${this.currentDate.getFullYear()}`;
    this.shadowRoot.getElementById('currentDate').textContent = dateStr;
    
    const shiftKey = `shift_${this.currentDate.getFullYear()}_${this.currentDate.getMonth()}_${this.currentDate.getDate()}`;
    const shiftNames = JSON.parse(localStorage.getItem(shiftKey) || '[]');
    const shiftsList = this.shadowRoot.getElementById('shiftsList');
    
    shiftsList.innerHTML = '';
    
    if (shiftNames.length === 0) {
      const noShifts = document.createElement('div');
      noShifts.className = 'no-shifts';
      noShifts.textContent = this.getTranslation('noShiftsToday');
      shiftsList.appendChild(noShifts);
      return;
    }
    
    shiftNames.forEach(shiftName => {
      if (this.shifts[shiftName]) {
        const shiftItem = document.createElement('div');
        shiftItem.className = 'shift-item';
        shiftItem.style.backgroundColor = this.shifts[shiftName].color;
        shiftItem.style.color = this.isDarkColor(this.shifts[shiftName].color) ? '#ffffff' : '#000000';
        
        const nameEl = document.createElement('div');
        nameEl.className = 'shift-name';
        nameEl.textContent = this.shifts[shiftName].name;
        
        const hoursEl = document.createElement('div');
        hoursEl.className = 'shift-hours';
        hoursEl.textContent = this.decimalToTime(this.shifts[shiftName].hours);
        
        shiftItem.appendChild(nameEl);
        shiftItem.appendChild(hoursEl);
        shiftsList.appendChild(shiftItem);
      }
    });
  }
  
  updateTranslations() {
    const lang = localStorage.getItem('selectedLanguage') || 'it';
    const translations = {
      it: {
        widgetTitle: 'Turni di oggi',
        noShiftsToday: 'Nessun turno oggi',
        openCalendar: 'Calendario',
        addShift: 'Aggiungi'
      },
      en: {
        widgetTitle: "Today's Shifts",
        noShiftsToday: 'No shifts today',
        openCalendar: 'Calendar',
        addShift: 'Add'
      },
      es: {
        widgetTitle: 'Turnos de hoy',
        noShiftsToday: 'No hay turnos hoy',
        openCalendar: 'Calendario',
        addShift: 'Agregar'
      },
      de: {
        widgetTitle: 'Heutige Schichten',
        noShiftsToday: 'Keine Schichten heute',
        openCalendar: 'Kalender',
        addShift: 'Hinzufügen'
      },
      fr: {
        widgetTitle: 'Équipes aujourd\'hui',
        noShiftsToday: 'Pas d\'équipe aujourd\'hui',
        openCalendar: 'Calendrier',
        addShift: 'Ajouter'
      }
    };
    
    this.shadowRoot.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[lang] && translations[lang][key]) {
        if (el.tagName === 'SPAN') {
          el.textContent = translations[lang][key];
        } else {
          const icon = el.querySelector('i');
          if (icon) {
            el.innerHTML = '';
            el.appendChild(icon);
            el.appendChild(document.createTextNode(' ' + translations[lang][key]));
          } else {
            el.textContent = translations[lang][key];
          }
        }
      }
    });
  }
  
  getMonthName(month) {
    const lang = localStorage.getItem('selectedLanguage') || 'it';
    const monthNames = {
      it: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    };
    return monthNames[lang][month];
  }
  
  getTranslation(key) {
    const lang = localStorage.getItem('selectedLanguage') || 'it';
    const translations = {
      it: {
        widgetTitle: 'Turni di oggi',
        noShiftsToday: 'Nessun turno oggi',
        openCalendar: 'Calendario',
        addShift: 'Aggiungi'
      },
      en: {
        widgetTitle: "Today's Shifts",
        noShiftsToday: 'No shifts today',
        openCalendar: 'Calendar',
        addShift: 'Add'
      },
      es: {
        widgetTitle: 'Turnos de hoy',
        noShiftsToday: 'No hay turnos hoy',
        openCalendar: 'Calendario',
        addShift: 'Agregar'
      },
      de: {
        widgetTitle: 'Heutige Schichten',
        noShiftsToday: 'Keine Schichten heute',
        openCalendar: 'Kalender',
        addShift: 'Hinzufügen'
      },
      fr: {
        widgetTitle: 'Équipes aujourd\'hui',
        noShiftsToday: 'Pas d\'équipe aujourd\'hui',
        openCalendar: 'Calendrier',
        addShift: 'Ajouter'
      }
    };
    return translations[lang][key] || key;
  }
  
  isDarkColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 150;
  }
  
  decimalToTime(decimal) {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}

customElements.define('appturni-widget', AppTurniWidget);