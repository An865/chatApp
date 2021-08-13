import React from 'react';
import { View, Text} from 'react-native';


export default class Chat extends React.Component {

  componentDidMount(){
    //put username in navigation bar
    const username = this.props.route.params.username;
    this.props.navigation.setOptions({ title: `Welcome ${username}!` });

    //change background color based on user's choice
    const background = this.props.route.params.background;
      this.props.navigation.setOptions({
        title: `Welcome ${username}`,
        headerStyle: {
          backgroundColor: `${background}`,
        },
        headerTintColor: '#212224',
      })

    // if background color is black change black text to white 
     if(background == '#212224'){
       this.props.navigation.setOptions({
         headerTintColor: '#ffffff'
       })
     }
  }


  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello Screen2!</Text>
      </View>
    )
  }
}