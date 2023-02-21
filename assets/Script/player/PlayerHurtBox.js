cc.Class({
  extends: cc.Component,

  properties: {
    sprite: {
      type: cc.Node,
      default: null,
    },
    redMask: {
      type: cc.Node,
      default: null,
    },
    HPBAR: {
      type: cc.Node,
      default: null,
    },
  },

  onLoad() {
    this.hpHide = 0;
    this.MainGame = cc.find("Canvas").getComponent("MainGame");

    // this.HPBAR.opacity = 0
    this.HPBAR.opacity = 255;
    this.HPbar = this.HPBAR.getComponent(cc.ProgressBar);
  },

  onCollisionEnter(other, self) {
    // console.log(cc.director.getScheduler().getTimeScale())
    // cc.director.getScheduler().setTimeScale(1);

    this.redMask.opacity = 255;
    cc.director.getScheduler().setTimeScale(0.3);
    // 解开如下注释，角色受击后速度极快
    // cc.game.setFrameRate(20);
    this.sprite.getComponent("playerSprite").hurt();
    this.node.getComponent(cc.AudioSource).play();
    var shake = cc
      .find("Canvas/map/PlayerFollower/Main Camera")
      .getComponent("MainCam");
    shake.getShake(8);
    //受击停顿
    setTimeout(() => {
      cc.game.setFrameRate(60);
      cc.director.getScheduler().setTimeScale(1);
    }, 100);
  },
  //刷新血条
  showHPbar(d) {
    // this.showDamage(d)
    console.log(d);
    this.HPbar.progress = this.MainGame.PlayerHP / this.MainGame.PlayerMaxHP;
    clearTimeout(this.barTimer);
    if (this.MainGame.PlayerHP != this.MainGame.PlayerMaxHP) {
      this.HPBAR.opacity = 255;
      this.hpHide = 0;
      //血条隐
      this.barTimer = setTimeout(() => {
        this.hpHide = 1;
      }, 4000);
    }
  },
  //full HP
  fullHP() {
    this.HPbar.progress = 1;
  },
  update(dt) {
    if (this.redMask.opacity > 0) {
      this.redMask.opacity -= 7;
    }
    //血条渐隐
    if (this.hpHide == 1 && this.HPBAR.opacity >= 5) {
      this.HPBAR.opacity -= 5;
    }
  },
});
