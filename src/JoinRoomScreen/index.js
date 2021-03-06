import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.css';
import { JOIN_ROOM, PLAYER_JOINED } from '../store';

type State = {
  code: string, //?
  invalidCode: string
};

class JoinRoomScreen extends React.Component<Props, State> {

  componentDidMount() {
    if( this.props.socket === null ) return;

    this.props.socket.addEventListener('message', event => {
      const { op, payload } = JSON.parse(event.data);
      switch(op) {
        case 'PLAYER_JOINED':
          this.props.history.push('/lobby');
          this.props.player_joined(true);
          this.props.join_room({ code: this.state.code, player_number: 2 })
          break;
        case 'JOIN_ROOM_ERROR':
          this.setState({invalidCode : payload })
          break;
        default:
          break;
      }
    });
  }

  state = {
    code: '',
    invalidCode: null
  }

	join = () => {
    this.props.socket.send(JSON.stringify({ op: 'JOIN_ROOM', payload : this.state.code }));
    // if(this.state.code === 'xlrt') {
    //   this.props.history.push('/lobby');
    //   let data = { CODE: this.state.code, PLAYER_NUMBER: 2 };
    //   this.props.join_room(data)
    // } else {
    //   this.setState({ invalidCode: true });
    // }
  }

  setCode = (e) => {
    this.setState({ invalidCode: null });
    this.setState({ code: e.target.value });
  }

  render() {
    if(this.props.socket === null) return <Redirect to='/' />;

    let content = null;

    if(this.state.code.length === 4) {
      content = <div className="code-area"> 
        <div className="code">
          <input value={ this.state.code } onChange={ this.setCode.bind(this) } />
          { this.state.invalidCode !== null ? <p className="error-message">{ this.state.invalidCode }</p> : '' }
        </div>
        <button className="button join-button" type="button" onClick={ this.join }>Join</button>
      </div>
    } else {
      content = <div className="code-area">
        <p>Enter code from Player 1:</p>
        <div className="code">
          <input placeholder="Enter Code Here" onChange={ this.setCode.bind(this) } />
        </div>
      </div>
    }

    return (
    	<div className="join-room-screen screen">
        <div className="container">
    		  <h1>Ready?</h1>
          <p className="subtitle">Looking for opponent...</p>
          <div className="player-ready"><span>i'm looking for player 1</span></div>
    		  { content }
          <Link className='exit-button' to='/'>&#8249; Exit</Link>
        </div>
    	</div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    join_room: data => {
      dispatch({ type: JOIN_ROOM, code: data.CODE, player_number: data.PLAYER_NUMBER });
    },
    player_joined: joined => {
      dispatch({ type: PLAYER_JOINED, joined });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedJoinRoom = connect(mapStateToProps, mapDispatchToProps)(JoinRoomScreen);
export default ConnectedJoinRoom;