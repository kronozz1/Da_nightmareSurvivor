
cc.Class({
    extends: cc.Component,
 
    properties: {
 
    },

    onLoad () {
        this.player = cc.find("Canvas/GameObj/Player")	
        setTimeout(() => {
            this.node.destroy()
        }, 1000);
    },
 
    update (dt) {
        this.node.x = this.player.x
        this.node.y = this.player.y + 38
        this.node.zIndex = -this.node.y
 
    },
});
 
