import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import web3 from './web3';

class App extends Component {
  state = {
    response: false,
    endpoint: "http://127.0.0.1:4000"
  }
  
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const url = 'http://localhost:4000/auth/' + account;
    let res = await fetch(url);
    res = res.json();
    
    let challenge = [{
        type: 'string',
        name: 'challenge',
        value: res
      }];

    const params = [challenge, account];
    const method = 'eth_signTypedData';

   // await web3.eth.signTypedData(params);
    web3.currentProvider.sendAsync({
        method,
        params,
        account
      }, async (err, result) => {
        const signature = result.result;
        if (err) {
          return console.error(err);
        }
        if (result.error) {
          return console.error(result.error);
        }
       console.log(signature);
      });


  };

  render() {
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
       <button onClick={ this.onClick }>Sign In</button>
      </div>
    );
  }
}
export default App;