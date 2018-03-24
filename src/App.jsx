import React, { Component } from 'react';
import axios from 'axios';
import Form from './components/Form.jsx';
import ProfileDetails from './components/ProfileDetails.jsx';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gitun : 'No username',
      infoclean: '',
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
      infoclean: response.data,
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
       <hr></hr>
       Profile Details
       <ProfileDetails infoclean={this.state.infoclean} />
      </div>
    );
  }
}

export default App;
