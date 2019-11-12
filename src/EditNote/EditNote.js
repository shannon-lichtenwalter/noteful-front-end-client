import React from 'react';
import NotefulContext from '../NotefulContext'

class EditNote extends React.Component {

  //Default folder should be current folder
  static contextType = NotefulContext;

  state = {
    newNoteName: {
      touched: false,
      name: ''
    },
    newNoteContent: {
      touched: false,
      content: ''
    },
    selectedFolder: '',
    noteId: ''
  }

  validateNoteName() {
    if (!this.state.newNoteName.name && this.state.newNoteName.touched) {
      return 'Note Must Have a Name';
    }
  }
  validateNoteContent() {
    if (!this.state.newNoteContent.content && this.state.newNoteContent.touched) {
      return 'Note Must Have Content';
    }
  }
  setNoteName(value) {
    this.setState({
      newNoteName: {
        name: value,
        touched: true
      }
    })
  }
  setNoteContent(value) {
    this.setState({
      newNoteContent: {
        content: value,
        touched: true
      }
    })
  }

  handleChange(e) {
    this.setState({ selectedFolder: e.target.value });
  };

  handleEditNoteClick = (e) => {
    e.preventDefault();
    this.context.editNote(
      this.state.noteId,
      this.state.newNoteName.name,
      this.state.newNoteContent.content,
      this.state.selectedFolder
    )
    this.props.stopEditingNote();
  }

  componentDidMount = () => {
    const note = this.props.note;
    const currentFolder = this.context.folders.find(folder => folder.id === note.folder_id)
    this.setState({
      newNoteName: { name: note.name, touched: false },
      newNoteContent: { content: note.content, touched:false },
      selectedFolder: currentFolder.id,
      noteId: note.id
    })
  }

  render() {
    const currentFolder = this.context.folders.find(folder => folder.id === this.props.note.folder_id)
    return (
      <form>
        <label>Change Folder?</label>
        <select onChange={(e) => this.handleChange(e)}>
          <option name={currentFolder.name} key={currentFolder.id} value={currentFolder.id}>{currentFolder.name}</option>
          {this.context.folders.map(folder => {
            if (folder !== currentFolder) {
              return <option name={folder.name} key={folder.id} value={folder.id}>{folder.name}</option>
            } return null
          })}
        </select>
        <div>
          <label htmlFor='newNoteName'>Change Note Title
          <p className='error'> {this.validateNoteName()}</p>
          </label>
          <input value={this.state.newNoteName.name} id='newNoteName' name='newNoteName' type='text' required
            onChange={(e) => this.setNoteName(e.target.value)}></input>
        </div>

        <div><label htmlFor='newNoteContent'>Edit Note
          <p className='error'> {this.validateNoteContent()}</p>
        </label>
          <textarea value={this.state.newNoteContent.content} id='newNoteContent' name='newNoteContent' rows='15'  required onChange={(e) => this.setNoteContent(e.target.value)}
          ></textarea>
        </div>

        <button type="button" disabled={!this.state.selectedFolder || this.validateNoteContent() || this.validateNoteName()} onClick={this.handleEditNoteClick}>Submit Note Changes</button>
      </form>
    )
  }
}

export default EditNote;