(function (global) {
  "use strict";

  function Game() { }

  global.Game = Game;
  global.Game.initGame = initgame;

  CELL_SIZE = Renderer.CELL_SIZE;

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
    "Hu": "To",
    "Hisya": "Ryuuou",
    "Kaku": "Ryuuma",
    "Keima": "Narikei",
    "Kyousya": "Narikyou",
    "Gin": "Narigin"
  }

  var init_state = {//ゲーム開始時の盤面の状態
    _map: map,
    //ターン。1は先手、-1は後手。
    turn: 1,
    //これが増えてたら画面を描画し直す。
    revision: 0,
    //どのマスが選択されているかの情報
    selected: {
      name: "",
      value: 0
    }
  };


  function setEvents() {

  }

  //聞きたいこと:initGameでどのような処理を行うべきか,描画の仕方とは
  function initGame(_ctx) {
    ctx = _ctx;
    state = objCopy(init_state);
    if (!evented) {     //イベントを登録していないとき
      evented = true;
      setEvents();    //イベント呼び出し
    }

    map = random_set();
    Renderer.render(ctx, state, point);
    while (1) {
      ev_mouseClick();
      let w = judge_turn();
      if (!w) {
        if (w == 1) {
          window.confirm("白の勝利!");
        } else {
          window.confirm("黒の勝利!")
        }
        break;
      }
    }
  }

  function ev_mouseClick() {
    let ct = true;
    while (ct) {
      document.body.addEventListener("click", function (event) {           //駒の選択
        let sel_x = event.pageX;
        let sel_y = event.pageY;
        sel_x /= CELL_SIZE | 0;
        sel_y /= CELL_SIZE | 0;
        if (map[sel_y][sel_x] != 0 && team_map[sel_y][sel_x] == init_state.turn) {
          let able_map = new Pawn.move_able(init_state.turn, map, sel_x, sel_y);
          Renderer.draw_able(able_map);

          document.body.addEventListener("click", function (event) {      //移動箇所の選択
            let x = event.pageX;
            let y = event.pageY;
            x /= CELL_SIZE | 0;
            y /= CELL_SIZE | 0;
            if (able_map[y][x] == 1 && x < cell_num && y < cell_num) {              //盤内の移動可能な場所を指定した場合
              map[y][x] = map[sel_y][sel_x]
              map[sel_y][sel_x] = 0;
              ct = false;
            }
          })
        }
      })
    }
  }

  /**
   * ランダムに駒を選択する関数です。
   * @returns {Object} 先手pawn1、後手pawn2の駒を格納した配列=>文字列or0
   */
  function random_pawn() {
    let chess_pawns1 = chess_pawns;
    let chess_pawns2 = chess_pawns;
    let shogi_pawns1 = shogi_pawns;
    let shogi_pawns2 = shogi_pawns;
    let pawns1 = [];
    /**@param i 現在のpawnsの要素数*/
    let i = 0;

    let king = Math.random() * 3;
    //配置する18個の駒を決める。
    if (king == 0 || king == 2)//Math.random()の出力結果が0ならばキング、1ならば王将、2は両方
    {
      pawns1[i] = chess_pawns1[0];
      i++;
    }
    if (king == 1 || king == 2) {
      pawns1[i] = shogi_pawns1[0];
      i++;
    }
    let pawn_max = pawns_num - i; //Kingの駒追加分引く
    while (pawn_max != 0) {
      if (Math.random()) {    //0のとき将棋、1のときチェスの駒を選定
        let c_num = Math.floor(Math.random() * chess_pawns1.length - 1) + 1;//Kingの分配列の長さから引き、最低値を1足す
        pawns1[i] = chess_pawns1[c_num];
        chess_pawns1.splice(cnum, 1);
      } else {
        let s_num = Math.floor(Math.random() * shogi_pawns1.length - 1) + 1;
        pawns1[i] = shogi_pawns1[s_num];
        shogi_pawns1.splice(snum, 1);
      }
      i++;
      pawns_max--;
    }

    i = 0;
    let pawns2 = [];
    king = Math.random() * 3;
    //配置する18個の駒を決める。
    if (king == 0 || king == 2)//Math.random()の出力結果が0ならばキング、1ならば王将、2は両方
    {
      pawns2[i] = chess_pawns2[0];
      i++;
    }
    if (king == 1 || king == 2) {
      pawns2[i] = shogi_pawns2[0];
      i++;
    }
    pawn_max = pawns_num - i; //Kingの駒追加分引く
    while (pawn_max != 0) {
      if (Math.random()) {    //0のとき将棋、1のときチェスの駒を選定
        c_num = Math.floor(Math.random() * chess_pawns2.length - 1) + 1;//Kingの分配列の長さから引き、最低値を1足す
        pawns1[i] = chess_pawns2[c_num];
        chess_pawns2.splice(cnum, 1);
      } else {
        s_num = Math.floor(Math.random() * shogi_pawns2.length - 1) + 1;
        pawns1[i] = shogi_pawns2[s_num];
        shogi_pawns2.splice(snum, 1);
      }
      i++;
      pawns_max--;
    }

    pawns = {
      pawn1:pawns1,
      pawn2:pawns2
    }
    return pawns;
  }

  /**
   * ランダムに駒を配置する
   * @param {Object} pawns1 - 先手の駒を格納した配列
   * @param {Object} pawns2 - 後手の駒を格納した配列
   * @returns {Object} 配置した後のmap(0:無配置,string:駒)
   */
  function random_set() {
    let _pawns = random_pawn();
    let pawns1 = _pawns.pawn1;
    let pawns2 = _pawns.pawn2;

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
         * ターン終了時の判定を格納している
         * 現在実装している機能:勝敗判定　成りの判定 ターン切り替え
         * @returns 勝者のチーム番号 続行の場合は0
         */
  function judge_turn() {
    let king_num = 0;
    let cnt = false;
    let winner = 0;
    for (let i = 0; i < cell_num; i++) {        //最初に読み取ったキングのチームに対し、別チームのキングがいなかった場合試合終了
      for (let j = 0; j < cell_num; j++) {
        if (map[i][j].includes("King")) {
          if (king_num != 0) {
            king_num = team_map[i][j];
          } else {
            if (king_num != team_map[i][j]) {
              cnt = true;
              break;
            }
          }
        }
      }
    }

    if (init_state.turn == 1) {                         //将棋の駒に対して成りを適用する
      if (shogi_pawns.includes(map[y][x]) && y < 3) {
        if (window.confirm("成りますか?"))               //アラートによって選択させる
          map[y][x] = ex_shogi_pawns[map[y][x]];
      }
    } else {
      if (shogi_pawns.includes(map[y][x]) && y >= cell_num - 3) {
        if (window.confirm("成りますか?"))
          map[y][x] = ex_shogi_pawns[map[y][x]];
      }
    };

    init_state.turn *= -1;

    if (!cnt) {
      winner = king_num;
    }
    return winner;
  }
}
)