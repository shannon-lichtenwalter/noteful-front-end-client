import React, {Component} from 'react';
import '../App/App.css';
import './FolderList.css';
import AddFolder from './AddFolder';
import {Link} from "react-router-dom";
import NotefulContext from '../NotefulContext';
import PropTypes from 'prop-types';
import DeleteFolder from './DeleteFolder';

class FolderList extends Component {
    static contextType = NotefulContext;
    state = {
        addingFolder: {add: false},
        deletingFolder: false
    }



    handleAddFolder = (event) => {
        try {
            event.preventDefault();
            const newFolderName = document.getElementById('addfolder-input').value

            this.context.addFolder(newFolderName)
            //API stuff
            this.setState({
                addingFolder: false

            })
        } catch(error){
            throw new Error(error)
        }

    }

    handleDeleteFolder = (event) => {
        try {
            event.preventDefault();
            const deleteFolderId = document.getElementById('addfolder-input').value

            this.context.deleteFolder(deleteFolderId)
            //API stuff
            this.setState({
                deletingFolder: false

            })
        } catch(error){
            throw new Error(error)
        }
    }

    render() {

        return (
            <div className="folderlist">
                {this.context.folders.map((folder) => {
                    
                    return (<div key={folder.id} className={(folder.id === this.props.id) ? 'background' : ''}><Link key={folder.id} to={'/folders/' + folder.id}>{folder.name}</Link></div>);
                    })
                }
                {!this.state.addingFolder.add &&
                    (<button onClick={() =>
                    this.setState({ addingFolder: { add: true } })}
                        >Add Folder</button>)
                }
                <button onClick={()=> this.setState({deletingFolder: true})}>Delete a Folder</button>
                {this.state.addingFolder.add &&
                    (<AddFolder handleAddFolder={this.handleAddFolder} />)
                }
                {this.state.deletingFolder &&
                    (<DeleteFolder handleDeleteFolder= {this.handleDeleteFolder}/>)}
            </div>);
    }
}

FolderList.propTypes = {
    id: PropTypes.number
}

export default FolderList;
