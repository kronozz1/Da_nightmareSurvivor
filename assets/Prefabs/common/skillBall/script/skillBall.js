// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    getBallLight01: {
      type: cc.Prefab,
      default: null,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.get = 0;
    this.hide = 0;
    // this.a = 0.1
    this.MainGame = cc.find("Canvas").getComponent("MainGame");
    this.player = cc.find("Canvas/GameObj/Player/Sprite");
    this.playerAnim = this.player.getComponent(cc.Animation);
  },
  update(dt) {
    if (this.hide == 1) {
      this.node.opacity -= 5;
      if (this.node.opacity <= 0) {
        this.node.destroy();
      }
    }
    this.node.zIndex = -this.node.y;
  },

  onCollisionEnter(other, self) {
    console.log("onCollisionEnter.......")
    if (other.node.group == "player") {
      console.log("player...........")
      //主角停下来。音乐停下来
      this.MainGame.GameEvent = 1;
      this.MainGame.BGM_END();
      this.playerAnim.stop();

      setTimeout(() => {
        //技能选择界面
        cc.find("Canvas/UI/SkillPlane").getComponent("skillPanel").openPanel();
        //果子渐渐消失开关
        this.hide = 1;
      }, 500);
      setTimeout(() => {
        this.playerAnim.play();
      }, 700);
      this.get = 1;
      // cc.director.getScheduler().setTimeScale(0)

      var light_01 = cc.instantiate(this.getBallLight01);
      light_01.parent = this.node;
      light_01.setPosition(0, 50);
    }
  },
});
