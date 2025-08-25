import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useFonts, Outfit_400Regular } from "@expo-google-fonts/outfit";
import AppLoading from "expo-app-loading"

export default function FavoritesModal({ visible, favorites, onClose, onRemove }) {


  const [fontsLoaded] = useFonts({
    Outfit: Outfit_400Regular, // Register the font
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Favorites</Text>

          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            style={styles.listContainer}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => {
              if (!item?.volumeInfo) return null; 

              return (
                <View style={styles.favItem}>
                  <Image
                    source={{
                      uri: item.volumeInfo.imageLinks?.thumbnail || "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
                    }}
                    style={styles.favImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.favTitle}>{item.volumeInfo.title || "Unknown Title"}</Text>
                  </View>
                  <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeText}>❌</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />


          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%", 
    backgroundColor: "#444",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    fontFamily: "Outfit",
  },
  listContainer: {
    maxHeight: 400, // Adjust based on your needs
    marginBottom: 10,
  },
  favItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  favImage: {
    width: 50,
    height: 75,
    marginRight: 10,
    borderRadius: 5,
  },
  favTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",

  },
  removeButton: {
    backgroundColor: "#3d3d3d",
    padding: 8,
    borderRadius: 10,
  },
  removeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#7760eb",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Outfit",
  },
});
