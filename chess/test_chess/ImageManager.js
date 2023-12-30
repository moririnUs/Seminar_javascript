class ImageManager {
    imgSrcs;
    imgs;
    constructor() {
        this.imgSrcs = {};
        this.imgs = {};
    }
    async load() {
        let promises = [];
        for (let imgName in this.imgSrcs) {
            let img = new Image();
            promises.push(new Promise(function (resolve) {
                img.addEventListener("load", function () {
                    this.imgs[imgName] = img;
                    resolve(img);
                }.bind(this));
                img.addEventListener("error", function () {
                    resolve(img);
                }.bind(this));
            }.bind(this)));
            img.src = this.imgSrcs[imgName];
        }
        return Promise.all(promises);
    }
}