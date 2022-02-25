import React, { Component } from 'react';
import  Web3 from 'web3'
import './App.css';
import Navbar from './Navbar';

class App extends Component {



 async UNSAFE_componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
}

async loadBlockchainData(){
  const web3 = window.web3

  const accounts = await web3.eth.getAccounts()
  this.setState({account: accounts[0]})

  const ethBalance = await web3.eth.getBalance(this.state.account)
  this.setState({ ethBalance })
 
}

  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('NonEthereum browser deteted. You should consider tying MetaMask')
    }
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      ethBalance: 0
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                <h1>Hello, world</h1>
               
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
