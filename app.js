class AngelApp {
    constructor() {
        this.currentDate = new Date();
        this.currentCategory = 'affirmations';

        // Views
        this.landingPage = document.getElementById('landing-page');
        this.catalogPage = document.getElementById('catalog-page');
        this.appPage = document.getElementById('app-page');

        // Elements
        this.dateDisplay = document.getElementById('date-display');
        this.affirmationText = document.getElementById('affirmation-text');
        this.badge = document.getElementById('category-badge');
        this.card = document.getElementById('affirmation-card');
        this.cardContentArea = document.getElementById('card-content-area');
        this.banner = document.getElementById('category-banner');

        // Buttons
        this.btnEnter = document.getElementById('btn-enter');
        this.btnBack = document.getElementById('btn-back');
        this.btnInspire = document.getElementById('btn-inspire');
        this.prevBtn = document.getElementById('prev-day');
        this.nextBtn = document.getElementById('next-day');
        this.todayBtn = document.getElementById('go-today');

        this.categoryLabels = {
            affirmations: "Mensaje de tus Ángeles",
            invocations: "Invocación Sagrada",
            prayers: "Oración de Luz",
            meditations: "Reflexión y Meditación",
            reflections: "Pensamiento Maestro",
            frequencies: "Nivel de Vibración"
        };

        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.btnEnter.addEventListener('click', () => this.switchView('catalog'));
        this.btnBack.addEventListener('click', () => this.switchView('catalog'));

        document.querySelectorAll('.catalog-card').forEach(card => {
            card.addEventListener('click', () => {
                this.currentCategory = card.dataset.category;
                this.updateBanner(card.querySelector('.card-image').style.backgroundImage);
                this.switchView('app');
                this.updateUI();
            });
        });

        this.prevBtn.addEventListener('click', () => this.changeContent(-1));
        this.nextBtn.addEventListener('click', () => this.changeContent(1));
        this.todayBtn.addEventListener('click', () => this.resetDate());
        this.btnInspire.addEventListener('click', () => this.inspire());
    }

    updateBanner(bgImage) {
        this.banner.style.backgroundImage = bgImage;
    }

    switchView(view) {
        this.landingPage.classList.add('hidden');
        this.catalogPage.classList.add('hidden');
        this.appPage.classList.add('hidden');

        if (view === 'landing') this.landingPage.classList.remove('hidden');
        if (view === 'catalog') this.catalogPage.classList.remove('hidden');
        if (view === 'app') this.appPage.classList.remove('hidden');
    }

    changeContent(direction) {
        if (this.currentCategory === 'frequencies') return;

        if (this.currentCategory === 'affirmations') {
            this.currentDate.setDate(this.currentDate.getDate() + direction);
            this.updateUI();
        } else {
            const categoryData = data[this.currentCategory];
            const currentContent = this.affirmationText.textContent;
            let currentIdx = categoryData.indexOf(currentContent);
            if (currentIdx === -1) currentIdx = 0;

            let nextIdx = (currentIdx + direction) % categoryData.length;
            if (nextIdx < 0) nextIdx = categoryData.length + nextIdx;
            this.displayContent(nextIdx);
        }
    }

    resetDate() {
        if (this.currentCategory === 'affirmations') {
            this.currentDate = new Date();
            this.updateUI();
        }
    }

    inspire() {
        if (this.currentCategory === 'frequencies') return;
        this.animateCard();
        setTimeout(() => {
            const categoryData = data[this.currentCategory];
            const randomIdx = Math.floor(Math.random() * categoryData.length);
            this.displayContent(randomIdx);
        }, 300);
    }

    updateUI() {
        this.animateCard();
        this.badge.textContent = this.categoryLabels[this.currentCategory];

        // Reset card content area
        this.cardContentArea.innerHTML = '<p class="affirmation-text" id="affirmation-text"></p>';
        this.affirmationText = document.getElementById('affirmation-text');

        if (this.currentCategory === 'frequencies') {
            this.renderFrequencies();
        } else if (this.currentCategory === 'affirmations') {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            this.dateDisplay.textContent = this.currentDate.toLocaleDateString('es-ES', options);
            this.dateDisplay.style.display = 'block';
            this.todayBtn.style.display = 'block';
            document.querySelector('.nav-controls').style.display = 'flex';
            this.btnInspire.style.display = 'block';

            const index = this.getAffirmationIndex(this.currentDate);
            this.displayContent(index);
        } else {
            this.dateDisplay.style.display = 'none';
            this.todayBtn.style.display = 'none';
            document.querySelector('.nav-controls').style.display = 'flex';
            this.btnInspire.style.display = 'block';
            this.displayContent(0);
        }

        this.addHomeButton();
    }

    addHomeButton() {
        // Remove existing actions if any
        let actions = this.card.querySelector('.card-actions');
        if (actions) actions.remove();

        actions = document.createElement('div');
        actions.className = 'card-actions';

        const homeBtn = document.createElement('div');
        homeBtn.className = 'secondary-btn';
        homeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>
            <span>Inicio</span>
        `;
        homeBtn.addEventListener('click', () => {
            this.switchView('catalog');
        });

        actions.appendChild(homeBtn);
        this.card.appendChild(actions);
    }

    renderFrequencies() {
        this.dateDisplay.style.display = 'none';
        this.todayBtn.style.display = 'none';
        document.querySelector('.nav-controls').style.display = 'none';
        this.btnInspire.style.display = 'none';

        const menu = document.createElement('div');
        menu.className = 'frequency-list';

        data.frequencies.forEach((f, index) => {
            const btn = document.createElement('div');
            btn.className = 'frequency-menu-btn';
            btn.innerHTML = `
                <span>${f.name}</span>
                <svg class="icon" viewBox="0 0 24 24" width="20"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/></svg>
            `;
            btn.addEventListener('click', () => this.showFrequencyDetail(f));
            menu.appendChild(btn);
        });

        this.cardContentArea.innerHTML = '';
        this.cardContentArea.appendChild(menu);
    }

    showFrequencyDetail(f) {
        this.animateCard();
        this.cardContentArea.innerHTML = `
            <span class="frequency-title">${f.name}</span>
            <div class="video-container">
                <iframe 
                    src="${f.url}" 
                    title="${f.name}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            </div>
            <div class="card-actions" style="border-top: none; margin-top: 24px;">
                <div class="secondary-btn" id="btn-back-freq">
                    <svg viewBox="0 0 24 24" width="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>
                    <span>Volver</span>
                </div>
            </div>
        `;

        document.getElementById('btn-back-freq').addEventListener('click', () => {
            this.updateUI();
        });

        // Hide main actions when in detail
        const mainActions = this.card.querySelector('.card-actions:not([style*="border-top: none"])');
        if (mainActions) mainActions.style.display = 'none';
    }

    getAffirmationIndex(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return (dayOfYear - 1) % data.affirmations.length;
    }

    displayContent(index) {
        const categoryData = data[this.currentCategory];
        this.affirmationText.textContent = categoryData[index];
    }

    animateCard() {
        this.card.classList.remove('animate-in');
        void this.card.offsetWidth; // trigger reflow
        this.card.classList.add('animate-in');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AngelApp();
});
