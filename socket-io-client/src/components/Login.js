import React, { Component } from 'react';
import './Login.css';
import AuthService from './AuthService';

class Login extends Component {
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
    }
    componentWillMount(){
        if(this.Auth.loggedIn())
            this.props.history.replace('/');
    }
    render() {
        return (
            <div className="center">
                <div className="card">
                    <button className="form-submit" onClick={this.handleFormSubmit}>SIGN IN</button>
                        
                </div>
            </div>
        );
    }

    async handleFormSubmit(e){
        e.preventDefault();
      
        // this.Auth.login(this.state.username,this.state.password)
        //     .then(res =>{
        //        this.props.history.replace('/');
        //        console.log('login is done');
        //     })
        //     .catch(err =>{
        //         alert(err);
        //     })


        let res = await this.Auth.login();
        console.log(res);
        this.props.history.replace('/');
        console.log('login is done');
    }

    handleChange(e){
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }
}

export default Login;