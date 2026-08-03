<!--
  Fragment SPA chargé dynamiquement par navigation.js.
  Tous les chemins sont relatifs à la racine du site.
  Aucun <script> dans ce fragment.
-->

<section>

<header class="tp-header">

  <div class="tp-header-logo">
    <div class="logo">
      <span class="sci">Mathi</span><span class="Lab">Lab</span>
    </div>
  </div>

  <div class="tp-header-centre">

    <h1>Comparer des séries à l'aide d'indicateurs statistiques</h1>

    <div class="tp-meta">

      <div class="tp-row">
        <span class="tag">2nde</span>
        <span class="tag">Statistique et probabilités</span>
        <span class="tag">Indicateurs de position - </span><span class="tag">Indicateurs de dispersion - </span><span class="tag">Boîte à moustaches</span>
      </div>

    </div>

  </div>

  <div class="tp-header-numero">
    <span class="tp-numero-txt">S2</span>
  </div>

</header>

<div class="progress">
  <div id="bar"></div>
</div>

<main id="content">

<div class="section" data-type="objectif">

  <div class="section-titre">
    <div class="picto-section">🎯</div>
    <h2>Capacités évaluées</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <ul>
      <li>Comparer et interpréter des séries statistiques à l'aide d'indicateurs de position et de dispersion calculés avec les fonctions statistiques d'une calculatrice ou d'un tableur.</li>
      <li>Indicateurs de position : mode, classe modale, moyenne, médiane, quartiles.</li>
      <li>Indicateurs de dispersion : étendue, écart type, écart interquartile Q3 − Q1.</li>
      <li>Construire le diagramme en boîte à moustaches associé à une série statistique, avec ou sans outils numériques.</li>
      <li>Comparer et interpréter des diagrammes en boîte à moustaches.</li>
      <li><em>Domaine transversal — Co-intervention :</em> la moyenne et l'écart type calculés ici sont exactement ceux déjà utilisés dans les TP de sciences (SciLab) pour exprimer un résultat de mesure avec son incertitude ; la médiane et les quartiles en sont le prolongement mathématique.</li>
    </ul>

  </div>

</div>

<div class="section" data-type="contexte-pro">

  <div class="section-titre">
    <div class="picto-section">🏭</div>
    <h2>Contexte professionnel</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <div class="info">
      Comparer deux séries de mesures, ce n'est pas seulement comparer
      leurs moyennes : deux séries peuvent avoir la même moyenne et
      être très différentes si l'une est beaucoup plus dispersée que
      l'autre. C'est précisément ce que permettent de voir les
      quartiles et la boîte à moustaches.
    </div>

    <div class="filiere-select-bloc">
      <label for="select-filiere-pro">Votre filière professionnelle :</label>
      <select id="select-filiere-pro">
        <option value="">-- Sélectionner une filière --</option>
      </select>
    </div>

    <div id="contexte-pro-resultat" class="contexte-pro-resultat">
      <p>Sélectionner votre filière professionnelle pour afficher le contexte et la problématique associée.</p>
    </div>

  </div>

</div>

<div class="section" data-type="preparation">

  <div class="section-titre">
    <div class="picto-section">📊</div>
    <h2>Activités</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <div class="toolbar">
      <a class="btn btn-secondaire" href="../../numworks/emulator.html" target="_blank" rel="noopener">
        🧮 Ouvrir la calculatrice NumWorks
      </a>
    </div>

    <div class="tabs-container">

      <div class="tabs-header">
        <button class="tab-btn actif" data-tab="indicateurs-serie">Calculer les indicateurs d'une série</button>
        <button class="tab-btn" data-tab="comparer-series">Comparer deux séries</button>
      </div>

      <!-- ============================ -->
      <!-- INDICATEURS D'UNE SÉRIE      -->
      <!-- ============================ -->

      <div class="tab-panel actif" id="indicateurs-serie">

        <h3>Calculer les indicateurs de position et de dispersion</h3>

        <div class="info">
          Reprendre une série de mesures (temps de cycle, délai de
          livraison, cote de pièce...) et saisir chaque valeur : les
          indicateurs se calculent automatiquement, comme le ferait
          une calculatrice ou un tableur.
        </div>

        <div class="form-row">

          <div class="form-group">
            <label for="is-valeur">Valeur mesurée</label>
            <input id="is-valeur" type="number" step="0.1">
          </div>

          <div class="form-group">
            <label>&nbsp;</label>
            <button id="is-ajouter" type="button" class="btn btn-primaire">
              + Ajouter la valeur
            </button>
          </div>

        </div>

        <div class="table-responsive">
          <table class="tableau-resultats">
            <thead>
              <tr>
                <th>N°</th>
                <th>Valeur</th>
              </tr>
            </thead>
            <tbody id="is-tbody-valeurs">
            </tbody>
          </table>
        </div>

        <h4 style="margin-top:var(--gap-lg);">Indicateurs calculés</h4>

        <div class="table-responsive">
          <table class="tableau-resultats">
            <thead>
              <tr>
                <th>Indicateur</th>
                <th>Valeur</th>
              </tr>
            </thead>
            <tbody id="is-tbody-indicateurs">
              <tr><td colspan="2">Saisir au moins 4 valeurs pour afficher les indicateurs.</td></tr>
            </tbody>
          </table>
        </div>

        <h4 style="margin-top:var(--gap-lg);">Boîte à moustaches</h4>

        <div id="is-boite"></div>

        <h4 style="margin-top:var(--gap-lg);">Protocole</h4>

        <ol class="etapes">
          <li>Relever ou reprendre une série d'au moins 8 mesures.</li>
          <li>Saisir chaque valeur une à une.</li>
          <li>Lire le tableau des indicateurs : comparer moyenne et médiane, étendue et écart interquartile.</li>
          <li>Repérer sur la boîte à moustaches le minimum, le maximum, les quartiles et la médiane.</li>
        </ol>

      </div>

      <!-- ============================ -->
      <!-- COMPARER DEUX SÉRIES         -->
      <!-- ============================ -->

      <div class="tab-panel" id="comparer-series">

        <h3>Comparer deux séries à l'aide de leur boîte à moustaches</h3>

        <div class="info">
          Saisir deux séries à comparer : deux réglages de machine,
          deux transporteurs, deux équipes... Les indicateurs et les
          boîtes à moustaches des deux séries s'affichent l'une
          au-dessus de l'autre, sur la même échelle, pour permettre la
          comparaison directe.
        </div>

        <div class="tp-row" style="gap:var(--gap-lg);flex-wrap:wrap;align-items:flex-start;">

          <div style="flex:1;min-width:260px;">

            <h4>Série A</h4>

            <div class="form-group">
              <label for="cs-label-a">Nom de la série A</label>
              <input id="cs-label-a" type="text" placeholder="ex. Réglage 1" value="Série A">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cs-valeur-a">Valeur</label>
                <input id="cs-valeur-a" type="number" step="0.1">
              </div>
              <div class="form-group">
                <label>&nbsp;</label>
                <button id="cs-ajouter-a" type="button" class="btn btn-primaire">+ Ajouter</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="tableau-resultats">
                <thead><tr><th>N°</th><th>Valeur</th></tr></thead>
                <tbody id="cs-tbody-a"></tbody>
              </table>
            </div>

          </div>

          <div style="flex:1;min-width:260px;">

            <h4>Série B</h4>

            <div class="form-group">
              <label for="cs-label-b">Nom de la série B</label>
              <input id="cs-label-b" type="text" placeholder="ex. Réglage 2" value="Série B">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cs-valeur-b">Valeur</label>
                <input id="cs-valeur-b" type="number" step="0.1">
              </div>
              <div class="form-group">
                <label>&nbsp;</label>
                <button id="cs-ajouter-b" type="button" class="btn btn-primaire">+ Ajouter</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="tableau-resultats">
                <thead><tr><th>N°</th><th>Valeur</th></tr></thead>
                <tbody id="cs-tbody-b"></tbody>
              </table>
            </div>

          </div>

        </div>

        <h4 style="margin-top:var(--gap-lg);">Tableau comparatif des indicateurs</h4>

        <div class="table-responsive">
          <table class="tableau-resultats">
            <thead>
              <tr>
                <th>Indicateur</th>
                <th id="cs-th-a">Série A</th>
                <th id="cs-th-b">Série B</th>
              </tr>
            </thead>
            <tbody id="cs-tbody-comparaison">
              <tr><td colspan="3">Saisir au moins 4 valeurs dans chaque série pour afficher la comparaison.</td></tr>
            </tbody>
          </table>
        </div>

        <h4 style="margin-top:var(--gap-lg);">Boîtes à moustaches comparées</h4>

        <div id="cs-boites"></div>

        <h4 style="margin-top:var(--gap-lg);">Protocole</h4>

        <ol class="etapes">
          <li>Choisir deux situations comparables de votre filière (deux réglages, deux méthodes, deux transporteurs...).</li>
          <li>Saisir au moins 8 valeurs pour chaque série.</li>
          <li>Comparer les médianes : quelle série est centrée sur la valeur la plus favorable ?</li>
          <li>Comparer les écarts interquartiles : quelle série est la plus régulière (la moins dispersée) ?</li>
        </ol>

      </div>

    </div>

  </div>

</div>

<div class="section" data-type="resultats">

  <div class="section-titre">
    <div class="picto-section">📋</div>
    <h2>Tableau de résultats</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <div class="table-responsive">

      <table class="tableau-resultats">

        <thead>
          <tr>
            <th>Grandeur</th>
            <th>Résultat</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>Série la mieux centrée (médiane la plus favorable)</td>
            <td><input type="text" placeholder="Série A ou Série B"></td>
          </tr>

          <tr>
            <td>Série la plus régulière (écart interquartile le plus faible)</td>
            <td><input type="text" placeholder="Série A ou Série B"></td>
          </tr>

          <tr>
            <td>Décision retenue</td>
            <td><input type="text" placeholder="votre conclusion"></td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>

</div>

<div class="section" data-type="lien-metiers">

  <div class="section-titre">
    <div class="picto-section">🔗</div>
    <h2>Mathématiques et sciences : un même langage</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <p>
      En sciences (SciLab), vous avez déjà utilisé la moyenne et
      l'écart type pour exprimer un résultat de mesure avec son
      incertitude : « la grandeur mesurée vaut (moyenne ± écart type)
      ». Les indicateurs étudiés ici en prolongent l'analyse.
    </p>

    <ul style="padding-left:1.5rem;line-height:2">
      <li>La <strong>médiane</strong> et les <strong>quartiles</strong> renseignent sur la répartition d'une série sans être sensibles à une valeur exceptionnelle, contrairement à la moyenne.</li>
      <li>L'<strong>écart interquartile</strong> mesure la dispersion de la moitié centrale de la série, comme l'écart type mesure la dispersion autour de la moyenne.</li>
      <li>Dans un métier, choisir entre deux méthodes, deux réglages ou deux fournisseurs revient très souvent à comparer à la fois une position (moyenne, médiane) et une dispersion (écart type, écart interquartile) : c'est la même démarche qu'en sciences pour évaluer la fidélité d'une mesure.</li>
    </ul>

  </div>

</div>

<div class="section" data-type="puzzle">

  <div class="section-titre">
    <div class="picto-section">🧩</div>
    <h2>Activités Puzzle</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <div class="info">
      Organisation en <strong>classe puzzle</strong> : les quatre fiches
      ci-dessous portent sur la <strong>même série</strong> (l'enquête
      taille de la fiche C du TD S1). Chaque groupe expert calcule une
      catégorie d'indicateurs, puis les groupes puzzle mélangés
      reconstituent l'analyse complète de la série.
    </div>

    <div class="toolbar">
      <a class="btn btn-secondaire" href="../../roue/index.html" target="_blank" rel="noopener">
        🎡 Ouvrir la roue (tirage des groupes)
      </a>
    </div>

    <div class="info">
      Série étudiée — taille (en cm) de 20 élèves : 173, 169, 174, 179,
      169, 166, 179, 172, 166, 172, 170, 170, 175, 162, 169, 169, 162,
      175, 164, 171.
    </div>

    <div class="fiche-puzzle" data-titre="Indicateurs de position">

      <h3>Fiche A — Indicateurs de position</h3>

      <p>À l'aide de la calculatrice ou d'un tableur, déterminer pour la série ci-dessus :</p>

      <ol>
        <li>La moyenne.</li>
        <li>La médiane.</li>
        <li>Le mode (la valeur la plus fréquente).</li>
      </ol>

      <p class="info">Expliquer avec vos mots ce que représente chacun de ces trois indicateurs.</p>

      <div class="form-row">
        <div class="form-group"><label>Groupe</label><input type="text" placeholder="A, B, C..."></div>
        <div class="form-group"><label>Rôle (roue)</label><input type="text" placeholder="Rapporteur, Médiateur..."></div>
      </div>

      <div class="zone-eleve">
        <textarea rows="6" placeholder="Réponses du groupe expert : moyenne, médiane, mode, explications..."></textarea>
      </div>

    </div>

    <div class="fiche-puzzle" data-titre="Indicateurs de dispersion">

      <h3>Fiche B — Indicateurs de dispersion</h3>

      <p>À l'aide de la calculatrice ou d'un tableur, déterminer pour la même série :</p>

      <ol>
        <li>La valeur minimale, la valeur maximale et l'étendue.</li>
        <li>L'écart type.</li>
        <li>Le premier quartile Q1 et le troisième quartile Q3, puis l'écart interquartile Q3 − Q1.</li>
      </ol>

      <p class="info">Expliquer à quoi sert chacun de ces indicateurs de dispersion.</p>

      <div class="form-row">
        <div class="form-group"><label>Groupe</label><input type="text" placeholder="A, B, C..."></div>
        <div class="form-group"><label>Rôle (roue)</label><input type="text" placeholder="Rapporteur, Médiateur..."></div>
      </div>

      <div class="zone-eleve">
        <textarea rows="6" placeholder="Réponses du groupe expert : étendue, écart type, Q1, Q3, écart interquartile, explications..."></textarea>
      </div>

    </div>

    <div class="fiche-puzzle" data-titre="Boîte à moustaches">

      <h3>Fiche C — Construire la boîte à moustaches</h3>

      <p>À partir du minimum, de Q1, de la médiane, de Q3 et du maximum de la série (à demander au groupe de la fiche B si besoin, ou à recalculer), construire la boîte à moustaches de la série.</p>

      <ol>
        <li>Placer les 5 valeurs sur un axe gradué.</li>
        <li>Tracer la boîte (de Q1 à Q3) et les moustaches (du minimum à Q1, de Q3 au maximum).</li>
        <li>Que peut-on dire de la répartition des tailles à partir de cette boîte à moustaches ?</li>
      </ol>

      <div class="form-row">
        <div class="form-group"><label>Groupe</label><input type="text" placeholder="A, B, C..."></div>
        <div class="form-group"><label>Rôle (roue)</label><input type="text" placeholder="Rapporteur, Médiateur..."></div>
      </div>

      <div class="zone-eleve">
        <textarea rows="6" placeholder="Réponses du groupe expert : description de la boîte à moustaches construite, interprétation..."></textarea>
      </div>

    </div>

    <h3 style="margin-top:var(--gap-lg);">Synthèse puzzle (séance 2)</h3>

    <div class="info">
      En groupe mélangé, rassembler les résultats des trois fiches (position,
      dispersion, boîte à moustaches) pour rédiger une analyse complète de
      la série des tailles.
    </div>

    <div class="zone-eleve">
      <textarea id="puzzle-synthese" rows="6" placeholder="Synthèse commune : indicateurs de position, de dispersion, et lecture de la boîte à moustaches..."></textarea>
    </div>

  </div>

</div>

<div class="section" data-type="bilan">

  <div class="section-titre">
    <div class="picto-section">📝</div>
    <h2>Trace écrite - Compte rendu</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <h3>Identification</h3>

    <div class="form-row">

      <div class="form-group">
        <label for="nom-eleve">Nom</label>
        <input id="nom-eleve" type="text" placeholder="Nom">
      </div>

      <div class="form-group">
        <label for="prenom-eleve">Prénom</label>
        <input id="prenom-eleve" type="text" placeholder="Prénom">
      </div>

      <div class="form-group">
        <label for="classe-eleve">Classe</label>
        <input id="classe-eleve" type="text" placeholder="Classe">
      </div>

      <div class="form-group">
        <label for="date-eleve">Date</label>
        <input id="date-eleve" type="date">
      </div>

    </div>

    <h3 style="margin-top:var(--gap-md);">Résumé du TD</h3>

    <div class="zone-eleve">
      <textarea id="resume-tp" rows="6" placeholder="Résumer les indicateurs calculés et la comparaison des deux séries..."></textarea>
    </div>

    <h3 style="margin-top:var(--gap-md);">Questions</h3>

    <div class="questions-bloc" data-tp="comparer-series-statistiques">

    <ol class="questions-tp">

      <li>
        <div class="question-entete">
          <strong>
            Donner la définition de la médiane et des quartiles Q1 et Q3 d'une série statistique.
          </strong>
          <span class="cartouche" data-comp="APP">APP</span>
        </div>
        <div class="zone-eleve">
          <textarea id="question1" rows="4" placeholder="Votre réponse..."></textarea>
        </div>
      </li>

      <li>
        <div class="question-entete">
          <strong>
            Calculer et comparer l'écart type et l'écart interquartile des deux séries étudiées.
          </strong>
          <span class="cartouche" data-comp="REA">REA</span>
        </div>
        <div class="zone-eleve">
          <textarea id="question2" rows="4" placeholder="Votre réponse..."></textarea>
        </div>
      </li>

      <li>
        <div class="question-entete">
          <strong>
            À partir des deux boîtes à moustaches, expliquer quelle série est la plus régulière et laquelle est la mieux centrée.
          </strong>
          <span class="cartouche" data-comp="ANA">ANA</span>
        </div>
        <div class="zone-eleve">
          <textarea id="question3" rows="5" placeholder="Votre analyse..."></textarea>
        </div>
      </li>

      <li class="question-problematique">
        <div class="question-entete">
          <strong>Répondre à la problématique posée en début de TD :</strong>
          <span class="cartouche" data-comp="VAL">VAL</span>
        </div>
        <p class="problematique-rappel" data-activite="comparer-series-statistiques"></p>
        <div class="zone-eleve">
          <textarea id="question4" rows="5" placeholder="Répondre à la problématique en vous appuyant sur vos résultats..."></textarea>
        </div>
      </li>

    </ol>

    </div>

  </div>

</div>

<div class="section" data-type="auto-evaluation">

  <div class="section-titre">
    <div class="picto-section">📡</div>
    <h2>Auto-évaluation des compétences</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <p class="info">
      À la fin du TD, évaluez votre niveau de maîtrise pour chaque
      compétence.
    </p>

    <div class="table-responsive">

      <table class="tableau-resultats autoeval-table">

        <thead>
          <tr>
            <th>Domaine</th>
            <th>Sigle</th>
            <th>Je suis capable de...</th>
            <th>0</th>
            <th>1</th>
            <th>2</th>
          </tr>
        </thead>

        <tbody>

          <tr data-comp="APP">
            <td>S'approprier</td>
            <td>APP</td>
            <td>Identifier les indicateurs de position et de dispersion d'une série.</td>
            <td><input type="radio" name="APP" value="0"></td>
            <td><input type="radio" name="APP" value="1"></td>
            <td><input type="radio" name="APP" value="2"></td>
          </tr>

          <tr data-comp="REA">
            <td>Réaliser</td>
            <td>REA</td>
            <td>Calculer médiane, quartiles, écart interquartile et écart type d'une série.</td>
            <td><input type="radio" name="REA" value="0"></td>
            <td><input type="radio" name="REA" value="1"></td>
            <td><input type="radio" name="REA" value="2"></td>
          </tr>

          <tr data-comp="ANA">
            <td>Analyser / Raisonner</td>
            <td>ANA</td>
            <td>Construire et interpréter une boîte à moustaches.</td>
            <td><input type="radio" name="ANA" value="0"></td>
            <td><input type="radio" name="ANA" value="1"></td>
            <td><input type="radio" name="ANA" value="2"></td>
          </tr>

          <tr data-comp="VAL">
            <td>Valider</td>
            <td>VAL</td>
            <td>Comparer deux séries statistiques et justifier un choix.</td>
            <td><input type="radio" name="VAL" value="0"></td>
            <td><input type="radio" name="VAL" value="1"></td>
            <td><input type="radio" name="VAL" value="2"></td>
          </tr>

          <tr data-comp="COM">
            <td>Communiquer</td>
            <td>COM</td>
            <td>Argumenter une comparaison de séries à l'oral ou à l'écrit.</td>
            <td><input type="radio" name="COM" value="0"></td>
            <td><input type="radio" name="COM" value="1"></td>
            <td><input type="radio" name="COM" value="2"></td>
          </tr>

        </tbody>

      </table>

    </div>

    <div class="radar-actions" style="margin-top:var(--gap-lg);">
      <button id="btn-radar" class="btn btn-primaire">
        📊 Générer mon radar de compétences
      </button>
      <div id="radar-resultat" style="margin-top:var(--gap-md);"></div>
    </div>

  </div>

</div>

<div class="section" data-type="impression_tp">

  <div class="section-titre">
    <div class="picto-section">📒</div>
    <h2>Impression du compte-rendu</h2>
    <span class="chevron">▼</span>
  </div>

  <div class="section-corps">

    <p class="info">
      À la fin du TD, imprimer votre travail en PDF.
      Envoyer à l'enseignant votre compte rendu en pièce jointe par la messagerie de l'ENT.
    </p>

    <div class="toolbar">
      <button id="btn-imprimer" class="btn btn-primaire">
        🖨 Imprimer le compte-rendu
      </button>
    </div>

    <div class="info" style="margin-top:var(--gap-md);">
      L'impression récupère automatiquement :
      <ul>
        <li>le tableau de résultats ;</li>
        <li>les réponses aux questions ;</li>
        <li>l'auto-évaluation des compétences.</li>
      </ul>
    </div>

  </div>

</div>

<div class="nav-tp">

  <button class="btn btn-secondaire" onclick="loadTP('tp01-organiser-une-serie-statistique')">
    ← S1
  </button>

  <button class="btn btn-secondaire" onclick="location.href='../index.html'">
    🏠 Accueil
  </button>

  <button class="btn btn-primaire" onclick="loadTP('tp03-fluctuation-frequence-probabilites')">
    S3 →
  </button>

</div>

</main>

<div id="cr-print-container" style="display:none;"></div>

</section>
