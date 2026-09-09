// Données du jeu "Memory Mermoz" — mémorisation visuelle
// Chaque manche : { id, block, label, memoTime, answerTime, initial[], modified[], choices[], correct, explanation }
// item shape : { type:'shape', shape, color, rotate, scale } | { type:'animal', emoji, scale } | { type:'number', value, changed }

const MEMORY_ROUNDS = [
  {
    id: 0, block: "Échauffement", label: "Manche 0 (démo)", memoTime: 6, answerTime: 20,
    initial: [
      { type: "shape", shape: "circle", color: "red" },
      { type: "shape", shape: "circle", color: "blue" },
      { type: "shape", shape: "circle", color: "yellow" },
    ],
    modified: [
      { type: "shape", shape: "circle", color: "blue" },
      { type: "shape", shape: "circle", color: "red" },
      { type: "shape", shape: "circle", color: "yellow" },
    ],
    choices: ["L'ordre a changé", "Une couleur a changé", "Une forme a disparu", "Une forme a grossi"],
    correct: 0,
    explanation: "Les deux premiers cercles ont échangé leur place."
  },

  // ---- BLOC 1 : FIGURES GÉOMÉTRIQUES ----
  {
    id: 1, block: "Figures géométriques", label: "Manche 1", memoTime: 6, answerTime: 15,
    initial: [
      { type: "shape", shape: "square", color: "red" },
      { type: "shape", shape: "triangle", color: "blue" },
      { type: "shape", shape: "circle", color: "green" },
      { type: "shape", shape: "star", color: "yellow" },
    ],
    modified: [
      { type: "shape", shape: "triangle", color: "blue" },
      { type: "shape", shape: "square", color: "red" },
      { type: "shape", shape: "circle", color: "green" },
      { type: "shape", shape: "star", color: "yellow" },
    ],
    choices: ["L'ordre a changé", "Une rotation a eu lieu", "Une couleur a changé", "Une forme a disparu"],
    correct: 0,
    explanation: "Le carré rouge et le triangle bleu ont échangé leur place."
  },
  {
    id: 2, block: "Figures géométriques", label: "Manche 2", memoTime: 5, answerTime: 15,
    initial: [
      { type: "shape", shape: "losange", color: "orange" },
      { type: "shape", shape: "hexagon", color: "red" },
      { type: "shape", shape: "square", color: "green" },
      { type: "shape", shape: "star", color: "violet" },
      { type: "shape", shape: "circle", color: "yellow" },
    ],
    modified: [
      { type: "shape", shape: "losange", color: "orange" },
      { type: "shape", shape: "hexagon", color: "red" },
      { type: "shape", shape: "square", color: "green" },
      { type: "shape", shape: "star", color: "violet", rotate: 50 },
      { type: "shape", shape: "circle", color: "yellow" },
    ],
    choices: ["Une rotation a eu lieu", "L'ordre a changé", "Une taille a changé", "Une couleur a changé"],
    correct: 0,
    explanation: "L'étoile violette a pivoté."
  },
  {
    id: 3, block: "Figures géométriques", label: "Manche 3", memoTime: 5, answerTime: 15,
    initial: [
      { type: "shape", shape: "star", color: "yellow" },
      { type: "shape", shape: "circle", color: "blue" },
      { type: "shape", shape: "pentagon", color: "red" },
      { type: "shape", shape: "square", color: "green" },
      { type: "shape", shape: "triangle", color: "orange" },
      { type: "shape", shape: "losange", color: "violet" },
    ],
    modified: [
      { type: "shape", shape: "pentagon", color: "red" },
      { type: "shape", shape: "circle", color: "green" },
      { type: "shape", shape: "star", color: "yellow" },
      { type: "shape", shape: "square", color: "green" },
      { type: "shape", shape: "triangle", color: "orange" },
      { type: "shape", shape: "losange", color: "violet" },
    ],
    choices: ["Une couleur a changé", "L'ordre a changé", "Couleur ET ordre ont changé", "Une forme a disparu"],
    correct: 2,
    explanation: "L'étoile et le pentagone ont échangé leur place, et le cercle est passé de bleu à vert."
  },
  {
    id: 4, block: "Figures géométriques", label: "Manche 4", memoTime: 4, answerTime: 15,
    initial: [
      { type: "shape", shape: "hexagon", color: "blue" },
      { type: "shape", shape: "triangle", color: "red" },
      { type: "shape", shape: "circle", color: "yellow" },
      { type: "shape", shape: "star", color: "violet" },
      { type: "shape", shape: "square", color: "green" },
      { type: "shape", shape: "losange", color: "orange" },
    ],
    modified: [
      { type: "shape", shape: "hexagon", color: "blue", scale: 1.4 },
      { type: "shape", shape: "triangle", color: "red", rotate: 180 },
      { type: "shape", shape: "circle", color: "yellow" },
      { type: "shape", shape: "star", color: "violet" },
      { type: "shape", shape: "square", color: "green" },
      { type: "shape", shape: "losange", color: "orange" },
    ],
    choices: ["Taille ET rotation ont changé", "Une couleur a changé", "L'ordre a changé", "Une forme a disparu"],
    correct: 0,
    explanation: "L'hexagone bleu a grossi et le triangle rouge s'est retourné."
  },
  {
    id: 5, block: "Figures géométriques", label: "Manche 5 (bonus)", memoTime: 3, answerTime: 15,
    initial: [
      { type: "shape", shape: "pentagon", color: "green" },
      { type: "shape", shape: "losange", color: "red" },
      { type: "shape", shape: "hexagon", color: "yellow" },
      { type: "shape", shape: "triangle", color: "blue" },
      { type: "shape", shape: "star", color: "orange" },
      { type: "shape", shape: "square", color: "violet" },
      { type: "shape", shape: "circle", color: "red" },
    ],
    modified: [
      { type: "shape", shape: "pentagon", color: "green" },
      { type: "shape", shape: "losange", color: "red" },
      { type: "shape", shape: "hexagon", color: "yellow" },
      { type: "shape", shape: "triangle", color: "blue" },
      { type: "shape", shape: "star", color: "orange", rotate: 40 },
      { type: "shape", shape: "square", color: "violet" },
      { type: "shape", shape: "circle", color: "red" },
    ],
    choices: ["Une rotation subtile a eu lieu", "L'ordre a changé", "Une taille a changé", "Rien n'a changé"],
    correct: 0,
    explanation: "L'étoile orange a subi une légère rotation — la manche la plus difficile du bloc !"
  },

  // ---- BLOC 2 : ALGORITHME ANIMAUX ----
  {
    id: 6, block: "Algorithme animaux", label: "Manche 1", memoTime: 6, answerTime: 15,
    initial: [
      { type: "animal", emoji: "🐘" }, { type: "animal", emoji: "🦁" },
      { type: "animal", emoji: "🐒" }, { type: "animal", emoji: "🐧" },
    ],
    modified: [
      { type: "animal", emoji: "🐒" }, { type: "animal", emoji: "🦁" },
      { type: "animal", emoji: "🐘" }, { type: "animal", emoji: "🐧" },
    ],
    choices: ["L'ordre a changé", "Un animal a disparu", "Un animal a grossi", "Un animal a été ajouté"],
    correct: 0,
    explanation: "L'éléphant et le singe ont échangé leur place."
  },
  {
    id: 7, block: "Algorithme animaux", label: "Manche 2", memoTime: 5, answerTime: 15,
    initial: [
      { type: "animal", emoji: "🦒" }, { type: "animal", emoji: "🐍" },
      { type: "animal", emoji: "🐢" }, { type: "animal", emoji: "🐬" }, { type: "animal", emoji: "🦊" },
    ],
    modified: [
      { type: "animal", emoji: "🦒" }, { type: "animal", emoji: "🐍" },
      { type: "animal", emoji: "🐢", scale: 1.6 }, { type: "animal", emoji: "🐬" }, { type: "animal", emoji: "🦊" },
    ],
    choices: ["Un animal a grossi", "L'ordre a changé", "Un animal a disparu", "Une couleur a changé"],
    correct: 0,
    explanation: "La tortue a beaucoup grossi !"
  },
  {
    id: 8, block: "Algorithme animaux", label: "Manche 3", memoTime: 5, answerTime: 15,
    initial: [
      { type: "animal", emoji: "🐺" }, { type: "animal", emoji: "🐼" }, { type: "animal", emoji: "🦉" },
      { type: "animal", emoji: "🐘" }, { type: "animal", emoji: "🦁" }, { type: "animal", emoji: "🐒" },
    ],
    modified: [
      { type: "animal", emoji: "🐺" }, { type: "animal", emoji: "🐼" },
      { type: "animal", emoji: "🐘" }, { type: "animal", emoji: "🦁" }, { type: "animal", emoji: "🐒" },
    ],
    choices: ["Un animal a disparu", "L'ordre a changé", "Un animal a grossi", "Un animal a été ajouté"],
    correct: 0,
    explanation: "Le hibou a disparu de la série."
  },
  {
    id: 9, block: "Algorithme animaux", label: "Manche 4", memoTime: 4, answerTime: 15,
    initial: [
      { type: "animal", emoji: "🐧" }, { type: "animal", emoji: "🦒" }, { type: "animal", emoji: "🐍" },
      { type: "animal", emoji: "🐢" }, { type: "animal", emoji: "🐬" }, { type: "animal", emoji: "🦊" }, { type: "animal", emoji: "🐺" },
    ],
    modified: [
      { type: "animal", emoji: "🐧" }, { type: "animal", emoji: "🦒" }, { type: "animal", emoji: "🐍" },
      { type: "animal", emoji: "🐼" },
      { type: "animal", emoji: "🐢" }, { type: "animal", emoji: "🐬" }, { type: "animal", emoji: "🦊" }, { type: "animal", emoji: "🐺" },
    ],
    choices: ["Un animal a été ajouté", "Un animal a disparu", "L'ordre a changé", "Un animal a grossi"],
    correct: 0,
    explanation: "Un panda s'est glissé dans la série !"
  },
  {
    id: 10, block: "Algorithme animaux", label: "Manche 5 (bonus)", memoTime: 3, answerTime: 15,
    initial: [
      { type: "animal", emoji: "🐘" }, { type: "animal", emoji: "🦁" }, { type: "animal", emoji: "🐒" }, { type: "animal", emoji: "🐧" },
      { type: "animal", emoji: "🦒" }, { type: "animal", emoji: "🐍" }, { type: "animal", emoji: "🐢" }, { type: "animal", emoji: "🐬" },
    ],
    modified: [
      { type: "animal", emoji: "🐒" }, { type: "animal", emoji: "🦁" }, { type: "animal", emoji: "🐘" }, { type: "animal", emoji: "🐧" },
      { type: "animal", emoji: "🦒" }, { type: "animal", emoji: "🐢" }, { type: "animal", emoji: "🐍" }, { type: "animal", emoji: "🐬", scale: 0.6 },
    ],
    choices: ["Ordre ET taille ont changé", "Seul l'ordre a changé", "Seule la taille a changé", "Rien n'a changé"],
    correct: 0,
    explanation: "Éléphant/singe échangés, tortue/serpent échangés, et le dauphin a rapetissé — triple changement !"
  },

  // ---- BLOC 3 : LISTE DE NOMBRES ----
  {
    id: 11, block: "Liste de nombres", label: "Manche 1", memoTime: 6, answerTime: 15,
    initial: [
      { type: "number", value: "12" }, { type: "number", value: "47" },
      { type: "number", value: "8" }, { type: "number", value: "63" },
    ],
    modified: [
      { type: "number", value: "47" }, { type: "number", value: "12" },
      { type: "number", value: "8" }, { type: "number", value: "63" },
    ],
    choices: ["L'ordre a changé", "Un nombre manque", "Une valeur a changé", "Rien n'a changé"],
    correct: 0,
    explanation: "12 et 47 ont échangé leur place."
  },
  {
    id: 12, block: "Liste de nombres", label: "Manche 2", memoTime: 5, answerTime: 15,
    initial: [
      { type: "number", value: "5" }, { type: "number", value: "15" }, { type: "number", value: "25" },
      { type: "number", value: "35" }, { type: "number", value: "45" },
    ],
    modified: [
      { type: "number", value: "5" }, { type: "number", value: "15" }, { type: "number", value: "?", changed: true },
      { type: "number", value: "35" }, { type: "number", value: "45" },
    ],
    choices: ["Un terme de la suite manque", "L'ordre a changé", "Une valeur a été modifiée", "Un terme a été ajouté"],
    correct: 0,
    explanation: "Suite +10 : il manque le 25."
  },
  {
    id: 13, block: "Liste de nombres", label: "Manche 3", memoTime: 5, answerTime: 15,
    initial: [
      { type: "number", value: "3,2" }, { type: "number", value: "7,5" }, { type: "number", value: "9,1" },
      { type: "number", value: "4,8" }, { type: "number", value: "6,6" },
    ],
    modified: [
      { type: "number", value: "3,2" }, { type: "number", value: "7,5" }, { type: "number", value: "9,7", changed: true },
      { type: "number", value: "4,8" }, { type: "number", value: "6,6" },
    ],
    choices: ["Une valeur a été modifiée", "L'ordre a changé", "Un nombre manque", "Rien n'a changé"],
    correct: 0,
    explanation: "9,1 est devenu 9,7."
  },
  {
    id: 14, block: "Liste de nombres", label: "Manche 4", memoTime: 4, answerTime: 15,
    initial: [
      { type: "number", value: "2" }, { type: "number", value: "4" }, { type: "number", value: "8" },
      { type: "number", value: "16" }, { type: "number", value: "32" }, { type: "number", value: "64" },
    ],
    modified: [
      { type: "number", value: "2" }, { type: "number", value: "4" }, { type: "number", value: "8" },
      { type: "number", value: "20", changed: true }, { type: "number", value: "32" }, { type: "number", value: "64" },
    ],
    choices: ["La suite (×2) est cassée par une valeur", "L'ordre a changé", "Un terme manque", "Rien n'a changé"],
    correct: 0,
    explanation: "Suite ×2 : 16 est devenu 20, ce qui casse la logique."
  },
  {
    id: 15, block: "Liste de nombres", label: "Manche 5 (bonus)", memoTime: 3, answerTime: 15,
    initial: [
      { type: "number", value: "120" }, { type: "number", value: "85" }, { type: "number", value: "60" },
      { type: "number", value: "45" }, { type: "number", value: "33" }, { type: "number", value: "21" }, { type: "number", value: "10" },
    ],
    modified: [
      { type: "number", value: "85" }, { type: "number", value: "120" }, { type: "number", value: "60" },
      { type: "number", value: "45" }, { type: "number", value: "38", changed: true }, { type: "number", value: "21" }, { type: "number", value: "10" },
    ],
    choices: ["Ordre ET valeur ont changé", "Seul l'ordre a changé", "Seule une valeur a changé", "Rien n'a changé"],
    correct: 0,
    explanation: "120/85 ont échangé leur place, et 33 est devenu 38 — double changement !"
  },

  // ---- MANCHE FINALE : MIX ----
  {
    id: 16, block: "Finale MIX", label: "Manche finale (bonus x2)", memoTime: 5, answerTime: 10,
    initial: [
      { type: "shape", shape: "triangle", color: "red" },
      { type: "animal", emoji: "🦊" },
      { type: "number", value: "27" },
      { type: "shape", shape: "star", color: "blue" },
      { type: "animal", emoji: "🐢" },
      { type: "number", value: "14" },
      { type: "shape", shape: "square", color: "green" },
      { type: "animal", emoji: "🐬" },
    ],
    modified: [
      { type: "shape", shape: "triangle", color: "red" },
      { type: "animal", emoji: "🦊" },
      { type: "number", value: "27" },
      { type: "shape", shape: "star", color: "blue", rotate: 90 },
      { type: "animal", emoji: "🐢" },
      { type: "number", value: "14" },
      { type: "shape", shape: "square", color: "green" },
      { type: "animal", emoji: "🐬" },
    ],
    choices: ["C'est une figure (l'étoile)", "C'est un animal", "C'est un nombre", "Rien n'a changé"],
    correct: 0,
    explanation: "L'étoile bleue a pivoté — seuls les groupes les plus attentifs l'ont vu !"
  },
];

if (typeof window !== "undefined") window.MEMORY_ROUNDS = MEMORY_ROUNDS;
if (typeof module !== "undefined") module.exports = MEMORY_ROUNDS;
