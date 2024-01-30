
class Game {
  pawn = new Pawn();
  renderer = new Renderer();
  CELL_SIZE = this.renderer.CELL_SIZE;
  cell_num = 9;  //マス数
  ctx;            //キャンバス要素
  evented = false;//イベントが設定されているか
  state = {};     //現在の状態
  point = {        //マウスカーソルの座標
    x: 0,
    y: 0
  };
  
  map = Array(this.cell_num).fill(0).map(() => Array(this.cell_num).fill(0));       //0か文字列(駒の種類)が格納されている
  team_map = Array(this.cell_num).fill(0).map(() => Array(this.cell_num).fill(0));  // どの場所にどちらのチームの駒があるかを示している
  able_map = Array(this.cell_num).fill(0).map(() => Array(this.cell_num).fill(0));
  pawns_num = 18;
  chess_pawns = [ //King:1 Queen:1 Pawn:8 Rook:2 Bishop:2 Knight:2
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
  ];

  shogi_pawns = [ //King:1 Hu:9 Hisya:1 Kaku:1 Keima:2 Kyousya:2 Gin:2 Kin:2
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
  ];

  ex_shogi_pawns = {
    "Hu": "To",
    "Hisya": "Ryuuou",
    "Kaku": "Ryuuma",
    "Keima": "Narikei",
    "Kyousya": "Narikyou",
    "Gin": "Narigin"
  };
  init_state = {//ゲーム開始時の盤面の状態
    map: this.map,
    team_map: this.team_map,
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


  setEvents() {
    let isTouch;
    if ('ontouchstart' in window) {
      isTouch = true;
    } else {
      isTouch = false;
    }
    if (isTouch) {
      this.ctx.canvas.addEventListener('touchstart', this.ev_mouseClick.bind(this));
    } else {
      this.ctx.canvas.addEventListener('mousemove', this.ev_mouseMove.bind(this));
      this.ctx.canvas.addEventListener('mouseup', this.ev_mouseClick.bind(this));
    }
  }

  //聞きたいこと:initGameでどのような処理を行うべきか,描画の仕方とは
  initGame(_ctx) {
    this.ctx = _ctx;
    this.state = this.objCopy(this.init_state)
    this.random_set();
    this.setEvents();

    this.renderer.imgLoadPromise.then(function () {
      this.renderer.render(this.ctx, this.state);
    }.bind(this));
    // ctx = _ctx;
    // state = objCopy(init_state);
    // if (!evented) {     //イベントを登録していないとき
    //   evented = true;
    //   setEvents();    //イベント呼び出し
    // }

    // map = random_set();
    // Renderer.render(ctx, state, point);
    // while (1) {
    //   ev_mouseClick();
    //   w = judge_turn();
    //   if (!w) {
    //     if (w == 1) {
    //       window.confirm("白の勝利!");
    //     } else {
    //       window.confirm("黒の勝利!");
    //     }
    //     break;
    //   }
    // }
  }

  ev_mouseMove(e) {
    this.getMousePosition(e);
    this.state.selected = this.hitTest(this.point.x, this.point.y);
    // this.renderer.render(this.ctx, this.state, this.point);
  }

  async ev_mouseClick(e) {
    let ct = true;
    let target_pawn;
    let ev;
    let x = 0, y = 0;
    let sel_x = 0;
    let sel_y = 0;
    let w = 0;
    while (w == 0) {
      ct = true;
      while (ct) {
        ev = await new Promise(resolve => document.body.addEventListener("click", resolve, { once: true }));          //駒の選択
         sel_x = ev.pageX;
         sel_y = ev.pageY;
        sel_x = parseInt(sel_x / this.CELL_SIZE);
        sel_y = parseInt(sel_y / this.CELL_SIZE);

        if (this.able_map[sel_y][sel_x] == 1) {                                                                       //移動先の確定             
          this.state.map[sel_y][sel_x] = target_pawn;
          this.state.team_map[sel_y][sel_x] = this.state.turn;
          this.state.map[y][x] = 0;
          this.state.team_map[y][x] = 0;
  
          ct = false;

          for(let j = 0;j<this.cell_num;j++){
            for(let i = 0;i<this.cell_num;i++){                                                                     //able_mapの初期化
              this.able_map[j][i] = 0;
            }
          }
        }else if (this.state.team_map[sel_y][sel_x] == this.state.turn) {                   //自チームの駒を選択したとき
          this.renderer.render(this.ctx, this.state, this.point);
          this.able_map = this.pawn.move_able(this.state.turn, this.state.map, this.state.team_map, sel_x, sel_y);
          target_pawn = this.state.map[sel_y][sel_x];
          x = sel_x;
          y = sel_y;
          this.renderer.draw_able(this.able_map, this.ctx);
        }
        else{
          this.renderer.render(this.ctx, this.state, this.point);                                                     //描画リセット
        }
      }
      w = this.judge_turn();
      this.state.revision += 1; 
      this.renderer.render(this.ctx, this.state, this.point);
    }
    if (w == 1) {
      window.confirm("白の勝利!");
    } else {
      window.confirm("黒の勝利!");
    }
  }

  getMousePosition(e) {
    if (!e.clientX) { //SmartPhone
      if (e.touches) {
        e = e.originalEvent.touches[0];
      } else if (e.originalEvent.touches) {
        e = e.originalEvent.touches[0];
      } else {
        e = e.touches[0];
      }
    }
    var rect = e.target.getBoundingClientRect();
    this.point.x = e.clientX - rect.left;
    this.point.y = e.clientY - rect.top;
  }

  hitTest(x, y) {
    let objects = [this.renderer.RECT_BOARD];
    let click_obj = null;
    let selected = {
      name: "",
      value: 0
    }

    for (let i = 0; i < objects.length; i++) {


      if (objects[i].w >= x && objects[i].x <= x && objects[i].h >= y && objects[i].y <= y) {
        selected.name = "RECT_BOARD";
        break;
      }
    }
    switch (true) {
      case selected.name === "RECT_BOARD":
        selected.name = "RECT_BOARD";
        selected.value = Math.floor(y / this.CELL_SIZE) * Renderer.COL + Math.floor(x / this.CELL_SIZE)
        break;
    }
    return selected;
  }

  objCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  /**
   * ランダムに駒を選択する関数です。
   * @returns {Object} 先手pawn1、後手pawn2の駒を格納した配列=>文字列or0
   */
  random_pawn() {
    let chess_pawns1 = [];
    let shogi_pawns1 = [];
    let pawns1 = [];
    let c_num = 0;
    let s_num = 0;
    /**@param i 現在のpawnsの要素数*/
    let i = 0;

    for (i = 0; i < this.chess_pawns.length; i++) {
      chess_pawns1[i] = this.chess_pawns[i];
    }

    for (i = 0; i < this.shogi_pawns.length; i++) {
      shogi_pawns1[i] = this.shogi_pawns[i];
    }

    i = 0;

    let king = Math.floor(Math.random() * 3);
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
    chess_pawns1.splice(0, 1);
    shogi_pawns1.splice(0, 1);

    let pawn_max = this.pawns_num - i; //Kingの駒追加分引く
    while (pawn_max != 0) {
      if (Math.floor(Math.random() * 2)) {    //0のとき将棋、1のときチェスの駒を選定
        c_num = Math.floor(Math.random() * chess_pawns1.length);//Kingの分配列の長さから引き、最低値を1足す
        pawns1[i] = chess_pawns1[c_num];
        chess_pawns1.splice(c_num, 1);
      } else {
        s_num = Math.floor(Math.random() * shogi_pawns1.length);
        pawns1[i] = shogi_pawns1[s_num];
        shogi_pawns1.splice(s_num, 1);
      }
      i++;
      pawn_max--;
    }

    return pawns1;
  }

  /**
   * ランダムに駒を配置する
   * @returns {Object} 配置した後のmap(0:無配置,string:駒)
   */
  random_set() {
    let pawns1 = this.random_pawn();
    let pawns2 = this.random_pawn();


    while (pawns1.length != this.cell_num * 3) {  //自陣(3列分)までの要素として配置なしのステータスを挿入
      pawns1[pawns1.length] = 0;
    }
    while (pawns2.length != this.cell_num * 3) {
      pawns2[pawns2.length] = 0;
    }

    let x = 0, y = 0;        //map上のx,y座標
    let random_num = 0; //ランダムなindexを格納する
    for (y = this.cell_num - 3; y < this.cell_num; y++) {                  //配置の決定(先手)
      for (x = 0; x < this.cell_num; x++) {
        random_num = Math.floor(Math.random() * pawns1.length);      //指定する要素の位置
        this.state.map[y][x] = pawns1[random_num];
        this.make_group(this.state.map, 1, x, y);
        pawns1.splice(random_num, 1);
      }
    }

    for (y = 0; y < 3; y++) {
      for (x = 0; x < this.cell_num; x++) {                          //配置の決定(後手)
        random_num = Math.floor(Math.random() * pawns2.length);
        this.state.map[y][x] = pawns2[random_num];
        this.make_group(this.state.map, -1, x, y);
        pawns2.splice(random_num, 1);
      }
    }
  }

  /**
   * 駒のチーム判別用レイヤーを編集する
   * @param {Object} nmap 現在のマップ
   * @param {Number} team チームの番号(先攻後攻)
   * @param {Number} y y座標 
   * @param {Number} x x座標
   */
  make_group(nmap, team, x, y) {                        //駒のチームを判別するレイヤーを編集する
    if (nmap[y][x] != 0) {
      this.state.team_map[y][x] = team;
    }
  }

  /**
         * ターン終了時の判定を格納している
         * 現在実装している機能:勝敗判定　成りの判定 ターン切り替え
         * @returns 勝者のチーム番号 続行の場合は0
         */
  judge_turn() {
    let king_num = 0;
    let cnt = false;
    let winner = 0;
    for (let i = 0; i < this.cell_num; i++) {        //最初に読み取ったキングのチームに対し、別チームのキングがいなかった場合試合終了
      for (let j = 0; j < this.cell_num; j++) {
        if (this.state.map[i][j] == "c_King" || this.state.map[i][j] == "s_King") {
          if (king_num == 0) {
            king_num = this.state.team_map[i][j];
          } else {
            if (king_num != this.state.team_map[i][j]) {
              cnt = true;
              break;
            }
          }
        }
      }
    }

    if (this.state.turn == 1) {                         //将棋の駒に対して成りを適用する
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < this.cell_num; x++) {
          if (this.shogi_pawns.includes(this.state.map[y][x]) && this.state.team_map[y][x] == 1) {
            if (window.confirm("成りますか?"))               //アラートによって選択させる
              this.state.map[y][x] = this.ex_shogi_pawns[this.state.map[y][x]];
          }
        }
      }
    } else {
      for (let y = this.cell_num - 1; y > this.cell_num - 3; y--) {
        for (let x = 0; x < this.cell_num; x++) {
          if (this.shogi_pawns.includes(this.state.map[y][x]) && this.state.team_map[y][x] == -1) {
            if (window.confirm("成りますか?"))
              this.state.map[y][x] = this.ex_shogi_pawns[this.state.map[y][x]];
          }
        }
      }
    };
    let change_select;
    //ポーンの変化処理
    let optionElem = document.getElementById('change_pawn');

    for (let i = 0; i < this.cell_num; i++) {
      if (this.state.turn == 1) {
        if (this.state.map[0][i] == "Pawn" && this.state.team_map[0][i] == 1) {
          optionElem.style.display = "initial";//表示
          change_select = document.getElementById('change_pawn');
          this.state.map[0][i] = change_select.value;
        }
      } else {
        if (this.state.map[this.cell_num - 1][i] == "Pawn" && this.state.team_map[this.cell_num -1 ][i] == -1) {
          optionElem.style.display = "initial";//表示
          change_select = document.getElementById('change_pawn');
          this.state.map[this.cell_num - 1][i] == change_select.value;
        }
      }
    }
    this.state.turn *= -1;

    if (!cnt) {
      winner = king_num;
    }
    return winner;
  }
}
