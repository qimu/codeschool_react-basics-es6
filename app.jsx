const PLAYERS = [
  {
    name: "Qi",
    score: 200,
    id: 0
  },
  {
    name: "John",
    score: 300,
    id: 1
  }
]

var nextId = 2;

const Stats = (props) => {
  var totalPlayers = props.players.length;
  var totalScore = props.players.reduce((total, player) => {
    return total += player.score;
  }, 0);

  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total score:</td>
          <td>{totalScore}</td>
        </tr>
      </tbody>
    </table>
  )
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired
}

class StopWatch extends React.Component {

  constructor() {
    super();
    this.state = {
      running: false,
      elapsedTime: 0,
      previousTime: 0
    }

    this.onTick = this.onTick.bind(this);
  }

  onTick() {
    if (this.state.running) {
      var newEt = this.state.elapsedTime + (Date.now() - this.state.previousTime)
      this.setState({previousTime:Date.now(), elapsedTime: this.state.elapsedTime + (Date.now() - this.state.previousTime)});
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.onTick, 100);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  onStop() {
    this.setState({running: false})
  }
  onStart() {
    this.setState({
      running: true,
      previousTime: Date.now()
    })
  }
  onReset() {
    this.setState({elapsedTime: 0})
  }
  render() {
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{Math.floor(this.state.elapsedTime / 1000)}</div>
        { this.state.running ?
          <button onClick={this.onStop.bind(this)}>Stop</button>
          :
          <button onClick={this.onStart.bind(this)}>Start</button>
        }
        <button onClick={this.onReset.bind(this)}>Reset</button>
      </div>
    )
  }
}

const Header = (props) => {
  return (
    <div className="header">
      <Stats players={props.players}/>
      <h1>{props.title}</h1>
      <StopWatch />
    </div>
  )
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired
}

const Counter = (props) => {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={ () => { props.onChange(-1) } }> - </button>
      <div className="counter-score"> {props.score} </div>
      <button className="counter-action increment" onClick={ () => { props.onChange(1) } }> + </button>
    </div>
  )
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

const Player = (props) => {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>X</a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={ props.onScoreChange } />
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired
};

class AddNewPlayerForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: ""
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
  }

  onChange(e) {
    var name = e.target.value;
    this.setState({name: name});
  }

  render() {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" value={this.state.name} onChange={this.onChange.bind(this)} />
          <input type="submit" value="Add Player"/>
        </form>
      </div>
    )
  }

}

AddNewPlayerForm.propTypes = {
  onAdd: React.PropTypes.func.isRequired
}

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: this.props.initialPlayers
    }
  }
  onPlayerChange(player, index, delta) {
    player.score += delta;
    this.state[index] = player;
    this.setState(this.state)
  }
  onAddPlayer(name) {
    var newPlayer = {
      name: name,
      score: 0,
      id: nextId
    }
    nextId += 1;
    this.state.players.push(newPlayer);
    this.setState(this.state);
  }
  onRemovePlayer(index) {
    this.state.players.splice(index, 1);
    this.setState(this.state);
  }
  render() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players}/>

        <div className="players">
          {this.state.players.map((player, index) => {
            return (
              <Player
                name={player.name}
                score={player.score}
                key={player.id}
                onScoreChange={ (delta) => { this.onPlayerChange(player, index, delta) } }
                onRemove={ () => { this.onRemovePlayer(index) }.bind(this) }
                />
            )
          })}
        </div>
        <AddNewPlayerForm onAdd={this.onAddPlayer.bind(this)}/>
      </div>
    )
  }
}

Application.propTypes = {
  title: React.PropTypes.string,
  initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    score: React.PropTypes.number
  }))
}

Application.defaultProps = {
  title: "Qi's scoreboard"
}

ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));
