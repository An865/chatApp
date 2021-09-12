import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {


   render(){
      return (
      <TouchableOpacity
         accessible={true}
         accessibilityLabel="more options"
         accessibilityHint="choose to send geolocation or image"
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