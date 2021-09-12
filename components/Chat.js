import React from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import firebase for database
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      username: '',
      background: '',
      messages: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
    }

    //firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAf0wOxnpco0t3gTMcLRZfskXNN7CfXbv4",
      authDomain: "messages-ac034.firebaseapp.com",
      projectId: "messages-ac034",
      storageBucket: "messages-ac034.appspot.com",
      messagingSenderId: "712325807826",
      appId: "1:712325807826:web:c05519d7411751c69bf70b",
      measurementId: "G-45BST4B2MY"
    };
    
    //initialize firebase app
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    //reference to firebase collection 'messages'
    this.referenceChatMessages = firebase.firestore().collection('messages');
    //Current reference to user is set to null
    this.referenceMessageUser = null;
  }


  componentDidMount() {
    //set state to set username and background color and to track messages
    const username = this.props.route.params.username;
    const background = this.props.route.params.background;

    //Determine if user is online or offline
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        //change state of isConnected to true
        this.setState({isConnected: true});
        console.log('online');

        //check if user is signed in and if not sign-in via anonymous sign-in
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          //update user state with current active user
          this.setState({
            username: username,
            background: background,
            uid: user.uid,
            user: {
              _id: user.uid,
              name: username,
              avatar: 'https://placeimg.com/140/140/any',
            },
            messages: [],
            loggedInText: 'You Are Logged In',
          }, ()=>{this.setnavigationBar()} 
          );
          //Reference to current users messages
          this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
          //take snapshot of current state of messages collection on firebase
          this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({isConnected: false})
        //since offline get messages from asyncstorage
        this.getMessages();
      }
    });
  }

    
  renderInputToolbar(props) {  
  //don't render input toolbar if offline
    if (this.state.isConnected === false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  //render chat bubble with specific styling
  renderBubble(props) {
    backgroundColor = this.state.background;
    if (backgroundColor == '#ffffff')
    //if user selects white background
    { 
      return (
        //make user text white and other user's background black with white text
        <Bubble
          {...props}
          wrapperStyle={{
            right: {backgroundColor: backgroundColor},
            left: {backgroundColor: '#ebd5d5'}
          }}
          textProps={{
            style: { color: '#000000'}
          }}
          timeTextStyle={{
            right: {color: '#000000'},
            left: {color: '#000000'}
          }}
        />
      )
    } else {
      //else (user's background is not white) make their text white and other user's background black with white text
      return(
        <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: backgroundColor},
          left: {backgroundColor: '#ebd5d5'}
        }}
        textStyle={{
          right: {color: '#ffffff'},
          left: {color: '#000000'}

        }}
        timeTextStyle={{
          right: {color: '#ffffff'},
          left: {color: '#000000'}
        }}
      />
      )
    }
  }


  setnavigationBar(){
    //set styling for navigation bar
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

  onCollectionUpdate = (querySnapshot) => {
    //when collection updates take snapshot and go through it to save each document to 'messages'
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      //append data to messages array
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    //update state of messages array
    this.setState({
      messages
    })
  }

  addMessage(){
    //add incoming messages to firebase database
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      //add the following data regarding the message
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
    })
  }

  componentWillUnmount() {
    //unsubscribe to stop recieving updates about collection in firebase
    this.authUnsubscribe();
 }

  onSend(messages = []) {
    //message from another user gets appended to the previous state so both appear in the chat
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), ()=>{
      //addMessage function saves messages to database
      this.addMessage();
      //save messages saves to local storage
      this.saveMessages();
    })
  }

  async getMessages() {
    //Loads messages from AsyncStorage
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    //save messages to local storage for offline use
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    //function to delete messages from local storage 
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {
    return (
      <View style={styles.chatContainer}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
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