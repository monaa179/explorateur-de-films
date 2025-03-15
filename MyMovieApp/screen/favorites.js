import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadFavorites = async () => {  //charger et enregistrer les favoris grace a AsyncStorage
  try {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des favoris : ', error);
    return [];
  }
};

export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des favoris : ', error);
  }
};

export const toggleFavorite = (movie, favorites) => {
  if (favorites.some(fav => fav.id === movie.id)) {
    return favorites.filter(fav => fav.id !== movie.id);  // Supprimer des favoris
  } else {
    return [...favorites, movie];  // Ajouter aux favoris
  }
};