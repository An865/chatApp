import React from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      username: '',
      background: '',
    }
  }


  //render chat bubble with specific styling
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }


  setnavigationBar(){
    //put username in navigation bar
    this.props.navigation.setOptions({ title: `Welcome ${this.state.username}!` });

    //change navigation background color based on user's choice
      this.props.navigation.setOptions({
        title: `Welcome ${this.state.username}`,
        headerStyle: {
          backgroundColor: `${this.state.background}`,
        },
        headerTintColor: '#212224',
      })

    // if background color is black change black text to white 
      if(this.state.background == '#212224'){
        this.props.navigation.setOptions({
          headerTintColor: '#ffffff'
        })
      }
  }

  componentDidMount(){
    //set state to set username and background color and to track messages
    this.setState({
      username: this.props.route.params.username,
      background: this.props.route.params.background,
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `${this.state.username} has entered the chat`,
          createdAt: new Date(),
          system: true,
         },
      ],
    })

    //call function to set username and color in nav bar
    this.setnavigationBar();
  }

  //message a user sends gets appends to the previous state so both appear in the cat
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {

    return (
      <View style={styles.chatContainer}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* compensate for keyboard on android phone obstructing view */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>

    )
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
})