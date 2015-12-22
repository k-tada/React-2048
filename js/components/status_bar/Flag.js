import React from 'react';

export default class Flag extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span className="MineSweeper__flagNum"> {this.props.num}</span>
    );
  }
}


