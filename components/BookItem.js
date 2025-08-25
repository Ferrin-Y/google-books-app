import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";

export default function BookItem({ book, onFavorite }) {
  if (!book?.volumeInfo) return null;

  const openBookInStore = () => {
    const url = book.volumeInfo.infoLink;
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity onPress={openBookInStore} activeOpacity={0.7}>
      <View style={styles.bookContainer}>
        <Image
          source={{ uri: book.volumeInfo.imageLinks?.thumbnail || "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg" }}
          style={styles.bookImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.bookTitle}>{book.volumeInfo.title || "No Title"}</Text>
          <Text style={styles.bookAuthor}>{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => onFavorite(book)}>
          <Text style={styles.favoriteText}>⭐</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    flexDirection: "row",
    backgroundColor: "#333",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  bookImage: {
    width: 50,
    height: 75,
    marginRight: 10,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  bookAuthor: {
    color: "#aaa",
  },
  favoriteButton: {
    backgroundColor: "#3d3d3d",
    padding: 10,
    borderRadius: 10,
  },
  favoriteText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
