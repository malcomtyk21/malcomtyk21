(function() {
        const row = document.getElementById('projectsRow');
        const prev = document.querySelector('.proj-arrow.prev');
        const next = document.querySelector('.proj-arrow.next');
        if (!row || !prev || !next) return;
        const step = () => {
            const card = row.querySelector('.proj-card');
            return card ? card.offsetWidth + 20 : 320;
        };
        prev.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
        next.addEventListener('click', () => row.scrollBy({ left: step(), behavior: 'smooth' }));
        // Keyboard arrows support when focusing the section
        row.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prev.click();
            if (e.key === 'ArrowRight') next.click();
        });
    })();