import React, { Component } from 'react';
import NotefulContext from '../NotefulContext'

export default class AddFolder extends Component {
  static contextType = NotefulContext;

  state = {
    newFolderName: null,
    touched: false,
  }

  validateName() {
    if (!this.state.newFolderName && this.state.touched) {
      return 'Must choose a folder to delete or click cancel';
    }
  }
  setFolder(value){
    this.setState({
      newFolderName: value,
      touched:true,
    })
  }

  render() {
    return (
      <form className="addfolder" id="addfolder">
        <label htmlFor="addfolder-input">Delete a folder
        <p className='error'> {this.validateName()}</p>
        </label>
        <select className="addfolder-input" id="addfolder-input" name="newFolderName" onChange={(e) => this.setFolder(e.target.value)} required>
          <option value=''>Select Folder</option>
          {this.context.folders.map(folder => {
            return <option key= {folder.id} value={folder.id}>{folder.name}</option>
          })}
        </select>
        <p>Warning, all notes inside the folder will be deleted.</p>
        <button disabled={this.validateName() || !this.state.touched} onClick={(e) => { this.props.handleDeleteFolder(e) }} type="button">Delete</button>
      </form>
    )
  }
}
