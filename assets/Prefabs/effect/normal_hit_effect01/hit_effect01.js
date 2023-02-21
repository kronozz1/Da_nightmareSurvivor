
cc.Class({
    extends: cc.Component,
 
    properties: {

    },

    onLoad () {
        this.sprite = this.node.getChildByName("sprite")
        this.sprite.angle += Math.random()*360
        this.sprite.scaleX += Math.random()*0.8
        this.sprite.scaleY += Math.random()*0.8
    },
 
    delete () {
        this.node.destroy()
    },

});
 
