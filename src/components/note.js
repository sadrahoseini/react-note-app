import React from 'react'
import Icon from './icon'
import Draggable from 'react-draggable'

class Note extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newText: this.props.text,
            lastX: this.props.x,
            lastY: this.props.y
        }
    }

    cardStyles = () => {
        return {
            zIndex: this.props.index
        }
    }

    pin = () => {
        if (this.props.onPinChange)
            this.props.onPinChange(this.props.id, true)
    }

    unpin = () => {
        if (this.props.onPinChange)
            this.props.onPinChange(this.props.id, false)
    }

    edit = () => {
        if (this.props.onEdit)
            this.props.onEdit(this.props.id, true)
        this.setState({ newText: this.props.text })
    }

    cancel = () => {
        if (this.props.onEdit)
            this.props.onEdit(this.props.id, false)
    }

    save = () => {
        console.log(this.state.newText);
        if (this.props.onSave)
            this.props.onSave(this.props.id, this.state.newText)
    }

    remove = () => {
        if (this.props.onRemove)
            this.props.onRemove(this.props.id)
    }

    handleTextChange = (e) => {
        this.setState({ newText: e.target.value })
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey)
            this.save()
    }

    handleDragStart = (e, element) => {
        if (this.props.onDragStart)
            this.props.onDragStart(this.props.id)
        this.setState({lastX: element.x, lastY: element.y})
    }

    handleDragStop = (e, element) => {
        let diffX = element.x - this.state.lastX;
        let diffY = element.y - this.state.lastY ;
        if (this.props.onDragStop)
            this.props.onDragStop(this.props.id, this.props.x + diffX, this.props.y + diffY)
        this.setState({lastX: element.x, lastY: element.y})   
    }

    render() {
        return (
            <Draggable
                disabled={this.props.editable || this.props.pined}
                position={{x:this.state.lastX, y: this.state.lastY}}
                onStart={this.handleDragStart}
                onStop={this.handleDragStop}>
                <div className={`note ${this.props.color}`} style={ this.cardStyles() }>
                    <Icon name="trash" key="trash" className="red" onClick={ this.remove }/>
                    {
                        this.props.pined 
                            ? <Icon name="pin_solid" key="pin_solid" className="red" onClick={ this.unpin }/>
                            : <Icon name="pin" key="pin" className="blue" onClick={ this.pin }/>
                    }
                    {
                        this.props.editable
                            ? (<>
                                <textarea 
                                    name="text"
                                    onChange={this.handleTextChange}
                                    onKeyDown={this.handleKeyDown}
                                    placeholder="Please type something"
                                    defaultValue={this.state.newText}/>
                                <Icon name="check" width="22" key="check" className="green" onClick={ this.save }/>
                                <Icon name="times" width="22" key="times" className="red" onClick={ this.cancel }/>
                            </>)
                            : (<>
                                <p className="text">{this.props.text}</p>
                                <Icon name="pencil" key="pencil" className="blue" onClick={ this.edit }/>
                            </>)

                    }
                </div>
            </Draggable>
        )
    }
}

export default Note