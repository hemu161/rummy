import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import web3 from './web3';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
const Auth = new AuthService();

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
   
    let res = await fetch('http://localhost:4000/auth/' + account.toLowerCase());
    const challenge = await res.json();
    
    const params = [challenge, account];
    const method = 'eth_signTypedData';

    web3.currentProvider.sendAsync({method,params,account}, 
      async (err, result) => {
        const signature = result.result;
        if (err) {
          return console.error(err);
        }
        if (result.error) {
          return console.error(result.error);
        }
        
        // const recovered = sigUtil.recoverTypedSignature({
        //   data:challenge,
        //   sig:signature
        // });
        // console.log(recovered);

        let check = await fetch('http://localhost:4000/auth/' + challenge[1].value + '/' + signature);
        const verify = await check.text();
        console.log(verify);
      });
  
  };

  handleLogout(){
    Auth.logout()
    this.props.history.replace('/login');
 }

  render() {
    const { response } = this.state;
    return(
      <div className="App">
          <div className="App-header">
              
              <h2>Welcome {this.props.user.username}</h2>
          </div>
          <p className="App-intro">
              <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
          </p>
          </div>
  );
  }
}
export default withAuth(App);