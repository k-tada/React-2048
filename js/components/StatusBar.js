import React from 'react';
import Score from './status_bar/Score.js'
// import Face from './status_bar/Reset.js'

export default class StatusBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="GameBoard__StatusBar">
        <Score score={this.props.score} />
      </div>
    );
  }
}

