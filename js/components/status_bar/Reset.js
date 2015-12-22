import React from 'react';

export default class Score extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span className="GameBoard__face" onClick={this.props.reset.bind(this)}>
        <span className={"button " + this.props.status}></span>
      </span>
    );
  }
}


