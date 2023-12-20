(function (global) {
    "use strict";
    function Render() { }

    let board_size = {
        x: 0,
        y: 0,
        w: 500,
        h: 500
    };

    let canvas_size = {
        x: 0,
        y: 0,
        w: 500,
        h: 500
    };

    let cell_num = 10;          //セルの数

    let cell_size = board_size.w / cell_num | 0;  //セルの大きさ

    let canv_revision = -1;     //盤の状態

    let canvas_cache = {        //キャンバスのキャッシュ
        canv_board: null,
        canv_pieaces: null,
        canv_effect: null
    };

    global.Render = Render;
    global.Render.render = render;
    global.Render.cell_size = cell_size;
    global.Render.board_size = board_size;


    function render(ctx, state, point) {
        if (state < 0) {      //初期状態の設定
            canvas_cache.canv_board = drawBoard(state);
        }
    }
    window.drawBoard = drawBoard;

    function drawBoard(state) {          //盤の描画
        if (!canvas_cache.canv_board) {   //盤をキャッシュする
            canvas_cache.canv_board = document.createElement("canvas");
            canvas_cache.canv_board.width = canvas_size.w;
            canvas_cache.canv_board.height = canvas_size.h;
        }

        let ctx = canvas_cache.canv_board.getContext("2d");

        for (let x = 0; x < cell_num; x++) {    //描画処理
            for (let y = 0; y < cell_num; y++) {
                ctx.strokeStyle = "#000000";
                ctx.fillStyle = "black";
                //ctx.beginPath();
                console.log(canvas_cache.canv_board);
                ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
                ctx.strokeRect(x * cell_size, y * cell_size, cell_size, cell_size);
            }
        }

        return canvas_cache.canv_board;
    }

})((this || 0).self || global);