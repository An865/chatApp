import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {

  onActionPress = () => {
    //handle the various options presented from pressing the + button
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
        }
      },
    );
  };

  pickImage = async () => {
    //choose an image from photo library on device
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

 
  takePhoto = async () => {
    //use camera to take a photo
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  getLocation = async () => {
    //get users current location
    try{
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if(status === 'granted') {
        let result = await Location.getCurrentPositionAsync({})
        .catch(error => console.log(error));

        let longitude = JSON.stringify(result.coords.longitude);
        let latitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
          });
        }
      }
    } catch(error){
      console.log(error)
    } 
  }

    uploadImageFetch = async (uri) => {
    //upload image to firebase
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    //reference to storage
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

   render(){
      return (
      <TouchableOpacity
         accessible={true}
         accessibilityLabel="more options"
         accessibilityHint="options to send geolocation data or image"
         style={[styles.container]}
         onPress={this.onActionPress}
       >
         <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
         </View>
      </TouchableOpacity>
      );
   }
}

const styles = StyleSheet.create({
   container: {
     width: 26,
     height: 26,
     marginLeft: 10,
     marginBottom: 10,
   },
   wrapper: {
     borderRadius: 13,
     borderColor: '#b2b2b2',
     borderWidth: 2,
     flex: 1,
   },
   iconText: {
     color: '#b2b2b2',
     fontWeight: 'bold',
     fontSize: 16,
     backgroundColor: 'transparent',
     textAlign: 'center',
   },
 });
 
 CustomActions.contextTypes = {
   actionSheet: PropTypes.func,
 };