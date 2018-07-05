import decode from 'jwt-decode';
import web3 from '../web3';

export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost:4000'
        this.fetch = this.fetch.bind(this)
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.getSignature = this.getSignature.bind(this)
    }

    async getSignature(method,params,account)  {
        return new Promise((resolve, reject) => {
           web3.currentProvider.sendAsync({method,params,account},async (err, result) => {
             if (err) { 
               return reject(err); 
           }
             return resolve(result.result);
           });
         })
    }

    async login() {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        let res = await fetch(this.domain+'/auth/' + account.toLowerCase());
        const challenge = await res.json();

        const params = [challenge, account];
        const method = 'eth_signTypedData';

        const signature = await this.getSignature(method,params,account);
        let check = await fetch(this.domain+'/auth/' + challenge[1].value + '/' + signature);
        const verify = await check.json();
        this.setToken(verify.token);
        
        return verify;
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken()
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
        console.log('set token');
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        console.log(decode(this.getToken()));
        return decode(this.getToken());
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        // console.log('fetch');
        console.log(url);
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            console.log(error)
            throw error
        }
    }
}