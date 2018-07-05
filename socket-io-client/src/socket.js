import socketIOClient from "socket.io-client";
import AuthService from './components/AuthService';

const Auth = new AuthService();

const socket = socketIOClient( "http://127.0.0.1:4000", {query: 'auth_token='+Auth.getToken()});

export default socket;