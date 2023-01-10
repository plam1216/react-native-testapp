import { useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import ImageViewer from './Components/ImageViewer/ImageViewer.js';
import Button from './Components/Button/Button.js';
import CircleButton from './Components/CircleButton/CircleButton.js';
import IconButton from './Components/IconButton/IconButton.js';
import EmojiPicker from './Components/EmojiPicker/EmojiPicker.js';
import EmojiList from './Components/EmojiList/EmojiList.js';
import EmojiSticker from './Components/EmojiSticker/EmojiSticker.js';

import * as ImagePicker from 'expo-image-picker'

const PlaceholderImage = require('./assets/images/coverart.jpg')

export default function App() {
  const [showAppOptions, setShowAppOptions] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pickedEmoji, setPickedEmoji] = useState(null)

  const onReset = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  const onSaveImageAsync = async () => {
  }

  const pickImageAsync = async () => {
    // launchImageLibraryAsync returns an object with information about the image

    let result = await ImagePicker.launchImageLibraryAsync({
      // user can crop images during selection process on Android and iOS, but not the web
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
    } else {
      alert('You did not select an image.')
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
        {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
      </View>

      {/* showAppOptions true => show buttons
          click "Reset" to setShowAppOptions to false and let user choose another photo
      */}
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        < View style={styles.footerContainer} >
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View >
      )}

      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
