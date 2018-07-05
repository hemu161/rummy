import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
import socket from './socket';
const Auth = new AuthService();

class App extends Component {
  state = {
    socket_message: false
  }
  
  async componentDidMount() {
      socket.on("from server", (message) => this.setState({ socket_message: message }));

      socket.emit('from client', { time: Date.now() });

      socket.on("start game", (games) => this.props.history.replace('/game'))
  }

  async handleLogout(){
    Auth.logout()
    this.props.history.replace('/login');
  }

  render() {
    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome {this.props.user.username}</h2>
          <p>{this.state.socket_message} </p>
        </div>
        <p className="App-intro">
          <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
        </p>
      </div>
    );
  }
}
export default withAuth(App);