cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.speed = 10;
    this.player = cc.find("Canvas/GameObj/Player");
    this.MainGame = cc.find("Canvas").getComponent("MainGame");
  },

  onCollisionEnter(other, self) {
    if (other.node.group == "player") {
      self.node.group = "ui";
    }
  },
  update(dt) {
    if(
      (this.player.y<this.MainGame.screenHeightLenMax&&this.player.y>-this.MainGame.screenHeightLenMax)&&
      (this.player.x<this.MainGame.screenWidthLenMax&&this.player.x>-this.MainGame.screenWidthLenMax)
    ){
      this.node.x += (this.player.x - this.node.x) * (1 / 60) * this.speed;
      this.node.y += (this.player.y - this.node.y) * (1 / 60) * this.speed;
    }else{
      if(
        (this.player.x>this.MainGame.screenWidthLenMax||this.player.x<-this.MainGame.screenWidthLenMax)&&
        (this.player.y<this.MainGame.screenHeightLenMax&&this.player.y>-this.MainGame.screenHeightLenMax)
      ){
        this.node.y += (this.player.y - this.node.y) * (1 / 60) * this.speed;
      }
      if(
        (this.player.y>this.MainGame.screenHeightLenMax||this.player.y<-this.MainGame.screenHeightLenMax)&&
        (this.player.x<this.MainGame.screenWidthLenMax&&this.player.x>-this.MainGame.screenWidthLenMax)
      ){
        this.node.x += (this.player.x - this.node.x) * (1 / 60) * this.speed;
      }
    }

  },
});
