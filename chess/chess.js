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
  let map = new Array(cell_num).fill(0).map(()=>new Array(cell_num).fill(0));
  let pawns_num = 18;
  let chess_pawns = [ //King:1 Queen:1 Pawn:8 Rook:2 Bishop:2 Knight:2
    "King",
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
    "King",
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
    1: "to",
    2: "Ryuuou",
    3: "Ryuuma",
    4: "Narikei",
    5: "Narikyou",
    6: "Kin"
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
   * ランダムに駒を配置する関数です
   */
  function random_pawn() {
    let pawns = [];
    /**@param i 現在のpawnsの要素数*/
    let i = 0;  
    
    let king = Math.random() * 3;
    //配置する18個の駒を決める。
    if (!king || king == 2)//Math.random()の出力結果が0ならばキング、1ならば王将、2は両方
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
        let c_num = Math.floor(Math.random() * chess_pawns.length -1)+1;//Kingの分配列の長さから引き、最低値を1足す
        pawns[i] = chess_pawns[c_num];
        chess_pawns.splice(cnum,1);
      } else {
        let s_num = Math.floor(Math.random() * shogi_pawns.length -1)+1;
        pawns[i] = shogi_pawns[s_num];
        shogi_pawns.splice(snum,1);
      }
      i++;
      pawns_max--;
    }

    //配置を決定する
    while(pawns.length != cellnum*3){  //手前3列までの要素として配置なしのステータスを挿入
      pawns[i] = 0;
      i++;
    }
    
    for(let y = 0;y<3;y++){                 //配置の決定
      for(let x = 0;x<cell_num;x++){
        let random_num = Math.random() * i; //指定する要素の位置
        map[x][y] = pawns[random_num];
        pawns.splice(random_num,1);
      }
    }
  }

  return map;

})
