
cc.Class({
  extends: cc.Component,

  properties: {
    ball: {
      type: cc.Prefab,
      default: null,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {},

  start() {

  },
  //过关
  giveABall() {

  },

  getSkillBall(){
    this.getSkillBallByPosition(cc.find("Canvas/GameObj/Player").x+200,cc.find("Canvas/GameObj/Player").y+200)
  },
  getSkillBallByPosition(x,y){
    var Ball = cc.instantiate(this.ball)
    Ball.parent = cc.find("Canvas/GameObj")
    Ball.x = x
    Ball.y = y
    // Ball.setSiblingIndex(999)
  },

  update(dt) {
    if (this.node.scaleX > 1) {
      this.node.scaleX -= 0.05;
      this.node.scaleY -= 0.05;
    }
  },
});
