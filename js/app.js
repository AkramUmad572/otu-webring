// OTU Webring - Main Application
// Using Fuse.js for fuzzy search (inspired by SE-Webring)

let fuse;

// Initialize Fuse.js for fuzzy search
function initFuseSearch() {
    const options = {
        keys: [
            { name: 'name', weight: 0.5 },
            { name: 'year', weight: 0.2 },
            { name: 'website', weight: 0.1 },
            { name: 'internships.company', weight: 0.2 }
        ],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true
    };
    fuse = new Fuse(allSites, options);
}

// Calculate stats
function updateStats() {
    const memberCount = document.getElementById('memberCount');
    const companyCount = document.getElementById('companyCount');

    // Count unique companies
    const companies = new Set();
    allSites.forEach(site => {
        if (site.internships) {
            site.internships.forEach(internship => {
                companies.add(internship.company);
            });
        }
    });

    // Animate count up
    animateCount(memberCount, allSites.length);
    animateCount(companyCount, companies.size);
}

// Animate number counting
function animateCount(element, target) {
    const duration = 1000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Create site card HTML
function createSiteCard(site, index) {
    const card = document.createElement('article');
    card.className = 'site-card';
    card.style.animationDelay = `${0.4 + index * 0.08}s`;

    const websiteText = site.website.replace(/^https?:\/\//, '').replace(/\/$/, '');

    let internshipsHTML = '';
    if (site.internships && site.internships.length > 0) {
        internshipsHTML = `
            <div class="site-internships">
                ${site.internships.map(internship => `
                    <span class="internship-tag">
                        <span class="internship-dot"></span>
                        ${internship.company}
                    </span>
                `).join('')}
            </div>
        `;
    }

    card.innerHTML = `
        <div class="site-card-header">
            <h3 class="site-name">${site.name}</h3>
            <span class="site-year">${site.year}</span>
        </div>
        <a href="${site.website}" target="_blank" rel="noopener noreferrer" class="site-link">
            ${websiteText}
            <svg class="site-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
        </a>
        ${internshipsHTML}
    `;

    // Click on card (not link) opens website
    card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && !e.target.closest('a')) {
            window.open(site.website, '_blank', 'noopener,noreferrer');
        }
    });

    return card;
}

// Display sites
function displaySites(sites) {
    const sitesList = document.getElementById('sitesList');
    sitesList.innerHTML = '';

    if (sites.length === 0) {
        sitesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">:/</div>
                <p class="empty-state-text">No members found matching your search</p>
            </div>
        `;
        return;
    }

    sites.forEach((site, index) => {
        const card = createSiteCard(site, index);
        sitesList.appendChild(card);
    });
}

// Filter sites based on search input
function filterSites() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        displaySites(allSites);
        return;
    }

    const results = fuse.search(searchTerm);
    const filteredSites = results.map(result => result.item);
    displaySites(filteredSites);
}

// Webring navigation
function setupWebringNavigation() {
    const footerLinks = document.querySelectorAll('.footer-link');

    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.textContent.toLowerCase();

            // Get current site from URL or default to index
            let currentIndex = 0;

            if (action === 'random') {
                currentIndex = Math.floor(Math.random() * allSites.length);
            } else if (action === 'previous') {
                currentIndex = (currentIndex - 1 + allSites.length) % allSites.length;
            } else if (action === 'next') {
                currentIndex = (currentIndex + 1) % allSites.length;
            }

            const site = allSites[currentIndex];
            if (site) {
                window.open(site.website, '_blank', 'noopener,noreferrer');
            }
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    // Initialize fuzzy search
    initFuseSearch();

    // Display all sites on load
    displaySites(allSites);

    // Update stats
    updateStats();

    // Setup webring navigation
    setupWebringNavigation();

    // Add event listener for search with debounce
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterSites, 150);
    });

    // Add keyboard shortcut (Cmd/Ctrl + K) to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }

        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            filterSites();
            searchInput.blur();
        }
    });
});
