        // Variable pour suivre l'état d'affichage
        let isSingleColumn = true;

        // Fonction pour charger du contenu dans une frame
        function loadInFrame(url, sectionIndex) {
            event.preventDefault();
            const container = document.getElementById('content-container');

            // Si on est en mode 3 colonnes, on conserve les 3 iframes
            if (!isSingleColumn && container.children.length === 1) {
                container.innerHTML = `
                    <div class="content-section">
                        <iframe class="content-frame" src="about:blank"></iframe>
                    </div>
                    <div class="content-section">
                        <iframe class="content-frame" src="about:blank"></iframe>
                    </div>
                    <div class="content-section">
                        <iframe class="content-frame" src="about:blank"></iframe>
                    </div>
                `;
            }

            const frames = document.getElementsByClassName('content-frame');

            // Si c'est une image, on l'affiche directement dans un élément img
            if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) {
                const parent = frames[sectionIndex].parentElement;
                parent.innerHTML = '<img src="' + url + '" style="width: 100%; height: 100%; object-fit: contain;">';
            } else {
                frames[sectionIndex].src = url;
            }
        }

        // Fonction pour basculer entre une et trois colonnes
        function toggleLayout() {
            const container = document.getElementById('content-container');
            isSingleColumn = !isSingleColumn;

            if (isSingleColumn) {
                container.innerHTML = `
                    <div class="content-section">
                        <iframe class="content-frame" src="about:blank"></iframe>
                    </div>
                `;
                container.classList.add('single-column');
            } else {
                container.innerHTML = `
                    <div class="content-section">
                        <iframe class="content-frame" src="about:blank"></iframe>
                    </div>
                    <div class="content-section">
                        <iframe class="content-frame" src="about:blank"></iframe>
                    </div>
                    <div class="content-section">
                        <iframe class="content-frame" src="about:blank"></iframe>
                    </div>
                `;
                container.classList.remove('single-column');
            }
        }
