import React from 'react';

export default class Score extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="GameBoard__StatusBar GameBoard__StatusBar__Score">
        <span>Score: {this.props.score}</span>
      </div>
    );
  }
}


