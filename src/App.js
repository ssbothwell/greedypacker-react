import React, { Component } from 'react'
import axios from 'axios'
import 'bulma/css/bulma.css'

import SettingsForm from  './SettingsForm.js'
import ItemForm     from  './ItemsForm.js'
import RenderFrame  from  './RenderFrame.js'

import Columns      from  './BulmaComponents/columns.js'
import Column       from  './BulmaComponents/column.js'


class App extends Component {
  constructor() {
    super();
    this.state = {
                  items: [{x: '', y: ''}],
                  sheets: [[]],
                  editing: undefined,
                  activeSheet: 0,
                  settings:   {'bin_width': 8, 
                               'bin_height': 4, 
                               'bin_algo': 'bin_first_fit', 
                               'pack_algo': 'shelf', 
                               'heuristic': 'first_fit', 
                               'sorting': true, 
                               'sorting_heuristic': 'DESCA',
                               'rotation': true, 
                               'wastemap': true,
                               'rectangle_merge': true} 
                 }  
  }

  
  //// SettingsForm Methods
  handleSetField = (newFieldData) => {
    var settings = {...this.state.settings, ...newFieldData}
    this.setState({settings})
  }


  handleFormUpdates = (newItems) => {
    this.setState({items: newItems })
  }


  //// Ajax Methods
  handleFetchData = () => {
    console.log(this.state.settings)
    const items = this.state.items.map(item => { return [parseInt(item['x'], 10), parseInt(item['y'], 10)]})
    const data = { 'items': items, 
                   'binmanager': this.state.settings
                 }
    axios.post('http://127.0.0.1:5000', data)
    .then( (response) => {
      this.setState({
        sheets: response.data
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  //// RenderFrame Methods
  handleActiveSheet = (id) => () => {
    this.setState({activeSheet: id})
  }

  render() {
    return (
            <Columns style={{'padding': '5vh'}}> 
              <Column>
                <SettingsForm handleSetField={this.handleSetField}
                              clickEvent={this.handleFetchData} 
                              state={this.state}/>
                <Columns>
                  <Column class='is-two-thirds'>
                  <RenderFrame handleActiveSheet={this.handleActiveSheet}
                               sheets={this.state.sheets}
                               activeSheet={this.state.activeSheet}/>
                  </Column>
                  <Column class='is-one-third'>
                    <ItemForm handleFormUpdates={this.handleFormUpdates} />
                  </Column>
                </Columns>
              </Column>
            </Columns>
    );
  }
}


export default App;
