import React, { Component } from 'react';
import axios from 'axios';
import Form from './components/Form.jsx';
import ProfileDetails from './components/ProfileDetails.jsx';
import SortedList from './components/SortedList.jsx';
import LanguageList from './components/LanguageList.jsx';

import lda from './lda';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gitun : 'No username',
      infoclean: '',
      formData: {
        username: '',
      },
      repitems: null,
      staritems: null,
      replanguagecount: {},
      keywords: null
    }
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
  }

  // submit username
  handleUserFormSubmit(event){
    event.preventDefault();
    // get user profile details
    axios.get('https://api.github.com/users/' + this.state.formData.username)
    .then(response => this.setState({
      gitun: response.data.login,
      infoclean: response.data,
      info : JSON.stringify(response.data, undefined, 2)
    })).catch((err) => {
      console.log(err);
    });

    // get user repositories
    axios.get('https://api.github.com/users/' + this.state.formData.username + '/repos')
    .then(response => {
      var itemsWithFalseForks = response.data.filter(item => item.fork === false)
      var sortedItems = itemsWithFalseForks.sort((b,a) => {
        if((a.watchers_count +  a.forks_count) < (b.forks_count + b.watchers_count)){
          return -1
        }else if ((a.watchers_count +  a.forks_count) > (b.forks_count + b.watchers_count)){
          return 1
        }else {
          return 0
        }
      })
      let dictrlc = Object.assign({}, this.state.replanguagecount);
      for (var i = 0; i < itemsWithFalseForks.length; i++) {
          dictrlc[itemsWithFalseForks[i]['language']] = -~ dictrlc[itemsWithFalseForks[i]['language']]
      }

      this.setState({
        repitems: sortedItems.slice(0,10),
        replanguagecount: dictrlc,
    })
    }).catch((err) => {
      console.log(err);
    });

    // get starred repositories
    axios.get('https://api.github.com/users/' + this.state.formData.username + '/starred')
    .then(response => {
      var itemsWithFalseForks = response.data.filter(item => item.fork === false)
      var sortedItems = itemsWithFalseForks.sort((b,a) => {
        if((a.watchers_count +  a.forks_count) < (b.forks_count + b.watchers_count)){
          return -1
        }else if ((a.watchers_count +  a.forks_count) > (b.forks_count + b.watchers_count)){
          return 1
        }else {
          return 0
        }
      })
      var documents = []
      for (var i = 0; i < response.data.length; i++) {
          var descr = response.data[i]['description']
          if (descr != null) {
            var newtext = descr.match(/[^.!?]+[.!?]+/g)
            if (newtext != null) {
              documents = documents.concat(newtext)
            }
          }
      }
      var result = lda(documents, 3, 3);
      var keywords = new Set()
      for (var k = 0; k < 3; k++) {
        for (var j = 0; j < 3; j++) {
          keywords = keywords.add(result[k][j]['term']);
        }
      }
      this.setState({
        staritems: sortedItems.slice(0,10),
        keywords: Array.from(keywords).join(', ')
      })
    }).catch((err) => {
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
        <hr></hr>
        Own Reposiotories:
        <SortedList repitems={this.state.repitems} />
        <hr></hr>
        Starred Reposiotories:
        <SortedList repitems={this.state.staritems} />
        <hr></hr>
        Own Repos Language Count:
        <LanguageList langslist={this.state.replanguagecount}/>
        Keywords:  {this.state.keywords}
      </div>
    );
  }
}

export default App;
