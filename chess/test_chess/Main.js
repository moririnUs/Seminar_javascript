addEventListener("load", function () {
    let ctx = document.getElementById("canv").getContext('2d');
    let game = new Game();
    let imageManager = new ImageManager();
    imageManager.imgSrcs = {                    //駒の画像パスを格納した配列
        "Pawn": "../assets/pawn.png",
        "c_King": "../assets/c_king.png",
        "Bishop": "../assets/bishop.png"
    };
    imageManager.load().then(function () {
        game.initGame(ctx);
    });
});