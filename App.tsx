import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Platform, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

import logo from './assets/logo.png';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null as any);
  const [contextLogo, setContextLogo] = useState(null as any);

  useEffect(() => {
    fetchRandomImage();
  }, [])

  const fetchRandomImage = async () => {
    const headers = new Headers();
    headers.append("Authorization", "ML753BSmTZzdvu7dJgJ05RPoCGRBWRdddRv1FD9bVjQ");
    const parms = {
      method: 'GET',
      headers
    };
    const response = await fetch('https://api.unsplash.com/photos/random?client_id=MBHpyxQMkz8yn9nnolr0rWUZ0lm0FX_n47ZgZ8RBX_I', parms);
    const contextLogoJson = await response.json();
    console.warn(contextLogoJson);
    setContextLogo(contextLogoJson);
  }

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is denied");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);

    if (pickerResult.cancelled === true) return;

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  const openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  };

  if (selectedImage !== null) {
    return <View style={styles.container}>
      <Image
        source={{ uri: selectedImage.localUri }}
        style={styles.thumbnail}
      />
      <TouchableOpacity
        onPress={openShareDialogAsync}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Share this photo</Text>
      </TouchableOpacity>
    </View>;
  }

  return (
    <View style={styles.container}>
      { 
        contextLogo ?
        <Image source={{uri: contextLogo.urls.small}} style={styles.logo} /> :
        <Image source={logo} style={styles.logo} />
      }
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!!!
      </Text>

      <TouchableOpacity
        onPress={openImagePickerAsync}
        style={styles.button}>
          <Text style={styles.buttonText}>Pick a Photo</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 305, height: 159, marginBottom: 10 },
  instructions: {color: '#888', fontSize: 18, marginHorizontal: 15, marginBottom: 10},
  button: { backgroundColor: 'blue', padding: 20, borderRadius: 5 },
  buttonText: { fontSize: 20, color: '#fff' },
  thumbnail: { width: 300, height: 300, resizeMode: 'contain' }
});
