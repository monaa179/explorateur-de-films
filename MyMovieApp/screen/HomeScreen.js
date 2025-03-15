import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { saveFavorites, loadFavorites, toggleFavorite } from './favorites';



export default function HomeScreen() {
  const API_KEY = '0c0720f5f0242091dd0f4229ac2aa8b3';
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`;
  const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMovies();
    loadStoredFavorites();
  }, []);

  const fetchMovies = (query = '') => {  //recuperer les films populaires
    setLoading(true);
    const url = query ? SEARCH_API_URL + query : API_URL;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setMovies(data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const loadStoredFavorites = async () => {  //charger les favoris enregistrer
    const storedFavorites = await loadFavorites();
    setFavorites(storedFavorites);
  };

  const handleToggleFavorite = async (movie) => {  //gerer les favoris
    const updatedFavorites = toggleFavorite(movie, favorites);
    setFavorites(updatedFavorites);
    await saveFavorites(updatedFavorites);  // Enregistrer les favoris
  };

  const handleSearch = () => {  //requete API pour obtenir films correspondant aux mots clefs
    fetchMovies(searchQuery);
  };

  if (loading) {  //ecran de chargemrnt
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Chargement des films...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>My Movie App</Text>
       <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>   
        <Text style={styles.favoriteButton}>Mes Favoris</Text>
      </TouchableOpacity>
      <TextInput                            //bar de recherche
        style={styles.searchInput}
        placeholder="Rechercher un film..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList  //afficher liste des films
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Details', { movie: item})}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            
            <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text> 
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleToggleFavorite(item)}  // bouton favoris
            >
              <Text style={{ color: favorites.some(fav => fav.id === item.id) ? 'yellow' : 'white' }}>
                {favorites.some(fav => fav.id === item.id) ? '★ Favori' : '☆ Ajouter aux favoris'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.movieList}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  headerText: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  movieList: {
    paddingHorizontal: 10,
  },
  movieCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    margin: 10,
    padding: 10,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  poster: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  movieTitle: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  
  favoriteButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
  
});