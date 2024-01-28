addEventListener("load", function () {
    let ctx = document.getElementById("canv").getContext('2d');
    let game = new Game();
    game.initGame(ctx);
});