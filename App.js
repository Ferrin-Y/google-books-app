import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookItem from "./components/BookItem";
import FavoritesModal from "./components/FavoritesModal";
import { Icon } from 'react-native-elements'; // Add icon library for the heart icon
import { useFonts, Outfit_400Regular } from "@expo-google-fonts/outfit";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1); // Track the current page for loading more books

  // Load fonts
  let [fontsLoaded] = useFonts({
    Outfit: Outfit_400Regular,
    LilitaOne: LilitaOne_400Regular,
  });

  useEffect(() => {
    loadFavorites();
  }, []);

  const searchBooks = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${(page - 1) * 10}&maxResults=10`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", "Failed to fetch books. Please try again.");
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites)); 
      } else {
        setFavorites([]); 
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveToFavorites = async (book) => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      const existingFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (existingFavorites.some((fav) => fav.id === book.id)) {
        Alert.alert("Already in Favorites");
        return;
      }

      const updatedFavorites = [...existingFavorites, book];
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites); 
    } catch (error) {
      console.error("Error saving to favorites:", error);
    }
  };

  const removeFromFavorites = async (bookId) => {
    const updatedFavorites = favorites.filter((book) => book.id !== bookId);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const loadMoreBooks = async () => {
    try {
      const newPage = page + 1;
      setPage(newPage); // Increment the page
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${(newPage - 1) * 10}&maxResults=10`
      );
      const data = await response.json();
      setBooks((prevBooks) => [...prevBooks, ...(data.items || [])]); // Append new books to the existing list
    } catch (error) {
      console.error("Error loading more books:", error);
      Alert.alert("Error", "Failed to load more books. Please try again.");
    }
  };

  // Return loading screen if fonts are not loaded
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      {/* Sticky Navbar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Book Library</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="heart" type="font-awesome" size={25} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search for books..."
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Book List */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookItem book={item} onFavorite={saveToFavorites} />
        )}
      />

      {/* Load More Button */}
      <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreBooks}>
        <Text style={styles.buttonText}>Load More</Text>
      </TouchableOpacity>

      <FavoritesModal
        visible={modalVisible}
        favorites={favorites}
        onClose={() => setModalVisible(false)}
        onRemove={removeFromFavorites}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70, // Adding padding to ensure the content doesn't go under the nav bar
    padding: 20,
    backgroundColor: "#222",
  },
  navBar: {
    position: 'absolute', // Fixes the navbar at the top
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#333",
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1, // Ensures the navbar is on top of other content
  },
  navTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "LilitaOne",
  },
  input: {
    marginTop: 10,
    height: 50,
    borderWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    color: "white",
    marginBottom: 10,
    fontFamily:"Outfit",
    
  },
  searchButton: {
    backgroundColor: "#7760eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    
  },
  loadMoreButton: {
    backgroundColor: "#7760eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily:"Outfit",
  },
});

