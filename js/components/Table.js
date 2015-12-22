import React from 'react';
import Row from './Row.js';
import update from 'react-addons-update';

export default class Table extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows : this.createTable(props)
    };
    this._state = {};
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.operation == 5 ) {
      this.setState({
        rows: this.createTable(nextProps)
      });
    } else if ( nextProps.operation > 0 && nextProps.operation < 5 ) {
      this.move( nextProps.operation );
    }
  }

  createTable(props) {
    var table = [];
    for(var row = 0; row < props.size[0]; row++){
      table.push([]);
      for(var col = 0; col < props.size[1]; col++){
        table[row].push({ x: col, y: row, count: 0, united: false });
      }
    }

    this.spawn(table);
    return table;
  }

  spawn(table) {
    var spawnables = this.getSpawnableCells(table);

    if (spawnables.length > 0) {
      var spawnNum = this.getRandomInt(1, this.props.maxSpawnNum);
      if (spawnables.length < spawnNum) {
        spawnNum = spawnables.length;
      }
      for(var i = 0; i < spawnNum; i++){
        var point = spawnables[this.getRandomInt(0, spawnables.length - 1)];
        var cell = table[point.y][point.x];
        cell.count = this.getRandomInt(1, this.props.maxSpawnPow);
      }
    }
  }

  move(operation) {
    this._state.rows = update(this.state.rows, {0: {0: {x: {$set: 0}}}});
    if (operation == 1 || operation == 3) {
      this.doInTable((r, c) => {
        this._move(r, c, operation);
      });
    } else if (operation == 2 || operation == 4) {
      // 下、右の場合は逆順に見ていく
      this.doInTable((r, c) => {
        this._move(r, c, operation);
      }, true);
    }

    // 4. spawn
    this.spawn(this._state.rows);

    // 5. 上下左右に動かせるかチェック
    var judged = this.judge(this._state.rows);
    console.log(judged);

    // 6. 5のチェック結果がNGの場合はゲーム終了

    // unitedフラグをクリア
    this.doInTable((r, c) => {
      this._state.rows[r][c].united = false;
    });

    this.setState({rows : this._state.rows});
  }

  _move(r, c, operation) {
    var cell = this._state.rows[r][c];
    if (cell.count == 0 || ! this.inMovableRange(cell, operation)) { return; }

    // 各数字を上に押し上げる
    var comp = {};
    while(this.canMove(cell, operation)) {
      var forward = this.getForward(cell.x, cell.y, operation);
      comp = this._state.rows[forward.y][forward.x];
      // console.log('move cell['+cell.y+','+cell.x+'] to ['+comp.y+','+comp.x+']')
      comp.count = cell.count;
      cell.count = 0;
      cell = comp;
    }

    // 同じ数字の場合は足す
    var score = this.unite(cell, operation);

    // 足した数字をscoreに足す
    if (score > 0) {
      this.props.addScore(score);
    }
  }

  inField(cell) {
    return cell.x >= 0 && cell.x < this.props.size[1] && cell.y >= 0 && cell.y < this.props.size[0];
  }

  inMovableRange(cell, operation) {
    if (operation == 1) {
      // up
      return cell.y > 0;
    } else if (operation == 2) {
      // down
      return cell.y < this.props.size[0] - 1;
    } else if (operation == 3) {
      // left
      return cell.x > 0;
    } else if (operation == 4) {
      // right
      return cell.x < this.props.size[1] - 1;
    } else {
      return false;
    }
  }

  unite(cell, operation) {
    var forward = this.getForward(cell.x, cell.y, operation);
    if ( ! this.inField(forward) || ! this.canUnite(cell, this._state.rows[forward.y][forward.x], operation)) {
      return;
    }
    if ( cell.united || this._state.rows[forward.y][forward.x].united ) {
      return;
    }
    this._state.rows[forward.y][forward.x].count += 1;
    this._state.rows[forward.y][forward.x].united = true;
    cell.count = 0;
    return this._state.rows[forward.y][forward.x].count;
  }

  canUnite(cell, comp, operation) {
    return this.inMovableRange(cell, operation) && cell.count == comp.count;
  }

  canMove(cell, operation) {
    var forward = this.getForward(cell.x, cell.y, operation);
    if ( ! this.inField(forward)) {
      return false;
    }
    return this.inMovableRange(cell, operation) && this._state.rows[forward.y][forward.x].count == 0;
  }

  getForward(x, y, operation) {
    if (operation == 1) {
      // move up
      return { x: x, y: y - 1 };
    } else if (operation == 2) {
      // move down
      return { x: x, y: y + 1 };
    } else if (operation == 3) {
      // move left
      return { x: x - 1, y: y };
    } else if (operation == 4) {
      // move right
      return { x: x + 1, y: y };
    } else {
      return [x, y];
    }
  }

  doInTable(cb, reverse) {
    if (reverse) {
      for (var r = this.props.size[0] - 1; r >= 0; r--) {
        for (var c = this.props.size[1] - 1; c >= 0; c--) {
          cb(r, c);
        }
      }
    } else {
      for (var r = 0; r < this.props.size[0]; r++) {
        for (var c = 0; c < this.props.size[1]; c++) {
          cb(r, c);
        }
      }
    }
  }

  getSpawnableCells(table) {
    var spawnables = [];

    this.doInTable((r, c) => {
      if (table[r][c].count == 0) {
        spawnables.push({x: c, y: r});
      }
    });

    return spawnables;
  }

  getUnitableCells(table) {
    var unitables = [];

    this.doInTable((r, c) => {
      // 上下左右に同じ値のセルが居ないか確認する
      for (var o = 1; o <= 4; o++) {
        var f = this.getForward(c, r, o);
        if (f.x > 0 && f.x < this.props.size[1] &&
            f.y > 0 && f.y < this.props.size[0] &&
            table[r][c].count == table[f.y][f.x].count
        ) {
          unitables.push({x: c, y: r});
          break;
        }
      }
    });

    return unitables;
  }

  getRandomInt(min, max) {
    return Math.floor( Math.random() * ( max - min + 1 )) + min;
  }

  // true: game clear, false: game over, null: continue
  judge(table) {
    // 2048になっているセルがあればゲームクリア
    var gameCleared = false;
    this.doInTable(function(r, c) {
      if (table[r][c].count > 10) {
        gameCleared = true;
      }
    });
    if (gameCleared) {
      return true;
    }

    // スポーン出来るセルが無く、統合出来るセルもない場合はゲームオーバー
    var spawnables = this.getSpawnableCells(table);
    var unitables = this.getUnitableCells(table);
    if (spawnables.length <= 0 && unitables.length <= 0) {
      return false;
    }

    return null;
  }

  render() {
    var Rows = this.state.rows.map((row, i) => {
      return(
        <Row key={"row" + i} cells={row} />
      );
    });
    return(
      <table className="Table">
        <tbody>
          {Rows}
        </tbody>
      </table>
    );
  }
}
