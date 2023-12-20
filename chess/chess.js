(function(global){
  "use strict";

  function Game(){}

  global.Game = Game;
  global.Game.initGame = initgame;

  let cell_num = 10;  //マス数
  let ctx;            //キャンバス要素
  let evented = false;//イベントが設定されているか
  let state = {};     //現在の状態
  let point ={        //マウスカーソルの座標
    x:0,
    y:0
  }
  let chess_pawns={
      0:"King",
      1:"Queen",
      2:"Pawn",
      3:"Rook",
      4:"Bishop",
      5:"Knight"
      }
  let shogi_pawns={
      0:"King",
      1:"Hu",
      2:"Hisya",
      3:"Kaku",
      4:"Keima",
      5:"Kin",
      6:"Gin"
      }
  let ex_shogi_pawns = {
      1:"to",
      2:"Ryuuou",
      3:"Ryuuma",
      4:"Narikei",
      6:"Kin"
  }

  let init_state = {
      map: new Array(10).fill(new Array(10).fill(0)), //初期は空白 10*10マス
      turn:1,      //ターン。1が先手,-1が後手
      revision:0,  //この数値の変化で画面の描画をし直す
      selected:{
        name:"",
        value:0
      }
  }

  function setEvents(){

  }

  function initGame(_ctx){
    ctx = _ctx;
    state = objCopy(init_state);
    if(!evented){     //イベントを登録していないとき
      evented = true;
      setEvents();    //イベント呼び出し
    }
    Render.render(ctx,state,point);
  }

  function ev_mouseClick(e){
    let selected = hitTest(point.x,point.y);
    let number = selected.value;
  }

  function hitTest(x,y){
    
  }

})
