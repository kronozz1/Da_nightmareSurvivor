cc.Class({
  extends: cc.Component,

  properties: {
    Player: {
      type: cc.Node,
      default: null,
    },
    swishSound: {
      type: cc.Node,
      default: null,
    },
    hitbox: {
      type: cc.Node,
      default: null,
    },
    thunderball: {
      type: cc.Prefab,
      default: null,
    },
    flash: {
      type: cc.Material,
      default: null,
    },
    flashEnd: {
      type: cc.Material,
      default: null,
    },
    hurtBox: {
      type: cc.Node,
      default: null,
    },
  },


  onLoad() {
    this.playing = 0;
    // this.btnAtk = cc.find("Canvas/UIcam/btnAtk").getComponent("btnAtk");
    this.MainGame = cc.find("Canvas").getComponent("MainGame");
    this.hitSound = this.swishSound.getComponent(cc.AudioSource);
    this.anim = this.node.getComponent(cc.Animation);
    this.runSound = this.node.getComponent(cc.AudioSource);
    this.playerScript = this.Player.getComponent("player");
  },
  moveOn() {
    if (this.playerScript.canATK == 0 && this.playerScript.IsAtk == 0) {
      this.playerScript.speed = this.MainGame.moveSpeed;
    }
  },
  //受伤反白
  hurt() {
    this.node.getComponent(cc.Sprite).setMaterial(0, this.flash);
    setTimeout(() => {
      this.node.getComponent(cc.Sprite).setMaterial(0, this.flashEnd);
    }, 100);
  },
  //动画事件，攻击位移
  force() {
    //攻击盒子生效和持续时间
    this.hitbox.group = "PlayerHitBox";
    setTimeout(() => {
      this.hitbox.group = "default";
    }, 50);
    //
    if (this.MainGame.thunder_01 >= 1) {
      var skill = cc.instantiate(this.thunderball);
      skill.parent = cc.find("Canvas/GameObj");

      skill.setPosition(this.Player.x, this.Player.y + 55);
    }

    // this.btnAtk.btnEffect();
    this.playerScript.IsAtk = 1;
    this.hitSound.play();
    if (this.playerScript.HitForce == 0) {
      this.playerScript.HitForce = 400;
    }
  },
  //左攻击动画事件
  atkEnd4(a) {
    this.playerScript.IsAtk = 0;
    this.playerScript.atkAnim = a;
    if (this.playerScript.canATK == 0) {
      this.playerScript.left2 = 1;
      this.playerScript.IsStand = 1;
      this.playerScript.stand();
    }
  },
  //右攻击动画事件
  atkEnd6(a) {
    this.playerScript.IsAtk = 0;
    this.playerScript.atkAnim = a;
    if (this.playerScript.canATK == 0) {
      this.playerScript.Right2 = 1;
      this.playerScript.IsStand = 1;
      this.playerScript.stand();
    }
  },
  //上攻击动画事件
  atkEnd8(a) {
    this.playerScript.IsAtk = 0;
    this.playerScript.atkAnim = a;
    if (this.playerScript.canATK == 0) {
      this.playerScript.Up2 = 1;
      this.playerScript.IsStand = 1;
      this.playerScript.stand();
    }
  },
  //下攻击动画事件
  atkEnd2(a) {
    this.playerScript.IsAtk = 0;
    this.playerScript.atkAnim = a;
    if (this.playerScript.canATK == 0) {
      this.playerScript.Down2 = 1;
      this.playerScript.IsStand = 1;
      this.playerScript.stand();
    }
  },
  //动画事件
  downEND() {
    this.playerScript.IsAtk = 0;
    this.hurtBox.group = "PlayerHurtBox";
    if (this.playerScript.down == 0) {
      this.anim.play("standDown");
    }
    if (this.playerScript.down2 == 1) {
      this.anim.play("moveDown");
    }
  },
  //动画事件
  upEND() {
    this.playerScript.IsAtk = 0;
    this.hurtBox.group = "PlayerHurtBox";
    if (this.playerScript.up == 0) {
      this.anim.play("standUp");
    }
    if (this.playerScript.up2 == 1) {
      this.anim.play("moveUp");
    }
  },
  //动画事件
  leftEND() {
    this.playerScript.IsAtk = 0;
    this.hurtBox.group = "PlayerHurtBox";
    if (this.playerScript.left == 0) {
      this.anim.play("standLeft");
    }
    if (this.playerScript.left2 == 1) {
      this.anim.play("moveLeft");
    }
  },
  //动画事件
  rightEND() {
    this.playerScript.IsAtk = 0;
    this.hurtBox.group = "PlayerHurtBox";
    if (this.playerScript.right == 0) {
      this.anim.play("standRight");
    }
    if (this.playerScript.right2 == 1) {
      this.anim.play("moveRight");
    }
  },
  runsound() {
    this.runSound.play();
  },
});
