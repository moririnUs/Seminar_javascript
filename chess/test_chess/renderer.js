class Renderer {
    img;
    COL = 9;
    RECT_CANV = {
        x: 0,
        y: 0,
        w: 500,
        h: 500
    };
    RECT_BOARD = {
        x: 0,
        y: 0,
        w: 500,
        h: 500
    };

    CELL_SIZE = parseInt(this.RECT_CANV.w / this.COL);
    COLOR_LINE = "#000000";
    COLOR_WHITE = "#FFFFFF";
    COLOR_BLACK = "#000000";
    COLOR_SELECT = "#FFFFFF";

    COLOR_PANEL_4 = "#DF9721";
    COLOR_PANEL_5 = "#DF9721";
    COLOR_PANEL_6 = "#DF9721";

    prev_revision = -1;
    canv_cache = {
        canv_board: null,
        canv_pieaces: null,
        canv_effect: null
    };
    imgLoadPromise;

    render(ctx, state, point) {
        if (this.prev_revision < 0) {
            this.drawBoard(state);
            this.drawPieceALL(state);
            this.drawEffect(state);
        } else {
            if (state.revision != this.prev_revision) {
                this.drawPieceALL(state);
            }
            this.drawEffect(state);
        }

        ctx.clearRect(0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
        ctx.drawImage(this.canv_cache.canv_board, 0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
        ctx.drawImage(this.canv_cache.canv_pieaces, 0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
        ctx.drawImage(this.canv_cache.canv_effect, 0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
        this.prev_revision = state.revision;
    }

    drawBoard(state) {
        if (!this.canv_cache.canv_board) {
            this.canv_cache.canv_board = document.createElement("canvas");
            this.canv_cache.canv_board.width = this.RECT_CANV.w;
            this.canv_cache.canv_board.height = this.RECT_CANV.h;
        }
        let ctx = this.canv_cache.canv_board.getContext('2d');
        ctx.clearRect(0, 0, this.RECT_CANV.w, this.RECT_CANV.h);

        let grad = ctx.createLinearGradient(0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
        grad.addColorStop(0, this.COLOR_PANEL_6);
        grad.addColorStop(0.3, this.COLOR_PANEL_5);
        grad.addColorStop(1, this.COLOR_PANEL_4);
        ctx.fillStyle = grad;

        for (let x = 0; x < this.COL; x++) {
            for (let y = 0; y < this.COL; y++) {
                ctx.strokeStyle = this.COLOR_LINE;
                ctx.beginPath();
                ctx.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
                ctx.strokeRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
            }
        }
        let canv_board2 = document.createElement("canvas");
        let ctx_board2 = canv_board2.getContext('2d');
        canv_board2.width = this.RECT_CANV.w;
        canv_board2.height = this.RECT_CANV.h;
        ctx_board2.clearRect(0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
        ctx_board2.globalAlpha = 0.07;
        ctx_board2.fillStyle = this.COLOR_WHITE;
        ctx_board2.beginPath();
        ctx_board2.arc(this.CELL_SIZE * 1, -3 * this.CELL_SIZE, 7 * this.CELL_SIZE, 0, Math.PI * 2, false);
        ctx_board2.fill();
        ctx.drawImage(canv_board2, 0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
    }

    drawPieceALL(state) {
        if (!this.canv_cache.canv_pieaces) {
            this.canv_cache.canv_pieaces = document.createElement("canvas");
            this.canv_cache.canv_pieaces.width = this.RECT_CANV.w;
            this.canv_cache.canv_pieaces.height = this.RECT_CANV.h;
        }
        let ctx = this.canv_cache.canv_pieaces.getContext('2d');
        ctx.clearRect(0, 0, this.RECT_CANV.w, this.RECT_CANV.h);

        for (let x = 0; x < this.COL; x++) {
            for (let y = 0; y < this.COL; y++) {
                if (state.map[y * this.COL + x] != 0) {
                    this.drawPiece(ctx, x * this.CELL_SIZE, y * this.CELL_SIZE, state.map[y * this.COL + x]);
                }
            }
        }
    }

    drawPiece(ctx, x, y, number) {

        let grad = ctx.createLinearGradient(x, y, x + this.CELL_SIZE, y + this.CELL_SIZE);
        let font_color;
        let fill_color;
        if (number > 0) {
            font_color = this.COLOR_BLACK;
            fill_color = this.COLOR_WHITE;
            grad.addColorStop(0, 'rgb(180, 180, 180)');
            grad.addColorStop(0.4, fill_color);
            grad.addColorStop(1, fill_color);
        } else if (number < 0) {
            font_color = this.COLOR_WHITE;
            fill_color = this.COLOR_BLACK;
            grad.addColorStop(0, fill_color);
            grad.addColorStop(0.4, 'rgb(70, 70, 70)');
            grad.addColorStop(1, 'rgb(70, 70, 70)');
        }


        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0, 0, 0, 1)";
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.fillRect(
            x + this.CELL_SIZE / 10,
            y + this.CELL_SIZE / 10,
            this.CELL_SIZE - 1 * this.CELL_SIZE / 5,
            this.CELL_SIZE - 1 * this.CELL_SIZE / 5
        );

        ctx.shadowColor = "rgba(0, 0, 0, 0)";;
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        return ctx;
    }

    drawEffect(state) {
        if (!this.canv_cache.canv_effect) {
            this.canv_cache.canv_effect = document.createElement("canvas");
            this.canv_cache.canv_effect.width = this.RECT_CANV.w;
            this.canv_cache.canv_effect.height = this.RECT_CANV.h;
        }
        let ctx = this.canv_cache.canv_effect.getContext('2d');
        let x = parseInt(state.selected.value % this.COL) * this.CELL_SIZE;
        let y = parseInt(state.selected.value / this.COL) * this.CELL_SIZE;

        ctx.clearRect(0, 0, this.RECT_CANV.w, this.RECT_CANV.h);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.COLOR_SELECT;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
    }

    /**
     * 駒の移動可能な範囲を描画する。
     * @param {Object} able_map 駒の移動可能範囲 
     */
    draw_able(able_map) {
        let canv = document.createElement("canvas");
        let ctx = canv.getContext('2d');

        for (let i = 0; i < this.COL; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (able_map[i][j]) {
                    ctx.arc(j * this.CELL_SIZE + this.CELL_SIZE / 2, i * this.CELL_SIZE + this.CELL_SIZE / 2,0,2*Math.PI);  //移動可能範囲には円を描画
                }
            }
        }
    }

    constructor() {
        this.imageManager = new ImageManager();
        this.imageManager.imgSrcs = {                    //駒の画像パスを格納した配列
            "Pawn": "../assets/pawn.png",
            "c_King": "../assets/c_king.png",
            "Bishop": "../assets/bishop.png",
            "Rook": "../assets/rook.png",
            "Queen": "../assets/queen.png",
            "Knight": "../assets/knight.png",
            "s_King": "../assets/s_king.png",
            "Hu": "../assets/Hu.png",
            "Kyousya": "../assets/kyousya.png",
            "Keima": "../assets/keima.png",
            "Gin": "../assets/gin.png",
            "Kin": "../assets/kin.png",
            "To": "../assets/to.png",
            "Narigin": "../assets/narigin.png",
            "Narikyou": "../assets/narikyou.png",
            "Narikei": "../assets/narikei.png",
            "Ryuuou": "../assets/ryuuou.png",
            "Ryuuma": "../assets/ryuuma.png",
        };
        this.imgLoadPromise = this.imageManager.load();
    }

    draw_pawn() {
    }
}