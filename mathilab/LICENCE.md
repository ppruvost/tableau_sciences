# Licence d’utilisation – Code source GPL v3 & Contenus pédagogiques CC BY-NC-SA 4.0

Le présent projet est protégé par le **droit d’auteur** en vigueur dans l’Union européenne et en droit français.
Il est composé de deux ensembles distincts :

* **Code source** (application, interface, logique logicielle) sous licence GNU GPL v3 ;
* **Contenus pédagogiques** (supports, ressources, explications, activités) sous licence CC BY-NC-SA 4.0.

Les licences accordées constituent des autorisations d’usage et ne limitent pas les droits moraux de l’auteur, notamment le droit de paternité et le respect de l’intégrité de l’œuvre.

Le projet comporte par ailleurs un traitement limité de **données personnelles** (voir les sections 5 et 6), qui ne relève pas de ces licences mais du **Règlement général sur la protection des données (RGPD)** et de la loi « Informatique et Libertés ».

---

## 1. Auteur du projet

**P. Pruvost**
Lycée Jean Mermoz, Vire
Académie de Normandie

---

## 2. Inspirations conceptuelles et pédagogiques

### Interface et navigation (barre latérale)

Inspiration ergonomique issue de projets pédagogiques publiés sur la Forge des Apps Éducation, notamment le travail de **Thibault Giauffret** (projet tableau de bord).

### Visualisation du bruit (Noise / SoundEar®)

Approche pédagogique issue des dispositifs de régulation sonore en classe, inventé au début des années **2000**, notamment **SoundEar®** et les systèmes de « bruit visible » permettant un retour visuel immédiat du niveau sonore.

### Visualisation du temps (Time Timer®)

Concept pédagogique inventé par **Jan Rogers** (1994), fondé sur la représentation visuelle de l’écoulement du temps pour faciliter la gestion temporelle.

### Classe puzzle (Jigsaw Classroom)

Méthode d’apprentissage coopératif développée par **Elliot Aronson** (1971), basée sur l’interdépendance des élèves et la construction collective des connaissances.

### Modélisation des molécules 3D

Visualisation scientifique basée sur les données de **PubChem**, base de données chimique maintenue par le National Center for Biotechnology Information (NCBI), relevant des National Institutes of Health (NIH).

### Évaluation interactive (PlayMaths ARCADE)

Le module d’évaluation interactive (**PlayMaths ARCADE**) s’inspire des principes généraux des outils de quiz pédagogiques de type **Kahoot!**, notamment dans l’objectif de proposer une évaluation formative, dynamique et engageante.

Cette inspiration porte uniquement sur le format pédagogique de questionnement interactif et de feedback immédiat, sans reprise de code source et sans reproduction de l’interface.

L’approche retenue privilégie la progression de l’élève, le droit à l’erreur et la répétition des activités. Les scores et classements ont une finalité ludique. Les notes sur 10 obtenues aux quiz peuvent être moyennées par l’enseignant (moyenne des tentatives d’un même quiz) pour établir une note **formative** ; elles ne constituent pas un dispositif d’évaluation certificative.

### Typographie et lisibilité (Atkinson Hyperlegible)

Le style d’écriture des interfaces et des documents du projet est basé sur la police **Atkinson Hyperlegible**, conçue par le **Braille Institute** pour améliorer la lisibilité des textes, afin de **faciliter la lecture** par tous les élèves. Cette police est distribuée sous licence **SIL Open Font License 1.1** et reste soumise à ses conditions d’utilisation. Elle est hébergée localement (aucun appel à un service de polices externe) dans les applications Laboratory et MathiLab.

### Grille d’évaluation des compétences

La grille d’évaluation des compétences utilisée dans ce projet s’appuie sur le **référentiel de mathématiques et de sciences** applicable en **baccalauréat professionnel**, ainsi que sur les pratiques d’évaluation par compétences mises en œuvre dans l’**Académie de Normandie**. Elle s’inscrit dans une démarche d’évaluation formative et progressive des acquis des élèves.

---

## 3. Crédits photos, pictogrammes et contenus visuels

Sauf mention contraire, l’ensemble des photographies, captures d’écran, illustrations, schémas et éléments visuels intégrés dans ce projet sont la propriété de Patrick Pruvost et ont été réalisés dans le cadre de ses activités pédagogiques.

Les pictogrammes de sécurité utilisés dans ce projet proviennent de l’INRS (Institut National de Recherche et de Sécurité) https://www.inrs.fr/media.html?refINRS=outil10 et sont reproduits dans un objectif d’information, de prévention et de pédagogie, conformément à leur usage destiné à la sensibilisation aux risques professionnels.

Ces pictogrammes restent la propriété de leurs auteurs et de l’INRS. Leur utilisation respecte les conditions applicables aux ressources mises à disposition par cet organisme.

Les autres éléments visuels originaux (photographies, schémas, captures et illustrations spécifiques) sont protégés par le **droit d’auteur** en vigueur en droit français et européen.

Leur utilisation, reproduction ou diffusion est autorisée uniquement dans le cadre défini par les licences associées au projet (GPL v3 pour le code source et CC BY-NC-SA 4.0 pour les contenus pédagogiques), sauf indication contraire explicite.

Toute réutilisation en dehors de ce cadre nécessite l’autorisation préalable de l’auteur, conformément au Code de la propriété intellectuelle et aux dispositions européennes relatives au droit d’auteur.

Les images, pictogrammes ou illustrations issus de sources externes restent la propriété de leurs auteurs respectifs et sont utilisés dans le respect des licences, droits d’usage ou autorisations applicables.

---

## 4. Outils externes utilisés ou intégrés

* [https://www.l-educdenormandie.fr/](https://www.l-educdenormandie.fr/)
  Ressources institutionnelles et environnement éducatif de l'académie de Normandie.

* [https://app.diagrams.net/](https://app.diagrams.net/)
  Outil de création de diagrammes et schémas.

* **Pyodide** – environnement d’exécution Python dans le navigateur (WebAssembly), avec NumPy et Matplotlib. C’est le seul moteur Python utilisé dans le projet.

* **Atkinson Hyperlegible** – police de caractères du Braille Institute (licence SIL Open Font License 1.1), utilisée pour faciliter la lecture.

* **NumWorks** – calculatrice graphique et environnement pédagogique associé.

* **GeoGebra** – logiciel de mathématiques dynamiques (géométrie, algèbre, analyse).

* **PubChem** – base de données chimique pour structures moléculaires 3D.

* **[Codeberg](https://codeberg.org)** – hébergement du code source et du dépôt du projet.

* **[Supabase](https://supabase.com)** – base de données utilisée pour les seules fonctionnalités qui enregistrent des résultats ou un historique (voir section 5).

Les noms, marques, logos et services externes cités dans ce projet restent la propriété de leurs titulaires respectifs. Leur mention a une finalité informative, pédagogique ou technique et ne constitue ni une affiliation, ni un partenariat, ni une approbation du projet par ces organisations.

---

## 5. Données personnelles, hébergement et Supabase

### 5.1. Principe : sobriété et minimisation

La grande majorité des activités de Mermoz Lab (SciLab, MathiLab, PlayLab) **fonctionne sans compte, sans identification et sans enregistrement de données** : les calculs, simulations, exercices et corrections s’exécutent dans le navigateur de l’élève.

Seules certaines fonctionnalités nécessitent un enregistrement de données sur un serveur. Les données collectées sont limitées à ce qui est strictement nécessaire à la finalité pédagogique. Le projet ne prévoit **ni publicité, ni profilage commercial, ni revente de données, ni transmission à des fins commerciales**.

### 5.2. Fonctionnalités concernées et données traitées

| Fonctionnalité | Finalité | Données concernées |
|---|---|---|
| **Historique élève (MLDS Maths)** | Permettre à l’élève de retrouver son parcours et ses résultats d’une séance à l’autre | Nom, prénom et date de naissance servant de clé d’accès, calculés dans le navigateur et **jamais transmis ni conservés en clair** : seule une **empreinte cryptographique** (PBKDF2) est enregistrée (donnée pseudonymisée, qui reste une donnée personnelle) ; classe (facultative) ; résultats, scores et progression dans les ateliers ; dates de création et de dernière utilisation |
| **Quiz PlayMaths ARCADE** | Gérer l’accès aux quiz, suivre les résultats des élèves et établir une note formative (moyenne des notes d’un même quiz) | **Nom et prénom saisis par l’élève (enregistrés en clair)** ; quiz et catégorie ; identifiant d’appareil ; dates de début et de fin ; score, total, notes sur 10 et sur 20, points PlayMaths ; statut |
| **Scores et tentatives (PlayLab)** | Motivation ludique, classement et suivi des activités | Prénom saisi par l’élève ; score, activité et date |
| **Jeu Memory (PlayLab)** | Jeu collectif en classe | Pseudonyme saisi par l’élève ; réponses, score, temps de réponse et dates |

Aucune donnée dite « sensible » au sens de l’article 9 du RGPD (santé, origine, opinions, etc.) n’est demandée par les applications. Les élèves ne doivent pas en saisir dans les champs libres.

### 5.3. Hébergement et sous-traitant : Supabase

Les données mentionnées en 5.2 sont stockées dans une base de données fournie par **Supabase**, qui agit en qualité de **sous-traitant** au sens de l’article 28 du RGPD.

* Projet Supabase utilisé : « Playmaths-arcade ».
* Région d’hébergement : **Irlande (région « eu-west-1 »), Union européenne**.
* Pour l’**historique MLDS**, l’accès aux données par l’application se fait uniquement au moyen de **fonctions dédiées (RPC)** : les tables ne sont pas accessibles directement depuis le navigateur.
* Pour les **quiz** (sessions, scores et classement), l’accès se fait également par des **fonctions dédiées** : le classement public ne renvoie que le **prénom**, le score et la date, jamais le nom de famille. La consultation des résultats détaillés (nom, prénom, notes) est réservée à l’enseignant et protégée par un **code d’accès**.
* Pour le jeu **Memory** (pseudonymes seulement), l’application utilise la clé publique du projet, encadrée par des règles d’accès au niveau des lignes (RLS).
* **Courriels de résultats :** à la fin d’un quiz, un courriel récapitulatif (nom, prénom, quiz, score, total et détail des réponses) est envoyé par une fonction Supabase via le service **Resend**, qui agit également en qualité de sous-traitant et peut être établi hors de l’Union européenne.
* Supabase est une société établie hors de l’Union européenne. Lorsque des données sont susceptibles d’être transférées hors de l’UE, ce transfert est encadré par les garanties prévues par le RGPD (notamment les clauses contractuelles types prévues dans l’accord de traitement des données proposé par Supabase).

Le code source est hébergé sur **Codeberg** (association à but non lucratif, Allemagne). Aucune donnée d’élève n’y est enregistrée.

### 5.4. Durée de conservation : effacement après un an

Les données personnelles enregistrées sont **conservées au maximum un (1) an à compter de leur enregistrement**, puis **supprimées définitivement** (historiques, résultats, notes, scores, tentatives, réponses aux jeux et empreintes d’accès). Cet effacement est **automatique** : une tâche planifiée s’exécute chaque nuit sur l’ensemble des tables concernées (historique MLDS, quiz, scores, tentatives et jeu Memory).

L’effacement peut intervenir plus tôt, sur simple demande (voir 5.6) ou à la fin de l’année scolaire si l’activité concernée n’est plus utilisée.

Les sauvegardes techniques éventuellement effectuées par l’hébergeur sont supprimées selon leur propre cycle de rotation, sans réutilisation des données.

### 5.5. Responsable du traitement, base légale et destinataires

* **Responsable du traitement :** P. Pruvost, Pôle Sciences, Lycée Jean Mermoz, 1 rue Georges Fauvel, 14500 Vire (Académie de Normandie), dans le cadre de sa mission d’enseignement.
* **Base légale :** mission d’intérêt public d’enseignement (article 6.1.e du RGPD) pour les usages pédagogiques réalisés en classe.
* **Destinataires :** l’enseignant responsable du projet et l’élève concerné (pour son propre historique). Les données ne sont pas communiquées à des tiers, à l’exception du sous-traitant d’hébergement mentionné en 5.3.
* **Élèves mineurs :** une grande partie des élèves concernés sont mineurs. Les informations relatives à ces traitements sont portées à la connaissance des élèves et, pour les mineurs, de leurs représentants légaux, notamment par l’intermédiaire de l’établissement.

### 5.6. Droits des personnes

Toute personne concernée (ou son représentant légal) peut exercer, à tout moment, ses droits d’**accès**, de **rectification**, d’**effacement**, de **limitation** et d’**opposition**, ainsi que son droit à la **portabilité** lorsque celui-ci s’applique.

Contact pour exercer ces droits : **Pôle Sciences – M. Pruvost – 1 rue Georges Fauvel, 14500 Vire**.

L’élève peut aussi s’adresser au **délégué à la protection des données (DPD)** compétent pour son établissement, via le lycée.

En cas de difficulté, une réclamation peut être adressée à la **CNIL** : [https://www.cnil.fr/fr/plaintes](https://www.cnil.fr/fr/plaintes).

### 5.7. Sécurité

Pour l’historique MLDS, les identifiants d’accès ne sont pas stockés en clair (empreinte cryptographique), les tables ne sont pas exposées directement et la session de l’élève n’est conservée que le temps de l’utilisation du navigateur. Pour les quiz, le nom et le prénom saisis sont enregistrés en clair, mais ils ne sont lisibles que par l’enseignant, au moyen d’un code d’accès. Aucune mesure ne garantissant une sécurité absolue, l’élève est invité à ne saisir aucune information inutile.

**Stockage dans le navigateur :** pour limiter les passages répétés (verrou de 10 heures par élève, quiz et appareil), un identifiant technique d’appareil est conservé dans le navigateur (stockage local et cookie, 400 jours) et enregistré avec la session de quiz. Un délai entre deux envois de score est aussi mémorisé dans le stockage local. Ces éléments ne servent à aucun suivi publicitaire.

**Ressources chargées depuis des services tiers :** pour fonctionner, certaines pages chargent des ressources hébergées par des réseaux de diffusion de contenu (CDN), notamment **jsDelivr** (moteur Pyodide, bibliothèque Supabase, confettis) et **cdnjs** (icônes Font Awesome). Certaines pages de PlayLab chargent en outre des polices depuis **Google Fonts** (Lexend, Press Start 2P, Baloo 2). Le navigateur de l’élève contacte alors ces services, qui peuvent recevoir son adresse IP. La police Atkinson Hyperlegible, elle, est hébergée localement dans Laboratory et MathiLab.

---

## 6. Nature juridique du projet

Ce projet constitue une création originale indépendante. Le code source est distribué sous licence **GNU GPL v3**, garantissant la liberté d’utilisation, de modification et de redistribution, sous condition de maintien de la même licence.

Les contenus pédagogiques sont distribués sous licence **Creative Commons CC BY-NC-SA 4.0**, permettant l’usage, le partage et l’adaptation dans un cadre non commercial, avec obligation de citation et de partage à l’identique.

**Réutilisation du code et données personnelles :** les licences ci-dessus concernent le code et les contenus, **pas les données**. Toute personne qui déploie sa propre version du projet (fork, instance personnelle, connexion à son propre compte Supabase) devient **responsable de son propre traitement** de données personnelles. Elle doit alors respecter le RGPD, informer les personnes concernées et définir sa propre durée de conservation. Les données du projet « Playmaths-arcade » ne sont ni cédées ni partagées avec les réutilisateurs.

---

## 7. Protection juridique (droit européen)

L’ensemble du projet est protégé par le droit d’auteur de l’Union européenne. L’auteur conserve l’intégralité de ses droits moraux et patrimoniaux, notamment :

* droit à la paternité ;
* droit au respect de l’intégrité de l’œuvre ;
* droit de divulgation ;
* contrôle des usages commerciaux selon les licences appliquées.

Les licences GPL v3 et CC BY-NC-SA 4.0 constituent des cadres d’autorisation d’usage et ne constituent pas une cession des droits d’auteur.

---

## 8. Textes officiels des licences

### GNU GPL v3

[https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

### Creative Commons CC BY-NC-SA 4.0

[https://creativecommons.org/licenses/by-nc-sa/4.0/](https://creativecommons.org/licenses/by-nc-sa/4.0/)