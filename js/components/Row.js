import React from 'react';
import Cell from './Cell.js';

export default class Row extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    var Cells = this.props.cells.map((cell, i) => {
      return(
        <Cell key={"cell" + i} cell={cell} />
      );
    });
    return (
      <tr>
        {Cells}
      </tr>
    );
  }
}
