import React from 'react';

export default class Time extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span className="MineSweeper__time"> {this.props.time}</span>
    );
  }
}


