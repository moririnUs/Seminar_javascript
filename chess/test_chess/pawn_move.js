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
            }else{
            return false;
        }}

        let rev_y = turn;      //チームによってyの変化量を反転する

        switch (pawn) {
            case "c_King":
            case "s_King":
                for (i = y - 1; i <= y + 1; i++) {
                    for (j = x - 1; j <= x + 1; j++) {
                        can_Move(j, i);
                    }
                }
                break;

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

            case "Hu":
                can_Move(x, y - rev_y);
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
                    if (can_Move(i, j)){
                    if (isStop(i, j)) {     //敵の駒の位置で終了
                        break;
                    }
                    i++; j++;}else{
                        break;
                    }
                }

                i = x; j = y;
                while (i >= 0 && j < cell_num) {          //左斜め下
                    if (can_Move(i, j)){
                    if (isStop(i, j))      //敵の駒の位置で終了
                        break;
                    i--; j++;
                }else{
                     break;
                }}

                i = x; j = y;
                while (i >= 0 && j >= 0) {                  //左斜め上
                    if (can_Move(i, j)) {
                        if (isStop(i, j))
                            break;
                    
                    i--; j--;
                    }else{
                        break;
                    }}

                i = x; j = y;
                while (i < cell_num && j >= 0) {                  //右斜め上
                    if (can_Move(i, j)) {
                        if (isStop(i, j))
                            break;
                    
                    i++; j--;
                    }else{
                        break;
                    }}
                break;

            case "Rook":
            case "Hisya":
                for (let i = x; i < cell_num; i++) {                   //右
                    if (can_Move(i, y)) {
                        if (isStop(i, y))
                            break;
                    }else{
                        break;
                    }
                }
                for (let i = x; i >= 0; i--) {                          //左
                    if (can_Move(i, y)) {
                        if (isStop(i, y))
                            break;
                    }else{
                        break;
                    }
                }
                for (let j = y; j < cell_num; j++) {                    //下
                    if (can_Move(x, j)) {
                        if (isStop(x, j))
                            break;
                    }else{
                        break;
                    }
                }
                for (let j = y; j >= 0; j--) {                          //上
                    if (can_Move(x, j)) {
                        if (isStop(x, j))
                            break;
                    }else{
                        break;
                    }
                }
                break;

            case "Kyousya":
                if (turn == 1) {
                    for (let j = y; j >= 0; j--) {
                        if (can_Move(x, j)) {
                            if (isStop(x, j))
                                break;
                        }else{
                            break;
                        }
                    }
                } else {
                    for (let j = y + 1; j < cell_num; j--) {
                        if (can_Move(x, j)) {
                            if (isStop(x, j))
                                break;
                        }else{
                            break;
                        }
                    }
                }
                break;

            case "Keima":
                can_Move(x + 1, y - (2 * rev_y));
                can_Move(x - 1, y - (2 * rev_y));

                break;

            case "Queen":
                for (let i = x; i < cell_num; i++) {                   //右
                    if (can_Move(i, y)) {
                        if (isStop(i, y))
                            break;
                    }else{
                        break;
                    }
                }
                for (let i = x; i >= 0; i--) {                          //左
                    if (can_Move(i, y)) {
                        if (isStop(i, y))
                            break;
                    }else{
                        break;
                    }
                }
                for (let j = y; j < cell_num; j++) {                    //下
                    if (can_Move(x, j)) {
                        if (isStop(x, j))
                            break;
                    }else{
                        break;
                    }
                }
                for (let j = y; j >= 0; j--) {                          //上
                    if (can_Move(x, j)) {
                        if (isStop(x, j))
                            break;
                    }else{
                        break;
                    }
                }

                i = x; j = y;
                while (i < cell_num && j < cell_num) {    // 右斜め下
                    if (can_Move(i, j)){
                    if (isStop(i, j)) {     //敵の駒の位置で終了
                        break;
                    }
                    i++; j++;}else{
                        break;
                    }
                }

                i = x; j = y;
                while (i >= 0 && j < cell_num) {          //左斜め下
                    if (can_Move(i, j)){
                    if (isStop(i, j))      //敵の駒の位置で終了
                        break;
                    i--; j++;
                }else{
                     break;
                }}

                i = x; j = y;
                while (i >= 0 && j >= 0) {                  //左斜め上
                    if (can_Move(i, j)) {
                        if (isStop(i, j))
                            break;
                    
                    i--; j--;
                    }else{
                        break;
                    }}

                i = x; j = y;
                while (i < cell_num && j >= 0) {                  //右斜め上
                    if (can_Move(i, j)) {
                        if (isStop(i, j))
                            break;
                    
                    i++; j--;
                    }else{
                        break;
                    }}
                break;

            case "Gin":
                can_Move(x, y - rev_y);
                can_Move(x - 1, y - rev_y);
                can_Move(x + 1, y - rev_y);
                can_Move(x - 1, y + rev_y);
                can_Move(x + 1, y + rev_y);
                break;

            case "Kin":
            case "To":
            case "Narigin":
            case "Narikei":
            case "Narikyou":
                can_Move(x, y - rev_y);
                can_Move(x, y + rev_y);
                can_Move(x - 1, y - rev_y);
                can_Move(x + 1, y - rev_y);
                can_Move(x - 1, y);
                can_Move(x + 1, y);

                break;

            case "Ryuuou":
                for (let i = x; i < cell_num; i++) {                   //右
                    if (can_Move(i, y)) {
                        if (isStop(i, y))
                            break;
                    }
                }
                for (let i = x; i >= 0; i--) {                          //左
                    if (can_Move(i, y)) {
                        if (isStop(i, y))
                            break;
                    }
                }
                for (let j = y; j < cell_num; j++) {                    //下
                    if (can_Move(x, j)) {
                        if (isStop(x, j))
                            break;
                    }
                }
                for (let j = y; j >= 0; j--) {                          //上
                    if (can_Move(x, j)) {
                        if (isStop(x, j))
                            break;
                    }
                }

                can_Move(x-1,y-1);
                can_Move(x-1,y+1);
                can_Move(x+1,y-1);
                can_Move(x+1,y+1);
                break;

            case "Ryuuma":
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
                can_Move(x,y-1);
                can_Move(x,y+1);
                can_Move(x+1,y);
                can_Move(x-1,y);
                break;
        }

        able_map[y][x] = 0;
        team_map[y][x] = turn;

        return able_map;
    }
}