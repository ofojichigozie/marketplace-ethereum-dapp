import React, { Component } from 'react';
import Web3 from 'web3';
import MarketPlace from '../abis/MarketPlace.json';
import Navbar from './Navbar';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      account: '',
      marketPlace: {},
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  async loadWeb(){
    if (window.ethereum) {
      window.web3 = await new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = await new Web3(window.web3.currentProvider);
    }else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    // Load the smart contract
    const networkId = await web3.eth.net.getId();
    const networkObj = MarketPlace.networks[networkId];
    if(networkObj){
      const marketPlace = await web3.eth.Contract(MarketPlace.abi, networkObj.address);
      this.setState({ marketPlace });
      const productCount = await marketPlace.methods.productCount().call();
      this.setState({ productCount });

      // Load products
      for(let i = 1; i <= productCount; i++){
        const product = await marketPlace.methods.products(i).call();
        this.setState({ 
          products: [...this.state.products, product]
        });
      }

      this.setState({loading: false});
    }else{
      window.alert('Contract not detected on the selected network');
    }
  }

  createProduct(productName, productPrice){
    this.setState({ loading: true });
    this.state.marketPlace.methods.createProduct(productName, productPrice)
      .send({ from: this.state.account })
      .on('transactionHash', transactionHash => {
        this.setState({ loading: false });
        console.log({ transactionHash });
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        this.setState({ loading: false });
        console.log({ confirmationNumber, receipt });
      })
      .on('receipt', receipt => {
        this.setState({ loading: false });
        console.log({ receipt });
      })
      .on('error', (error, receipt) => {
        this.setState({ loading: false });
        console.log({ error, receipt });
      });
  }

  purchaseProduct(productId, price){
    this.setState({ loading: true });
    this.state.marketPlace.methods.purchaseProduct(productId)
      .send({ from: this.state.account, value: price })
      .on('transactionHash', transactionHash => {
        this.setState({ loading: false });
        console.log({ transactionHash });
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        this.setState({ loading: false });
        console.log({ confirmationNumber, receipt });
      })
      .on('receipt', receipt => {
        this.setState({ loading: false });
        console.log({ receipt });
      })
      .on('error', (error, receipt) => {
        this.setState({ loading: false });
        console.log({ error, receipt });
      });
  }

  async componentWillMount(){
    await this.loadWeb();
    await this.loadBlockchainData();
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { 
                this.state.loading 
                ? 
                  <div id="loader" className="main text-center mt-5">
                    <a>Loading blockchain data</a>
                  </div>
                :
                  <div className="main mt-5">
                      <AddProduct createProduct={this.createProduct}/>
                      <ProductList products={this.state.products} purchaseProduct={this.purchaseProduct}/>
                  </div>
              }
              
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
