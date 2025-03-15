import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';


export default function DetailScreen({ route }) {
  const { movieId } = route.params;
  const API_KEY = '0c0720f5f0242091dd0f4229ac2aa8b3';
  const MOVIE_DETAIL_API_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
   
  //requete API pour le detail des films
  useEffect(() => {
    fetch(MOVIE_DETAIL_API_URL)
      .then(response => response.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {  //chargement
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Chargement des détails du film...</Text>
      </View>
    );
  }

  if (!movie) {  //erreur
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement des détails.</Text>
      </View>
    );
  }

  return (  //afficher info du film(affiche, titre, description)
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1c1c1c',
  },
  poster: {
    width: '100%',
    height: 400,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  overview: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
    textAlign: 'justify',
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
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
});