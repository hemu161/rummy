import Web3 from 'web3';

let web3;

if ( typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	web3 = new Web3(window.web3.currentProvider);
} else {
	const provider = new Web3.providers.HttpProvider(
		'https://rinkeby.infura.io/ILv6kwdIZV0FzKhS7YYQ'
	);
	web3 = new Web3(provider);
}



export default web3;