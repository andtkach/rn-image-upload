import React from 'react';
import {
  Image,
  ImageProps,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {CameraIcon, ImageIcon} from './icons';

interface AvatarProps extends ImageProps {
  onChange?: (file: ImageOrVideo) => void;
}

export const Avatar = (props: AvatarProps) => {
  const [uri, setUri] = React.useState(props.source?.uri || undefined);
  const [visible, setVisible] = React.useState(false);
  const close = () => setVisible(false);
  const open = () => setVisible(true);
  
  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setUri(image.path);
        props.onChange?.(image);
        uploadFile(image);
      })
      .finally(close);
  };

  const createFormData = (image: any, body = {}) => {
    const data = new FormData();
    console.log('image', image);
    data.append('image', {
      name: image.filename,
      type: image.type,
      uri: Platform.OS === 'ios' ? image.sourceURL.replace('file://', '') : image.sourceURL,
    });
  
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
  
    console.log('data', data);
    return data;
  };

  const uploadFile = (image: any) => {
    fetch(`https://devatk11.eu.ngrok.io/FileUpload`, {
      method: 'POST',
      body: createFormData(image, { userId: '123' }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
      })
      .catch((error) => {
        debugger;
        console.log('error', error);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setUri(image.path);
        props.onChange?.(image);
      })
      .finally(close);
  };

  return (
    <>
      <TouchableOpacity onPress={open}>
        <Image
          style={styles.avatar}
          {...props}
          source={uri ? {uri} : props.source}
        />
      </TouchableOpacity>
      <Modal
        isVisible={visible}
        onBackButtonPress={close}
        onBackdropPress={close}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <SafeAreaView style={styles.options}>
          <Pressable style={styles.option} onPress={chooseImage}>
            <ImageIcon />
            <Text>Library </Text>
          </Pressable>
          <Pressable style={styles.option} onPress={openCamera}>
            <CameraIcon />
            <Text>Camera</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    paddingTop: 20,
    height: 100,
    width: 100,
    borderRadius: 100,
    padding: 20,
  },

  options: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
