import React from 'react';
import Note from './note';
import Icon from './icon';

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nextId: 0,
            notes: [],
        }
    }

    componentDidMount() {
        let notes = this.getNotes();
        let nextId = localStorage.getItem('nextId')
        nextId = nextId ? Number.parseInt(nextId) : 1;
        this.setState({notes, nextId})
    }

    getNotes = () => {
        let notes = localStorage.getItem('notes');
        if (notes)
            return JSON.parse(notes);
        else
            return [];
    }

    saveData = () => {
        let notes = JSON.stringify(this.state.notes)
        localStorage.setItem('notes', notes)
        localStorage.setItem('nextId', this.state.nextId)
    }

    edit = (id, editable) => {
        let notes = this.state.notes.map(note => {
            return note.id === id ? 
                {
                    ...note,
                    editable
                } : note
        })

        this.setState(() => ({notes}), () => this.saveData())
    }

    pinChanged = (id, pined) => {
        let notes = this.state.notes.map(note => {
            return note.id === id ? 
                {
                    ...note,
                    pined
                } : note
        })

        this.setState(() => ({notes}), () => this.saveData())
    }

    update = (id, newText) => {
        let notes = this.state.notes.map(note => {
            return note.id === id ? 
                {
                    ...note,
                    text: newText,
                    editable: false
                } : note
        })
        this.setState(() => ({notes}), () => this.saveData())
    }

    remove = (id) => {
        let notes = this.state.notes.filter(note => note.id !== id)
        this.setState(() => ({notes}), () => this.saveData())
    }

    add = () => {
        let notes = this.state.notes
        notes.push({
            id: this.state.nextId,
            text: '',
            x: this.randomPosition('x'),
            y: this.randomPosition('y'),
            pined: false,
            editable: true,
            color: this.randomNoteColor()
        })
        this.setState((prevState) => ({
            notes, nextId: prevState.nextId + 1
        }), () => this.saveData())
    }

    clear = () => {
        let notes = [];
        this.setState(() => ({
            notes, nextId: 1
        }), () => this.saveData())
    }

    randomPosition = (dir) => {
        let min = 20;
        let max = dir === 'x' ? Math.floor(window.innerWidth - 270) : Math.floor(window.innerHeight - 270);
        return Math.floor(Math.random() * (max - min) + min);
    }

    randomNoteColor = () => {
        let colors = ['blue', 'yellow', 'green', 'red'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    dragStart = (id) => {
        console.log('drag start');
        let notes = this.state.notes;
        let index = notes.findIndex(note => note.id === id)
        let note = notes[index];
        notes.splice(index, 1);
        notes.push(note);
        this.setState(() => ({notes}), () => this.saveData())
    }

    dragStop = (id, x, y) => {
        console.log('drag stop');
        let notes = this.state.notes.map(note => {
            return note.id === id ? 
                {
                    ...note,
                    x,
                    y
                } : note
        })

        this.setState(() => ({notes}), () => this.saveData())
    }

    render() {
        return (
            <div className="board">
                {
                    this.state.notes &&
                    this.state.notes.length > 0 &&
                    this.state.notes.map((note, index) => {
                        return (
                            <Note 
                                index={index}
                                id={note.id}
                                text={note.text} 
                                x={note.x} 
                                y={note.y} 
                                color={note.color} 
                                pined={note.pined} 
                                editable={note.editable} 
                                key={note.id}
                                onEdit={this.edit}
                                onPinChange={this.pinChanged}
                                onSave={this.update}
                                onRemove={this.remove}
                                onDragStart={this.dragStart}
                                onDragStop={this.dragStop}/>
                        )
                    })
                }
                <div className="add-btn" onClick={this.add}>
                    <Icon name="plus"/>
                </div>
                <div className="clear-btn" onClick={this.clear}>
                    <Icon name="trash"/>
                </div>
            </div>
        )
    }
}

export default Board;