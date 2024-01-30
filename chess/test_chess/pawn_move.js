class Pawn {
    /**
   * 渡された駒とその位置から駒の移動可能範囲を返す
   * @param {Number} turn 先攻後攻どちらのターンか(チームを表す数値と同値)
   * @param {Object} map 現在のマップ 
   * @param {Object} team_map
   * @param {Number} x x座標
   * @param {Number} y y座標
   * @returns {Object} 駒が移動可能な範囲を示した配列 0:移動不可 1:移動可能
   */

    //turnが-1のときは porn,keima,kyousya,hu,kinの判定を反転
    move_able(turn, map, team_map, x, y) {
        let pawn = map[y][x];
        let cell_num = 9;
        let i = 0, j = 0;
        let able_map = new Array(cell_num).fill(0).map(() => new Array(cell_num).fill(0));
        let in_field = (y < cell_num && y >= 0) && (x < cell_num && x >= 0);

        team_map[y][x] = 0;

        function can_Move(x, y) {
            let cell_num = 9;
            if ((y < cell_num && y >= 0) && (x < cell_num && x >= 0)) {
                if (team_map[y][x] != turn) {
                    able_map[y][x] = 1;
                    return true;
                }
                return false;
            }
        }

        function isStop(x, y) {
            if (team_map[y][x] == -turn || team_map[y][x] == turn) {
                return true;
            }
            return false;
        }

        let rev_y = 1;      //チームによってyの変化量を反転する
        if (turn != 1) {
            rev_y *= -1;
        }

        switch (pawn) {
            case "c_King":
            case "s_King":
                for (i = y - 1; i < y + 1; y++) {
                    for (j = x - 1; j < x + 1; x++) {
                        can_Move(i, j);
                    }
                }

            case "Knight":

                can_Move(x + 1, y + 2);
                can_Move(x + 1, y - 2);
                can_Move(x - 1, y + 2);
                can_Move(x - 1, y - 2);
                can_Move(x + 2, y + 1);
                can_Move(x + 2, y - 1);
                can_Move(x - 2, y + 1);
                can_Move(x - 2, y - 1);

                break;

            case "Pawn":
                can_Move(x, y - rev_y);

                if ((x + 1) < cell_num && (y - rev_y) < cell_num && (y - rev_y) >= 0) {
                    if (team_map[y - rev_y][x + 1] == -turn) {
                        able_map[y - rev_y][x + 1] = 1;
                    }
                }
                if ((x - 1) < cell_num && (y - rev_y) < cell_num && (y - rev_y) >= 0) {
                    if (team_map[y - rev_y][x - 1] == -turn) {
                        able_map[y - rev_y][x - 1] = 1;
                    }
                }
                break;

            case "Bishop":
            case "Kaku":
                i = x; j = y;
                while (i < cell_num && j < cell_num) {    // 右斜め下
                    if (can_Move(i, j));
                    if (isStop(i, j)) {     //敵の駒の位置で終了
                        break;
                    }
                    i++; j++;
                }

                i = x; j = y;
                while (i >= 0 && j < cell_num) {          //左斜め下
                    if (can_Move(i, j));
                    if (isStop(i, j))      //敵の駒の位置で終了
                        break;
                    i--; j++;
                }

                i = x; j = y;
                while (i >= 0 && j >= 0) {                  //左斜め上
                    if (can_Move(i, j)) {
                        if (isStop(i, j))
                            break;
                    }
                    i--; j--;
                }

                i = x; j = y;
                while (i < cell_num && j >= 0) {                  //右斜め上
                    if (can_Move(i, j)) {
                        if (isStop(i, j))
                            break;
                    }
                    i++; j--;
                }
                break;

            case "Rook":
            case "Hisya":
                for (let i = x; i < cell_num; i++) {                   //右
                    if (team_map[y][i] == turn) {
                        console.log("right")
                        break;
                    } else {
                        able_map[y][i] = 1;
                        if (team_map[y][i] == -turn) {
                            break;
                        }
                    }
                }
                for (let i = x; i >= 0; i--) {                          //左
                    if (team_map[y][i] == turn) {
                        break;
                    } else {
                        able_map[y][i] = 1;
                        if (team_map[y][i] == -turn) {
                            break;
                        }
                    }
                }
                for (let j = y; j < cell_num; j++) {                    //下

                    if (team_map[j][x] == turn) {
                        break;
                    } else {
                        able_map[j][x] = 1;
                        if (team_map[j][x] == -turn) {
                            break;
                        }
                    }
                }
                for (let j = y; j >= 0; j--) {                          //上
                    console.log(team_map, j);
                    if (team_map[j][x] == turn) {
                        break;
                    } else {
                        able_map[j][x] = 1;
                        if (team_map[j][x] == -turn) {
                            break;
                        }
                    }
                }
                break;

            case "Kyousya":
                if (turn == 1) {
                    for (j = y - 1; y >= 0; y--) {
                        if (team_map[j][x] == turn) {
                            break;
                        } else {
                            able_map[j][x] = 1;
                            if (team_map[j][x] != -turn) {
                                break;
                            }
                        }
                    }
                } else {
                    for (j = y + 1; y < cell_num; y--) {
                        if (team_map[j][x] == turn) {
                            break;
                        } else {
                            able_map[j][x] = 1;
                            if (team_map[j][x] != turn) {
                                break;
                            }
                        }
                    }
                }
                break;

            case "Keima":
                if (turn == 1) {
                    if (team_map[y - (2 * rev_y)][x + 1] != turn) {
                        able_map[y - (2 * rev_y)][x + 1] = 1;
                    }
                    if (team_map[y - (2 * rev_y)][x - 1] != turn) {
                        able_map[y - (2 * rev_y)][x - 1] = 1;
                    }
                }
                break;

            case "Queen":
                for (i = x + 1; i < cell_num; i++) {                   //右
                    if (team_map[y][i] == turn) {
                        break;
                    } else {
                        able_map[y][i] = 1;
                        if (team_map[y][i] != turn) {
                            break;
                        }
                    }
                }

                for (i = x - 1; i >= 0; i--) {                          //左
                    if (team_map[y][i] == turn) {
                        break;
                    } else {
                        able_map[y][i] = 1;
                        if (team_map[y][i] != turn) {
                            break;
                        }
                    }
                }

                for (j = y + 1; y < cell_num; y++) {                    //下
                    if (team_map[j][x] == turn) {
                        break;
                    } else {
                        able_map[j][x] = 1;
                        if (team_map[j][x] != turn) {
                            break;
                        }
                    }
                }

                for (j = y - 1; y >= 0; y--) {                          //上
                    if (team_map[j][x] == turn) {
                        break;
                    } else {
                        able_map[j][x] = 1;
                        if (team_map[j][x] != turn) {
                            break;
                        }
                    }
                }

                i = x; j = y;
                while (i < cell_num && j < cell_num) {    // 右斜め下
                    if (team_map[j][i] == turn) {       //自陣の駒一歩手前で終了
                        break;
                    } else {
                        able_map[j][i] = 1;
                        if (team_map[j][i] != turn) {     //敵の駒の位置で終了
                            break;
                        }
                    }
                    i++; j++;
                }

                i = x; j = y;
                while (i >= 0 && j < cell_num) {          //左斜め下
                    if (team_map[j][i] == turn) {
                        break;
                    } else {
                        able_map[j][i] = 1;
                        if (team_map[j][i] != turn) {
                            break;
                        }
                    }
                    i--; j++;
                }

                i = x; j = y;
                while (i >= 0 && j >= 0) {                  //左斜め上
                    if (team_map[j][i] == turn) {
                        break;
                    } else {
                        able_map[j][i] = 1;
                        if (team_map[j][i] != turn) {
                            break;
                        }
                    }
                    i--; j--;
                }

                i = x; j = y;
                while (i < cell_num && j >= 0) {                  //右斜め上
                    if (team_map[j][i] == turn) {
                        break;
                    } else {
                        able_map[j][i] = 1;
                        if (team_map[j][i] != turn) {
                            break;
                        }
                    }
                    i--; j--;
                }
                break;

            case "Gin":

                if (team_map[y - rev_y][x] != turn) {
                    able_map[y - rev_y][x] = 1;
                }
                if (team_map[y - rev_y][x - 1] != turn) {
                    able_map[y - rev_y][x - 1] = 1;
                }
                if (team_map[y - rev_y][x + 1] != turn) {
                    able_map[y - rev_y][x + 1] = 1;
                }
                if (team_map[y + rev_y][x - 1] != turn) {
                    able_map[y + rev_y][x - 1] = 1;
                }
                if (team_map[y + rev_y][x + 1] != turn) {
                    able_map[y + rev_y][x + 1] = 1;
                }
                break;

            case "Kin":
            case "To":
            case "Narigin":
            case "Narikei":
            case "Narikyou":

                rev_y = 1;
                if (turn != 1) {
                    rev_y *= -1;
                }
                if (team_map[y - rev_y][x - 1] != turn) {
                    able_map[y - rev_y][x - 1] = 1;
                }
                if (team_map[y - rev_y][x] != turn) {
                    able_map[y - rev_y][x] = 1;
                }
                if (team_map[y - rev_y][x + 1] != turn) {
                    able_map[y - rev_y][x + 1] = 1;
                }
                if (team_map[y][x - 1] != turn) {
                    able_map[y][x - 1] = 1;
                }
                if (team_map[y][x + 1] != turn) {
                    able_map[y][x + 1] = 1;
                }
                if (team_map[y + rev_y][x] != turn) {
                    able_map[y + rev_y][x] = 1;
                }
                break;

            case "Ryuuou":
                for (i = x + 1; i < cell_num; i++) {                   //右
                    if (team_map[y][i] == turn) {
                        break;
                    } else {
                        able_map[y][i] = 1;
                        if (team_map[y][i] != turn) {
                            break;
                        }
                    }
                }

                for (i = x - 1; i >= 0; i--) {                          //左
                    if (team_map[y][i] == turn) {
                        break;
                    } else {
                        able_map[y][i] = 1;
                        if (team_map[y][i] != turn) {
                            break;
                        }
                    }
                }

                for (j = y + 1; y < cell_num; y++) {                    //下
                    if (team_map[j][x] == turn) {
                        break;
                    } else {
                        able_map[j][x] = 1;
                        if (team_map[j][x] != turn) {
                            break;
                        }
                    }
                }

                for (j = y - 1; y >= 0; y--) {                          //上
                    if (team_map[j][x] == turn) {
                        break;
                    } else {
                        able_map[j][x] = 1;
                        if (team_map[j][x] != turn) {
                            break;
                        }
                    }
                }

                if (team_map[y - 1][x - 1] != turn) {
                    able_map[y - 1][x - 1] = 1;
                }
                if (team_map[y - 1][x + 1] != turn) {
                    able_map[y - 1][x + 1] = 1;
                }
                if (team_map[y + 1][x + 1] != turn) {
                    able_map[y + 1][x + 1] = 1;
                }
                if (team_map[y + 1][x - 1] != turn) {
                    able_map[y + 1][x - 1] = 1;
                }
                break;

            case "Ryuuma":
                i = x; j = y;
                while (i < cell_num && j < cell_num) {    // 右斜め下
                    if (team_map[j][i] == turn && y == cell_num - 1 && x == 0) {       //自陣の駒一歩手前で終了
                        break;
                    } else {
                        able_map[j][i] = 1;
                        if (team_map[j][i] == -turn) {     //敵の駒の位置で終了
                            break;
                        }
                    }
                    i++; j++;
                }

                i = x; j = y;
                while (i >= 0 && j < cell_num) {          //左斜め下
                    if (team_map[j][i] == turn && y == cell_num - 1 && x == 0) {
                        break;
                    } else if (team_map[j][i] != turn) {
                        able_map[j][i] = 1;
                        if (team_map[j][i] == -turn) {
                            break;
                        }
                    }
                    i--; j++;
                }

                i = x; j = y;
                while (i >= 0 && j >= 0) {                  //左斜め上
                    if (team_map[j][i] == turn && y == 0 && x == 0) {
                        break;
                    } else {
                        able_map[j][i] = 1;
                        if (team_map[j][i] == -turn) {
                            break;
                        }
                    }
                    i--; j--;
                }

                i = x; j = y;
                while (i < cell_num && j >= 0) {                  //右斜め上
                    if (team_map[j][i] == turn && y == 0 && x == cell_num - 1) {
                        break;
                    } else {
                        able_map[j][i] = 1;
                        if (team_map[j][i] == -turn) {
                            break;
                        }
                    }
                    i--; j--;
                }

                if (team_map[y - 1][x] != turn && y != 0) {
                    able_map[y - 1][x] = 1;
                }
                if (team_map[y + 1][x] != turn && y != cell_num - 1) {
                    able_map[y + 1][x] = 1;
                }
                if (team_map[y][x - 1] != turn && x != 0) {
                    able_map[y][x - 1] = 1;
                }
                if (team_map[y][x + 1] != turn && y != cell_num - 1) {
                    able_map[y][x + 1] = 1;
                }
                break;
        }

        able_map[y][x] = 0;
        team_map[y][x] = turn;

        return able_map;
    }
}