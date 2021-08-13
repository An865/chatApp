
import React from 'react';
import { View, Text, TextInput, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { back } from 'react-native/Libraries/Animated/src/Easing';

// background image
const background = require('../assets/Background-Image.png');

// icon
const icon = require('../assets/person.png');

// background-color options - Black, Purple, Blue, Green, White
const colors = ['#212224', '#6b5d99', '#5d6599', '#acba9e', '#ffffff'];

export default class Start extends React.Component {

   constructor(props) {
      super(props);
      this.state = { 
         username: '',
         background: '#6b5d99',
      };
    }


   handleOnPressButton = (username, background) => {
      this.props.navigation.navigate('Chat', {
         username,
         background,
       })
   }


  render() {
    return (
      <View style={styles.container}>
         <ImageBackground source={background} style={styles.background}>
            <Text style={styles.title}>App Title</Text>

            <View style={styles.contentBox}>

               <View style={styles.textContainer}>
                  <Image source={icon} style={styles.personIcon}/>
                  <TextInput
                     style={styles.textinput}
                     onChangeText={(username) => this.setState({username})}
                     value={this.state.username}
                     placeholder='Type here ...'
                  />
               </View>

               
               <View>
                  <Text style={styles.colorText}>Choose Background Color:</Text>
                  <View style={styles.backgroundColorChoices}>
                     <TouchableOpacity
                        style={styles.backgroundSelection1}
                        onPress={() => this.setState({ background: '#212224' })}
                     />
                     <TouchableOpacity
                        style={styles.backgroundSelection2}
                        onPress={() => this.setState({ background: '#6b5d99' })}
                     />
                     <TouchableOpacity
                        style={styles.backgroundSelection3}
                        onPress={() => this.setState({ background: '#5d6599' })}
                     />
                     <TouchableOpacity
                        style={styles.backgroundSelection4}
                        onPress={() => this.setState({ background: '#acba9e' })}
                     />
                     <TouchableOpacity
                        style={styles.backgroundSelection5}
                        onPress={() => this.setState({ background: '#ffffff' })}
                     />
                  </View>
               </View>

               <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.handleOnPressButton(this.state.username, this.state.background)}
               >
                  <Text style={styles.buttonText}>Start Chatting</Text>
               </TouchableOpacity>
            </View>
         </ImageBackground>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      position: 'relative',
    },
   title: {
      color: '#ffffff',
      fontSize: 42,
      position: 'absolute',
      fontWeight: 'bold',
      top: 70,
   },
   contentBox: {
      flex: 1,
      height: '44%',
      backgroundColor: '#ffffff',
      width: '88%',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      position: 'absolute',
      bottom: 20,
   },
   textContainer: {
      position: 'relative',
      width: '88%'
   },
   personIcon: {
      height: 20,
      width: 20,
      position: 'absolute',
      top: '25%',
      left: 10,
   },
   textinput: {
      height:50,
      borderColor: '#C4BFBE',
      borderWidth: 2,
      borderRadius: 4,
      fontSize: 15,
      fontWeight: "300",
      color: '#757083',
      paddingLeft: 40,
      width: '88%'
   },
   background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    backgroundColorChoices: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    backgroundSelection1: {
      backgroundColor: '#212224',
      width:50,
      height:50,
      borderRadius: 25,
      borderColor: '#aeaeae',
      borderWidth: 2,
      margin: 3,
    },
    backgroundSelection2: {
      backgroundColor: '#6b5d99',
      width:50,
      height:50,
      borderRadius: 25,
      borderColor: '#aeaeae',
      borderWidth: 2,
      margin: 3,
    },
    backgroundSelection3: {
      backgroundColor: '#5d6599',
      width:50,
      height:50,
      borderRadius: 25,
      borderColor: '#aeaeae',
      borderWidth: 2,
      margin: 3,
    },
    backgroundSelection4: {
      backgroundColor: '#acba9e',
      width:50,
      height:50,
      borderRadius: 25,
      borderColor: '#aeaeae',
      borderWidth: 2,
      margin: 3,
    },
    backgroundSelection5: {
      backgroundColor: '#ffffff',
      width:50,
      height:50,
      borderRadius: 25,
      borderColor: '#aeaeae',
      borderWidth: 2,
      margin: 3,
    },
    button: {
      width: '78%',
      height: 55,
      backgroundColor: '#5d6599',
      color: '#ffffff',
      alignItems: 'center',
      fontWeight: 'bold',
      justifyContent: 'space-evenly',
      width: '88%'
    },
    buttonText: {
       color: '#ffffff',
       fontWeight: 'bold'
    }
})