document.addEventListener('DOMContentLoaded', () => {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const enterSiteBtn = document.getElementById('enter-site-btn');

    if (localStorage.getItem('mmiDashboardVisited')) {
        welcomeOverlay.style.display = 'none';
    } else {
        enterSiteBtn.addEventListener('click', () => {
            localStorage.setItem('mmiDashboardVisited', 'true');
            welcomeOverlay.classList.add('fade-out');
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
            }, 500);
        });
    }

    const projects = [
        { id: 'art_mood',       category: 'Art',                      icon: '🎨', date: '2025-10-24',                  title: 'Moodboard à finir' }, 
        { id: 'sae105',         category: 'HTML / Intégration Web',   icon: '💻🇬🇧', date: '2025-11-02', time: '23:59', title: 'SAE à rendre (CV)' },
        { id: 'html_ds',        category: 'HTML / Intégration Web',   icon: '✍️', date: '2025-11-03',                  title: 'DS sur l\'intégration web' },
        { id: 'english_ds',     category: 'Anglais',                  icon: '🇬🇧', date: '2025-11-03',                  title: 'Contrôle en anglais' },
        { id: 'gp_pub',         category: 'Gestion de projet',        icon: '📊', date: '2025-11-09',                  title: 'Projet de pub' },
        { id: 'ppp_group',      category: 'P.P.P',                    icon: '📂', date: '2025-11-11',                  title: 'Rendu du travail de groupe' },
        { id: 'ppp_pres',       category: 'P.P.P',                    icon: '🎤', date: '2025-11-13',                  title: 'Présentation du projet' },
        { id: 'mkt_company',    category: 'Marketing',                icon: '📈', date: '2025-11-17',                  title: 'Projet d’entreprise à rendre' },
        { id: 'pinoza_oral',    category: 'Culture artistique',       icon: '🎨', date: 'unknown',                     title: 'Présenter une oeuvre choisie pendant la sortie du 21 novembre' },
        { id: 'clech_vecteurs', category: 'Photoshop',                icon: '✒️', date: '2025-11-28',                  title: 'Faire une feuille à plusieurs branches' },
        { id: 'reyss_analyse',  category: 'Recommandation numérique', icon: '🗣️', date: '2025-11-27',                  title: 'Présentation avec Mme. REYSS' },
        { id: 'fournerie_ds',   category: 'Hébergement',              icon: '💻', date: 'unknown',                     title: 'DS Fournerie (décembre)' },
        { id: 'comm_ds',        category: 'Communication',            icon: '🗣️', date: 'unknown',                     title: 'DS Communication (début décembre)' },
        { id: 'ppp_interview',  category: 'P.P.P',                    icon: '💼', date: '2026-01-11',                  title: 'Interview d’un professionnel' },
        { id: 'ppp_oral',       category: 'P.P.P',                    icon: '🎤', date: '2025-11-13',                  title: 'Oral de PPP (après-midi)' }
    ];

    const projectList = document.getElementById('project-list');
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const futureProjects = projects
        .filter(project => project.date == 'unknown' || new Date(project.date) >= today)
        .sort((a, b) => [a.date, b.date].includes('unknown') ? 999999999999 : new Date(a.date) - new Date(b.date));

    if (futureProjects.length > 0) {
        futureProjects.forEach((project, index) => {
            const card = createProjectCard(project);
            card.style.animationDelay = `${index * 100}ms`;
            projectList.appendChild(card);
        });
    } else {
        projectList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucun projet à venir pour le moment.</p>';
    }

    const modal = document.getElementById('choice-modal');
    let activeProject = null;

    function openReminderChoice(project) {
        activeProject = project; 
        const modalContent = modal.querySelector('.modal-content');
        if(modalContent) { 
            modal.classList.remove('hidden');
        } else {
            console.error("Le contenu de la modale (.modal-content) est manquant.");
        }
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        const formattedDate = project.date == 'unknown' ? "Date inconnue" : new Date(project.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        card.innerHTML = `<div class="card-header"><span class="icon">${project.icon}</span><h2>${project.category}</h2></div><span class="date">${formattedDate} ${project.time ? `à ${project.time}` : ''}</span><h3>${project.title}</h3><div id="countdown-${project.id}" class="countdown-timer">Calcul...</div><div class="card-actions"><a id="gemini-${project.id}" href="https://gemini.google.com/" target="_blank" class="gemini-help-btn" style="display: none;">✨ S'aider de Gemini</a><button class="reminder-btn">Créer un rappel</button></div>`;
        
        card.querySelector('.reminder-btn').addEventListener('click', () => openReminderChoice(project));
        
        return card;
    }

    function updateAllCountdowns() {
        const fortyEightHoursInSeconds = 48 * 60 * 60;
        futureProjects.forEach(project => {
            if (project.date === 'unknown') {
                const countdownElement = document.getElementById(`countdown-${project.id}`);
                if (countdownElement) {
                    countdownElement.innerHTML = 'Date inconnue';
                    countdownElement.className = 'countdown-timer countdown-over';
                    countdownElement.classList.remove('pulsing');
                }
                return;
            }

            const countdownElement = document.getElementById(`countdown-${project.id}`);
            const geminiButton = document.getElementById(`gemini-${project.id}`);
            if (!countdownElement || !geminiButton) return;

            let deadlineString = project.date + (project.time ? `T${project.time}:00` : `T23:59:59`);
            const deadline = new Date(deadlineString);
            const totalSeconds = (deadline - new Date()) / 1000;

            geminiButton.style.display = (totalSeconds > 0 && totalSeconds < fortyEightHoursInSeconds) ? 'inline-flex' : 'none';

            if (totalSeconds < 0) { 
                 countdownElement.innerHTML = 'Échéance dépassée';
                 countdownElement.className = 'countdown-timer countdown-over';
                 countdownElement.classList.remove('pulsing');
                 return;
            }

            const days = Math.floor(totalSeconds / 3600 / 24);
            const hours = Math.floor(totalSeconds / 3600) % 24;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            countdownElement.innerHTML = days > 0 ? `Temps restant : ${days}j ${hours}h ${minutes}m` : `Temps restant : ${hours}h ${minutes}m ${Math.floor(totalSeconds) % 60}s`;
            countdownElement.classList.toggle('pulsing', days < 3 && totalSeconds > 0); 
            
            if (days < 3 && totalSeconds > 0) countdownElement.className = 'countdown-timer countdown-red pulsing';
            else if (days < 7) countdownElement.className = 'countdown-timer countdown-orange';
            else countdownElement.className = 'countdown-timer countdown-green';
        });
    }
    setInterval(updateAllCountdowns, 1000);
    updateAllCountdowns();

    // --- SECTION NAVIGATION MODIFIÉE ET CORRIGÉE ---
    
    // Sélection des éléments de navigation et des pages
    const navProjects = document.getElementById('nav-projects');
    const navHomework = document.getElementById('nav-homework');
    const navGemini = document.getElementById('nav-gemini'); 
    
    // projectList est déjà déclaré plus haut
    const homeworkPage = document.getElementById('homework-page');
    const geminiPage = document.getElementById('gemini-page'); 
    
    const navIndicator = document.getElementById('nav-indicator');

    // Fonction pour mettre à jour l'indicateur
    function updateNavIndicator(activeTab) {
        if (!activeTab) return; 
        navIndicator.style.width = `${activeTab.offsetWidth}px`;
        navIndicator.style.left = `${activeTab.offsetLeft}px`;
    }

    // Clic sur "Projets Notés"
    navProjects.addEventListener('click', (e) => { 
        e.preventDefault(); 
        projectList.classList.remove('hidden'); 
        homeworkPage.classList.add('hidden'); 
        geminiPage.classList.add('hidden');
        
        navProjects.classList.add('active'); 
        navHomework.classList.remove('active'); 
        navGemini.classList.remove('active');
        
        updateNavIndicator(navProjects);
    });

    // Clic sur "Devoirs à venir"
    navHomework.addEventListener('click', (e) => { 
        e.preventDefault(); 
        homeworkPage.classList.remove('hidden'); 
        projectList.classList.add('hidden'); 
        geminiPage.classList.add('hidden');
        
        navHomework.classList.add('active'); 
        navProjects.classList.remove('active'); 
        navGemini.classList.remove('active');

        updateNavIndicator(navHomework);
    });
    
    // Clic sur "Offre Gemini"
    navGemini.addEventListener('click', (e) => { 
        e.preventDefault(); 
        geminiPage.classList.remove('hidden'); 
        projectList.classList.add('hidden'); 
        homeworkPage.classList.add('hidden'); 
        
        navGemini.classList.add('active'); 
        navProjects.classList.remove('active'); 
        navHomework.classList.remove('active'); 
        
        updateNavIndicator(navGemini);
    });
    
    // Met à jour l'indicateur au chargement initial
    updateNavIndicator(document.querySelector('nav a.active')); 
    // --- FIN SECTION NAVIGATION MODIFIÉE ---
    
    const closeModal = () => { modal.classList.add('hidden'); activeProject = null; };
    document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.getElementById('google-calendar-btn')?.addEventListener('click', () => { if (!activeProject) return; const startTime = new Date(activeProject.date).toISOString().replace(/-|:|\.\d\d\d/g, ""); let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Rendu: ' + activeProject.title)}&dates=${startTime}/${startTime}&details=${encodeURIComponent(activeProject.details || '')}`; window.open(url, '_blank'); closeModal(); });
    document.getElementById('apple-reminder-btn')?.addEventListener('click', () => { if (!activeProject) return; createICSFile(activeProject); closeModal(); });
    function createICSFile(project) { const date = new Date(project.date); if (project.time) { const [h, m] = project.time.split(':'); date.setUTCHours(h, m, 0); } else { date.setUTCHours(9, 0, 0); } const icsDate = date.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, -1); const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VTODO', `UID:${Date.now()}@mmi.fr`, `SUMMARY:${project.title}`, `DTSTAMP:${icsDate}Z`, `DUE;VALUE=DATE-TIME:${icsDate}Z`, `DESCRIPTION:${(project.details || '').replace(/\n/g, '\\n')}`, 'STATUS:NEEDS-ACTION', 'END:VTODO', 'END:VCALENDÁR'].join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })); link.download = `rappel_${project.title.replace(/ /g, "_")}.ics`; document.body.appendChild(link); link.click(); document.body.removeChild(link); }
});