class Game {

    COL = 8;
    ctx;
    state = {
        map: this.arrangeMap(),
        mode: 0,
        turn: 1,
        revision: 0,
        selected: {
            name: "",
            value: 0
        }
    };
    point = {
        x: 0,
        y: 0
    };
    renderer;

    initGame(ctx) {
        this.ctx = ctx;
        this.setEvents();
        this.renderer = new Renderer();
        this.renderer.render(this.ctx, this.state, this.point);
    }

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

    ev_mouseMove(e) {
        this.getMousePosition(e);
        this.state.selected = this.hitTest(this.point.x, this.point.y);
        this.renderer.render(this.ctx, this.state, this.point);
    }

    ev_mouseClick(e) {
        let selected = this.hitTest(this.point.x, this.point.y);
        let number;
        if (selected.name === "RECT_BOARD") {
            number = selected.value;
            if (Ai.canPut(this.state.map, selected.value, this.state.turn) === true) {
                state.map = Ai.putMap(state.map, selected.value, state.turn);
                state.turn = -1 * state.turn;
                state.revision += 1;
                Render.render(ctx, state, point);

                setTimeout(function () {
                    let _number = Ai.thinkAI(state.map, state.turn, 6)[0];
                    state.map = Ai.putMap(state.map, _number, state.turn);
                    state.turn = -1 * state.turn;
                    state.revision += 1;
                    Render.render(ctx, state, point);
                }, 100);

            }
        }
    }


    getMousePosition(e) {
        if (!e.clientX) { //SmartPhone
            if (e.touches) {
                e = e.originalEvent.touches[0];
            } else if (e.originalEvent.touches) {
                e = e.originalEvent.touches[0];
            } else {
                e = event.touches[0];
            }
        }
        let rect = e.target.getBoundingClientRect();
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
                selected.value = Math.floor(y / this.renderer.CELL_SIZE) * this.COL + Math.floor(x / this.renderer.CELL_SIZE)
                break;
        }
        return selected;
    }

    arrangeMap() {
        let map = [];
        for (let i = 0; i < this.COL; i++) {
            let row = [];
            for (let j = 0; j < this.COL; j++) {
                row.push(0);
            }
            map.push(row);
        }
        map[3][3] = map[4][4] = -1;
        map[3][4] = map[4][3] = 1;
        return map;
    }
}