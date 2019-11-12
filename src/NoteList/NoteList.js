import React, {Component} from 'react';
import '../App/App.css';
import Note from "../Note/Note";
import NotefulContext from '../NotefulContext';
import PropTypes from 'prop-types';

class NoteList extends Component {
    static contextType= NotefulContext;

    render() {
        const currentFolderID = this.props.folderId;
        let notes = this.context.notes;
        if(currentFolderID) {
            notes = this.context.notes.filter((note) => note.folder_id === (currentFolderID));
        }
        return <>
            {notes.map(note =>
                <Note key={note.id} id={note.id} name={note.name} deleteNote={this.context.deleteNote} date_modified={note.date_modified}/>
            )}
        </>;
    }
}

NoteList.propTypes = {
    folderId: PropTypes.number,
}

export default NoteList;
