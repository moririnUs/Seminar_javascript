(function (global) {
  "use strict";

  function Game() { }

  global.Game = Game;
  global.Game.initGame = initgame;

  let cell_num = 9;  //マス数
  let ctx;            //キャンバス要素
  let evented = false;//イベントが設定されているか
  let state = {};     //現在の状態
  let point = {        //マウスカーソルの座標
    x: 0,
    y: 0
  }
  let map = new Array(cell_num).fill(0).map(() => new Array(cell_num).fill(0));       //0か文字列(駒の種類)が格納されている
  let team_map = new Array(cell_num).fill(0).map(() => new Array(cell_num).fill(0));  // どの場所にどちらのチームの駒があるかを示している
  let pawns_num = 18;
  let chess_pawns = [ //King:1 Queen:1 Pawn:8 Rook:2 Bishop:2 Knight:2
    "c_King",
    "Queen",
    "Pawn",
    "Pawn",
    "Pawn",
    "Pawn",
    "Pawn",
    "Pawn",
    "Pawn",
    "Pawn",
    "Rook",
    "Rook",
    "Bishop",
    "Bishop",
    "Knight",
    "Knight"
  ]

  let shogi_pawns = [ //King:1 Hu:9 Hisya:1 Kaku:1 Keima:2 Kyousya:2 Gin:2 Kin:2
    "s_King",
    "Hu",
    "Hu",
    "Hu",
    "Hu",
    "Hu",
    "Hu",
    "Hu",
    "Hu",
    "Hu",
    "Hisya",
    "Kaku",
    "Keima",
    "Keima",
    "Kyousya",
    "Kyousya",
    "Gin",
    "Gin",
    "Kin",
    "Kin"
  ]
  let ex_shogi_pawns = {
    1: "To",
    2: "Ryuuou",
    3: "Ryuuma",
    4: "Narikei",
    5: "Narikyou",
    6: "Narigin"
  }

  function setEvents() {

  }

  function initGame(_ctx) {
    ctx = _ctx;
    state = objCopy(init_state);
    if (!evented) {     //イベントを登録していないとき
      evented = true;
      setEvents();    //イベント呼び出し
    }
    Render.render(ctx, state, point);
  }

  function ev_mouseClick(e) {
    let selected = hitTest(point.x, point.y);
    let number = selected.value;
  }
  /**
   * ランダムに駒を配置する関数です。
   * @returns {Object} 駒を格納した配列=>文字列or0
   */
  function random_pawn() {
    let pawns = [];
    /**@param i 現在のpawnsの要素数*/
    let i = 0;

    let king = Math.random() * 3;
    //配置する18個の駒を決める。
    if (king == 0 || king == 2)//Math.random()の出力結果が0ならばキング、1ならば王将、2は両方
    {
      pawns[i] = chess_pawns[0];
      i++;
    }
    if (king == 1 || king == 2) {
      pawns[i] = shogi_pawns[0];
      i++;
    }
    let pawn_max = pawns_num - i; //Kingの駒追加分引く
    while (pawn_max != 0) {
      if (Math.random()) {    //0のとき将棋、1のときチェスの駒を選定
        let c_num = Math.floor(Math.random() * chess_pawns.length - 1) + 1;//Kingの分配列の長さから引き、最低値を1足す
        pawns[i] = chess_pawns[c_num];
        chess_pawns.splice(cnum, 1);
      } else {
        let s_num = Math.floor(Math.random() * shogi_pawns.length - 1) + 1;
        pawns[i] = shogi_pawns[s_num];
        shogi_pawns.splice(snum, 1);
      }
      i++;
      pawns_max--;
    }
    return pawns;
  }

  /**
   * ランダムに駒を配置する
   * @param {Object} pawns1 - 先手の駒を格納した配列
   * @param {Object} pawns2 - 後手の駒を格納した配列
   * @returns {Object} 配置した後のmap(0:無配置,文字列:駒)
   */
  function random_set(pawns1, pawns2) {
    while (pawns1.length != cellnum * 3) {  //自陣(3列分)までの要素として配置なしのステータスを挿入
      pawns1[pawns1.length] = 0;        //配列の長さの値=現在の最後尾の位置
    }
    while (pawns2.length != cellnum * 3) {
      pawns2[pawns2.length] = 0;
    }

    let x = 0, y = 0;        //map上のx,y座標
    let random_num = 0; //ランダムなindexを格納する
    for (y = cell_num - 3; y < cell_num; y++) {                  //配置の決定(先手)
      for (x = 0; x < cell_num; x++) {
        random_num = Math.random() * pawns1.length;      //指定する要素の位置
        map[y][x] = pawns1[random_num];
        make_group(map, 1, x, y);
        pawns1.splice(random_num, 1);
      }
    }

    for (y = 0; y < 3; y++) {
      for (x = 0; x < cell_num; x++) {                          //配置の決定(後手)
        random_num = Math.random() * pawns2.length;
        map[y][x] = pawns2[random_num];
        make_group(map, -1, x, y);
        pawns2.splice(random_num, 1);
      }
    }
    return map;
  }

  /**
   * 駒のチーム判別用レイヤーを編集する
   * @param {Object} nmap 現在のマップ
   * @param {Number} team チームの番号(先攻後攻)
   * @param {Number} y y座標 
   * @param {Number} x x座標
   */
  function make_group(nmap, team, x, y) {                        //駒のチームを判別するレイヤーを編集する
    if (nmap[y][x] != 0) {
      team_map[y][x] = team;
    }
  }

  /**
   * 渡された駒とその位置から駒の移動可能範囲を返す
   * @param {Number} turn 先攻後攻どちらのターンか(チームを表す数値と同値)
   * @param {Object} map 現在のマップ 
   * @param {Number} x x座標
   * @param {Number} y y座標
   * @returns {Object} 駒が移動可能な範囲を示した配列 0:移動不可 1:移動可能
   */
  function move_able(turn, map, x, y) {

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

    let i = 0, j = 0;
    let able_map = new Array(cell_num).fill(0).map(() => new Array(cell_num).fill(0));

    switch (pawn) {
      case "c_King", "s_King":
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

      case "Bishop", "Kaku":
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

      case "Rook", "Hisya":
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

    }
  }

})

/*
00000000
00000000
11100000
10100000
11100000
*/