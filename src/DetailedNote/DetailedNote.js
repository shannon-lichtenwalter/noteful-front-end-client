import React, {Component} from 'react';
import '../App/App.css';
import {Link} from "react-router-dom";
import NotefulContext from "../NotefulContext";
import PropTypes from 'prop-types';
import EditNote from '../EditNote/EditNote';

class DetailedNote extends Component {
    state = {
        editingNote: false
    }

    stopEditingNote = () => {
        this.setState({
            editingNote: false,
        })
    }

    static contextType= NotefulContext;
    render() {
        const note = {...this.props.note};
        return (
            <div className='Note'>
                <h3>{note.name}</h3>
                <p>Date modified on {(new Date(note.date_modified)).toDateString()}</p>
                <p>{note.content}</p>
                <Link to={'/'}> <button onClick={()=> this.context.deleteNote(note.id)}>Delete Note</button></Link>
                <button onClick={() => this.setState({editingNote: true})}> Edit Note</button>
							{this.state.editingNote && <EditNote note={note} stopEditingNote={this.stopEditingNote}/>}
            </div>
        );
    }
}

DetailedNote.propTypes = {
    note: PropTypes.object
}
export default DetailedNote;
