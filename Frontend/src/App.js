import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import encryptBTSmemo from './memoUtil'

// sample privatekey : 5HvCkeNvM616XadRPUzAYPScp8p96yPwSZ37PybiYs5LdmaBJir
// sample memo key : BTS7dASErKRm69eiwwVXdUv2eKY4cBvFYANDPL9zbriRHzyWRh86Q
// sample account name: alfredo-worker

var axiosInstance = axios.create({
  baseURL: `http://localhost:4002/`
});

class App extends Component {

  constructor(props) 
  {
    super(props);
    this.state = {
      private_key: '',
      memo_key: '',
      memo: '',
      signed_memo: '',
      decrypted_memo: '',
      account_name: '',
      account_info: ''
    }
    this.onSignMemo = this.onSignMemo.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onLoginAPI = this.onLoginAPI.bind(this);
    this.onAccountAPI = this.onAccountAPI.bind(this);
  }

  onLoginAPI() {
    var _self = this;
    var private_key = this.state.private_key;
    var encrypted_memo = this.state.signed_memo;
    axiosInstance.post('/login', { private_key, encrypted_memo })
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          _self.setState({decrypted_memo: response.data.decryptedMEMO});
        } else {
          _self.setState({decrypted_memo: "Wrong Signed Memo"});
        }
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });
  }

  onAccountAPI() {
    var _self = this;
    axiosInstance.get('/account/' + this.state.account_name)
      .then(function (response) {
        console.log(response);
        _self.setState({account_info: JSON.stringify(response.data.response)});
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });
  }


  handleChange(e, state) {
    this.setState({
      [state]: e.target.value
    })
  }

  onSignMemo() {
    try {
      this.setState({signed_memo: JSON.stringify(encryptBTSmemo(this.state.private_key, this.state.memo_key, this.state.memo, "BTS"))})
    } catch (error) {
      alert(error)
    }
  }

  render() {

    const { signed_memo, decrypted_memo, account_info } = this.state;

    return (
      <div className="App">

          <div className="input--privatekey">
            <div>
              PrivateKey:{'  '}
              <input type="text" name="name" onChange={e => this.handleChange(e, 'private_key')} />
            </div>

            <div>
              MemoKey:{'  '}
              <input type="text" name="name" onChange={e => this.handleChange(e, 'memo_key')} />
            </div>

            <div>
              Memo:{'  '}
              <input type="text" name="name" onChange={e => this.handleChange(e, 'memo')} />  
            </div>          
          </div>

          <div className="sign-memo">
            <input type="button" value="Sign Memo" onClick={this.onSignMemo} />
            <p>Signed Memo:</p>
            <textarea className="signed-memo" type="text" name="name" onChange={e => this.handleChange(e, 'signed_memo')} value={signed_memo} />
          </div>

          <div className="verify--memo">
            <input type="button" value="Call login API" onClick={this.onLoginAPI} />
            <p></p>
            Decrypted Memo:{'  '}
            <input className="decrypted-memo" type="text" name="name" value={decrypted_memo} readOnly />
          </div>

          <div className="account">
            AccountName:{'  '}
            <input type="text" name="name" onChange={e => this.handleChange(e, 'account_name')} />{'  '}
            <input type="button" value="Call account API" onClick={this.onAccountAPI} />
            <p>AccountInfo:</p>
            <textarea className="account-info" type="text" name="name" value={account_info} readOnly />
          </div>

      </div>
    );
  }
}

export default App;
