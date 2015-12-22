import React from 'react';
import Table from './Table.js';
import StatusBar from './StatusBar.js';
import update from 'react-addons-update';

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      size: [4, 4],
      maxSpawnNum: 2,
      maxSpawnPow: 2,
      operation: 0,
      status: 'playing'
    };
  }

  gameOver() {
    this.setState({status: "gameover"});
  }

  reset(){
  }

  addScore(score) {
    var score = this.state.score + Math.pow(2, score);
    this.setState({
      score: score,
      operation: 0
    });
  }

  up()    { this.setState({ operation: 1 }) }
  down()  { this.setState({ operation: 2 }) }
  left()  { this.setState({ operation: 3 }) }
  right() { this.setState({ operation: 4 }) }

  render() {
    return (
      <div className="GameBoard">
        <StatusBar status={this.state.status} score={this.state.score} reset={this.reset.bind(this)} />
        <table>
          <tbody>
            <tr>
              <td></td>
              <td className="GameBoard__controller GameBoard__controller__up" onClick={this.up.bind(this)}>↑</td>
              <td></td>
            </tr>
            <tr>
              <td className="GameBoard__controller GameBoard__controller__left" onClick={this.left.bind(this)}>←</td><td>
                <Table size={this.state.size}
                       maxSpawnNum={this.state.maxSpawnNum}
                       maxSpawnPow={this.state.maxSpawnPow}
                       operation={this.state.operation}
                       addScore={this.addScore.bind(this)}
                       gameOver={this.gameOver.bind(this)}
                />
              </td>
              <td className="GameBoard__controller GameBoard__controller__right" onClick={this.right.bind(this)}>→</td>
            </tr>
            <tr>
              <td></td>
              <td className="GameBoard__controller GameBoard__controller__down" onClick={this.down.bind(this)}>↓</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
