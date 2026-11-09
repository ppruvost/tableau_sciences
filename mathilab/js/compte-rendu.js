/**
 * mathilab/js/compte-rendu.js : RELAIS vers le module unique du site.
 *
 * Le compte rendu est désormais centralisé dans /js/compte-rendu.js (racine),
 * partagé par SciLab, MathiLab et le hub (geogebra-pdf.js). Ce fichier ne
 * contient plus de code : il ne fait que ré-exporter le module racine, pour
 * que d'éventuels imports hérités de '../js/compte-rendu.js' continuent de
 * fonctionner. Il peut être supprimé dès que plus aucun fichier ne l'importe.
 */
export * from '../../js/compte-rendu.js';
export { default } from '../../js/compte-rendu.js';
