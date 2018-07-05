import React, { Component } from 'react';
import AuthService from './AuthService';
import web3 from '../web3';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService('http://localhost:4000');
    return class AuthWrapped extends Component {
       state = {
            user: null,
          }

        async componentWillMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/login');
            }
            else {
                try {
                    const accounts = await web3.eth.getAccounts();
                    const account = accounts[0];
                    const profile = Auth.getProfile();
                    
                    if ( profile.username !== account.toLowerCase() ){
                        Auth.logout();
                        this.props.history.replace('/login');
                    }
                    else {
                        this.setState({
                            user: profile
                        })
                    }
                }
                catch(err){
                    Auth.logout()
                    this.props.history.replace('/login')
                }
            }
        }

        render() {
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} />
                )
            }
            else {
                return null
            }
        }
    };
}

