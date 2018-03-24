import React, { Component } from 'react';
import Form from './components/Form.jsx';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gitun : 'No username',
      info: '',
      formData: {
        username: '',
      }
    }
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
  }

  // submit username
  handleUserFormSubmit(event){
    event.preventDefault();
    axios.get('https://api.github.com/users/' + this.state.formData.username)
    .then(response => this.setState({
      gitun: response.data.login,
      info: JSON.stringify(response.data, undefined, 2)
    })).catch((err) => {
      console.log(err);
    });
  }

  // update form data on form change
  handleFormChange(event) {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">GitHub Analytics</h1>
        </header>
        <p className="App-intro">
          Watch this space....
        </p>
        <Form
          formData={this.state.formData}
          handleUserFormSubmit={this.handleUserFormSubmit}
          handleFormChange={this.handleFormChange}
          />
        <p><b>Username:</b></p>
        <p>{this.state.gitun}</p>
        <b>Information:</b>
        <pre>{this.state.info}</pre>
      </div>
    );
  }
}

export default App;
