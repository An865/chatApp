import React from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      username: '',
      background: '',
      messages: []
    }
  }


  //render chat bubble with specific styling
  renderBubble(props) {
    if (this.state.background == '#ffffff')
    { 
      return (
        //if user selects white background make text black else text is white
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: this.state.background,
            }
          }}
          textStyle={{
            right: {
              color: '#000000'
            }
          }}
          timeTextStyle={{
            right: {
              color: '#000000'
            }
          }}
        />
      )
    } else {
      return(
        <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: this.state.background,
          }
        }}
        textStyle={{
          right: {
            color: '#ffffff'
          }
        }}
        timeTextStyle={{
          right: {
            color: '#ffffff'
          }
        }}
      />
      )
    }
  }


  setnavigationBar(){
    let user = this.state.username;
    //display username and change navigation background color based on user's choice
      this.props.navigation.setOptions({
        title: `Welcome ${user}!`,
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
    const username = this.props.route.params.username;
    const background = this.props.route.params.background;

    this.setState({
      username: username,
      background: background,
      messages: [
        {
          _id: 1,
          text: 'Hello Developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `${username} has entered the chat`,
          createdAt: new Date(),
          system: true,
         },
      ],
    }, () => { //must use callback here because setState is async and state change may not register
      //call function to set username and color in nav bar
      this.setnavigationBar();
    })

  
   
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