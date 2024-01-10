class Pawn {
    /**
   * 渡された駒とその位置から駒の移動可能範囲を返す
   * @param {Number} turn 先攻後攻どちらのターンか(チームを表す数値と同値)
   * @param {Object} map 現在のマップ 
   * @param {Number} x x座標
   * @param {Number} y y座標
   * @returns {Object} 駒が移動可能な範囲を示した配列 0:移動不可 1:移動可能
   */
    move_able(turn, map, x, y) {

        let pawn = map[y][x];

        let Knight = [    //"Knight"の移動可能範囲
            [y + 2][x + 1],
            [y + 1][x + 2],
            [y - 1][x + 2],
            [y - 2][x + 1],
            [y - 2][x - 1],
            [y - 1][x - 2],
            [y + 1][x - 2],
            [y + 2][x - 1]
        ]
        let cell_num = 9;
        let i = 0, j = 0;
        let able_map = new Array(cell_num).fill(0).map(() => new Array(cell_num).fill(0));

        switch (pawn) {
            case "c_King":
            case "s_King":
                for (i = y - 1; i < y + 1; y++) {
                    for (j = x - 1; j < x + 1; x++) {
                        if (i == y && j == x || team_map[i][j] != turn) {   //自身の位置以外3*3マス
                        } else {
                            able_map[i][j] == 1;
                        }
                    }
                }

            case "Knight":
                for (i = 0; i < 8; i++) {
                    if (team_map[Knight[i]] != turn) {
                        able_map[Knight[i]] = 1;
                    }
                }

            case "Pawn":                      //メモ:敵味方で上下が反転するが、最終的な走査ののちy成分となるindexを最大値から引くことでこれを実現する
                if (team_map[y - 1][x] == 0) {
                    able_map[i - 1][j] = 1;
                }
                if (team_map[y - 1][x + 1] == -turn) {
                    able_map[y - 1][x + 1] = 1;
                }
                if (team_map[y - 1][x - 1] == -turn) {
                    able_map[y - 1][x - 1] = 1;
                }

            case "Bishop":
            case "Kaku":
                i = x + 1; j = y + 1;
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

                i = x - 1; j = y + 1;
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

                i = x - 1; j = y - 1;
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

                i = x + 1; j = y - 1;
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

            case "Rook":
            case "Hisya":
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

            case "Kyousya":
                for (j = y - 1; y >= 0; y--) {
                    if (team_map[j][x] == turn) {
                        break;
                    } else {
                        able_map[j][x] = 1;
                        if (team_map[j][x] != turn) {
                            break;
                        }
                    }
                }

            case "Keima":
                if (team_map[y - 2][x + 1] != turn) {
                    able_map[y - 2][x + 1] = 1;
                }
                if (team_map[y - 2][x - 1] != turn) {
                    able_map[y - 2][x - 1] = 1;
                }

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

                i = x + 1; j = y + 1;
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

                i = x - 1; j = y + 1;
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

                i = x - 1; j = y - 1;
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

                i = x + 1; j = y - 1;
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

            case "Gin":
                if (team_map[y - 1][x] != turn) {
                    able_map[y - 1][x] = 1;
                }
                if (team_map[y - 1][x - 1] != turn) {
                    able_map[y - 1][x - 1] = 1;
                }
                if (team_map[y - 1][x + 1] != turn) {
                    able_map[y - 1][x + 1] = 1;
                }
                if (team_map[y + 1][x - 1] != turn) {
                    able_map[y + 1][x - 1] = 1;
                }
                if (team_map[y + 1][x + 1] != turn) {
                    able_map[y + 1][x + 1] = 1;
                }

            case "Kin":
            case "To":
            case "Narigin":
            case "Narikei":
            case "Narikyou":
                if (team_map[y - 1][x - 1] != turn) {
                    able_map[y - 1][x - 1] = 1;
                }
                if (team_map[y - 1][x] != turn) {
                    able_map[y - 1][x] = 1;
                }
                if (team_map[y - 1][x + 1] != turn) {
                    able_map[y - 1][x + 1] = 1;
                }
                if (team_map[y][x - 1] != turn) {
                    able_map[y][x - 1] = 1;
                }
                if (team_map[y][x + 1] != turn) {
                    able_map[y][x + 1] = 1;
                }
                if (team_map[y + 1][x] != turn) {
                    able_map[y + 1][x] = 1;
                }

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

            case "Ryuuma":
                i = x + 1; j = y + 1;
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

                i = x - 1; j = y + 1;
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

                i = x - 1; j = y - 1;
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

                i = x + 1; j = y - 1;
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

                if(team_map[y-1][x] != turn){
                    able_map[y-1][x] =1;
                }
                if(team_map[y+1][x] != turn){
                    able_map[y+1][x] =1;
                }
                if(team_map[y][x-1] != turn){
                    able_map[y][x-1] =1;
                }
                if(team_map[y][x+1] != turn){
                    able_map[y][x+1] =1;
                }
        }
        return able_map;
    }
}