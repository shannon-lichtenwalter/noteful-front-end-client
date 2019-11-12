import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom'
import './App.css';
import FolderList from "../FolderList/FolderList";
import NoteList from "../NoteList/NoteList";
import AddNote from '../AddNote/AddNote';
import DetailedNote from "../DetailedNote/DetailedNote";
import NotefulContext from '../NotefulContext';
import ErrorBoundary from '../ErrorBoundary';
import config from '../config';

const API_ENDPOINT = config.API_ENDPOINT;

class App extends Component {
	state = {
		notes: [],
		folders: [],
		addingNote: false,
		errors: null,
	};

	editNote = (noteId, newNoteName, newNoteContent, folderId) => {
		const date = new Date();
		const editedNoteObj = {
			name: newNoteName,
			date_modified: date.toDateString(),
			folder_id: folderId,
			content: newNoteContent
		}


		const editedNote = JSON.stringify(editedNoteObj);
		fetch(`${API_ENDPOINT}api/notes/${noteId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: editedNote
		})
			.then(res => {
				if (!res.ok) {
					throw new Error(res.status)
				}
				return res.json()
			})
			.then((data) => {
				console.log(data);
				const index = this.state.notes.findIndex(note => note.id === data.id);
				const notes = this.state.notes;
				notes[index] = data;

				this.setState({
					notes,
				})
			})

	}

	addNote = (newNoteName, newNoteContent, folderId) => {
		const date = new Date();
		const newNoteObj = {
			name: newNoteName,
			date_modified: date.toDateString(),
			folder_id: folderId,
			content: newNoteContent,
		}

		const newNoteJson = JSON.stringify(newNoteObj);
		fetch(`${API_ENDPOINT}api/notes`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: newNoteJson
			}
		).then(resp => {
			if (resp.ok) {

				return resp.json()
			} else { throw new Error(resp.status) }
		}).then(data => this.setState({
			notes:
				[...this.state.notes, data]
		})).then(() => this.setState({ addingNote: false }))
			.catch(err => { throw new Error(err) })
	}


	addFolder = folderName => {
		const newObj = {
			name: folderName,
		}
		const finalObj = JSON.stringify(newObj)
		fetch(`${API_ENDPOINT}api/folders`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: finalObj
			}
		).then(resp => {
			if (resp.ok) {

				return resp.json()
			} else { throw new Error(resp.status) }
		}).then(data => this.setState({
			folders:
				[...this.state.folders, data]
		}))
			.catch(err => { throw new Error(err) })
	}

	componentDidMount() {
		fetch(`${API_ENDPOINT}api/folders`).then(res => res.json()).then(data => this.setState({ folders: data }));
		fetch(`${API_ENDPOINT}api/notes`).then(res => res.json()).then(data => this.setState({ notes: data }));
	}

	deleteNote = (id) => {

		fetch(`${API_ENDPOINT}api/notes/${id}`, {
			method: 'DELETE'
		}).then(() => this.setState({ notes: this.state.notes.filter(note => note.id !== id) }));
	};

	stopAdding = () => {
		this.setState({
			addingNote: false
		})
	}

	deleteFolder = (folderId) => {
		fetch(`${API_ENDPOINT}api/folders/${folderId}`, {
			method: 'DELETE'
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(res.status)
				}
				return res.status;
			})
			.then(() => {

				const notes = this.state.notes.filter(note => parseInt(note.folder_id) !== parseInt(folderId));
				const folders = this.state.folders.filter(folder => parseInt(folder.id) !== parseInt(folderId))

				this.setState({
					notes,
					folders
				})
			})
	};

	render() {
		return (

			<NotefulContext.Provider value={{
				notes: this.state.notes,
				folders: this.state.folders,
				deleteNote: this.deleteNote,
				addFolder: this.addFolder,
				addNote: this.addNote,
				errors: this.state.errors,
				editNote: this.editNote,
				stopAdding: this.stopAdding,
				deleteFolder: this.deleteFolder

			}}>


				<div className="App">
					<div className="App-header">
						<Link to='/'>Noteful </Link>
						{this.state.errors && <p>{this.state.errors}</p>}

					</div>
					<ErrorBoundary>
						<div className='SideNav'>
							<Switch>
								<Route path='/notes/:noteId' render={(routeProps) => {
									const note = this.state.notes.find(note => note.id === parseInt(routeProps.match.params.noteId));
									if (note) {
										const folder = { ...this.state.folders.find(folder => folder.id === note.folder_id) };
										return (
											<div>
												<div>{folder.name}</div>
												<Link to={'/folders/' + folder.id}>Go Back To</Link>
											</div>)
									}
								}} />
								<Route path='/folders/:folderId'
									render={(routeProps) => <FolderList
										id={parseInt(routeProps.match.params.folderId)} />} />
								<Route exact path='/' render={(routeProps) => <FolderList />} />
							</Switch>
						</div>
						<div className='Main'>
							<Switch>
								<Route path='/notes/:noteId'
									render={(routeProps) =>
										<DetailedNote note={this.state.notes.find(note => note.id === parseInt(routeProps.match.params.noteId))} />
									}
								/>
								<Route path='/folders/:folderId'
									render={(routeProps) =>
										<NoteList folderId={parseInt(routeProps.match.params.folderId)} />
									}
								/>
								<Route exact path='/'
									render={() =>
										<NoteList />
									}
								/>
							</Switch>

							<button onClick={() => this.setState({ addingNote: true })}> Add Note</button>
							{this.state.addingNote && <AddNote />}

						</div>
					</ErrorBoundary>
				</div>

			</NotefulContext.Provider>

		)
	}
}

export default App;
