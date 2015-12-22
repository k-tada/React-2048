import React from 'react';

export default class Cell extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var count = this.props.cell.count > 0 ? Math.pow(2, this.props.cell.count) : 0;
    var divCls = "Cell__number" + count;
    return (
      <td className="Cell">
        <div className={divCls}>
          <span> {count} </span>
        </div>
      </td>
    );
  }
}
