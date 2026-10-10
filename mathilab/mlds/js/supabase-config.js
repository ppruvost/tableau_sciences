/* Configuration de l'historique élève (Supabase).
   La clé « publishable » est faite pour être publique : elle ne donne accès qu'aux
   4 fonctions mlds_* (voir supabase/mlds_historique.sql). Les tables, elles, ne sont
   lisibles par aucune requête directe (RLS activée, aucun droit pour anon). */
window.MLDS_SUPABASE = {
  url: "https://obsqakmhtvfuwnoxoksr.supabase.co",
  cle: "sb_publishable_6FzuHhDBYOOSiAR9J-CiCA_KBfcyfhu"
};
