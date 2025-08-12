import { API_BASE_URL } from '../constants/baseUrl.ts';


export const getSimilarProducts = async (category: string) => {
  const res = await fetch(`${API_BASE_URL}/api/filters/${category}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des produits similaires");
  return res.json();
};
