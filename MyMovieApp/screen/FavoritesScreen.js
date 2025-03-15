// FavoritesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { loadFavorites } from './favorites'; // Importer la fonction de chargement des favoris
import { useNavigation } from '@react-navigation/native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {  //chargement des favoris 
    const fetchFavorites = async () => {
      const storedFavorites = await loadFavorites();
      setFavorites(storedFavorites);
    };

    fetchFavorites();
  }, []);

  if (favorites.length === 0) {  //si liste vide
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Votre liste est vide...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList  //afficher la liste 
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => navigation.navigate('Details', { movieId: item.id })}
          >
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
            <Text style={styles.movieTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 10,
  },
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#D3D3D3',
    fontSize: 18,
  },
});