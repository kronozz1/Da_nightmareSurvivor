
cc.Class({
  extends: cc.Component,

  properties: {
    ball: {
      type: cc.Node,
      default: null,
    },
    hitEffect: {
      type: cc.Prefab,
      default: null,
    },
    arrow: {
      type: cc.Prefab,
      default: null,
    },
    showDamage: {
      type: cc.Prefab,
      default: null,
    },
  },

  onLoad() {
    this.HitThings = false;
    this.spd = 1800;
    this.p1 = cc.find("Canvas/GameObj/Player/fireDir");

    this.node.angle = this.p1.angle;
    // this.dir.nomarlitself()
    this.ball.angle = Math.random() * 360;
    this.random;
    this.r = 0;
    this.MainGame = cc.find("Canvas").getComponent("MainGame");

    setTimeout(() => {
      this.node.destroy();
    }, 1200);
  },

  start() {
    this.node.zIndex = this.node.y;
    var randomDir = Math.random();
    if (randomDir < 0.5) {
      this.node.angle -= 5 * randomDir;
      this.r = -1 * Math.random();
    } else {
      this.node.angle += 5 * randomDir;
      this.r = 1 * Math.random();
    }
  },

  update(dt) {
    var angle = (-this.node.angle / -180) * Math.PI;
    var dir = cc.v2(Math.cos(angle), Math.sin(angle));
    dir.normalizeSelf();
    var moveSpeed = this.spd;
    this.node.x += dt * dir.x * moveSpeed;
    this.node.y += dt * dir.y * moveSpeed;

    this.ball.x = 15 * Math.random();
    this.ball.y = 15 * Math.random();
    this.ball.angle += 5;

    this.ball.scaleX = 1 + Math.random() * 0.5;
    this.ball.scaleY = 1 + Math.random() * 0.5;
    if (this.node.zIndex > 0 && this.node.zIndex < 900) {
      this.node.zIndex = this.node.y;
    }
    if (this.node.zIndex < 0 && this.node.zIndex > -900) {
      this.node.zIndex = -this.node.y;
    }

    // 默认效果
    if (
      this.HitThings == true &&
      this.node.scaleX > 0 &&
      this.MainGame.thunder_01 == 1
    ) {
      this.node.group = "default";
      this.node.scaleX -= 0.1;
      this.node.scaleY -= 0.1;
      this.node.angle += this.r * 150;
    }

    // //星芒旋转效果
    // if(this.HitThings == true && this.node.scaleX <3 && this.MainGame.thunder_01 ==1){
    //     this.node.group = "default"
    //     this.node.scaleX += 0.2
    //     this.node.scaleY -= 0.1
    //     this.node.angle += this.r *150
    // }

    //剑气散开效果
    // if(this.HitThings == true && this.node.scaleX <5){
    //     this.node.group = "default"
    //     this.node.scaleX += 0.2
    //     this.node.scaleY -= 0.1
    //     this.node.angle += this.r *150
    // }

    //击中随机反弹效果
    if (
      this.HitThings == true &&
      this.node.scaleX < 2 &&
      this.MainGame.thunder_01 > 1
    ) {
      // this.node.group = "default"
      this.node.scaleX += 0.2;
      this.node.scaleY -= 0.2;
      this.node.angle += this.r * 50;
    }
  },
  onCollisionEnter(other, self) {
    this.MainGame.target = other.node;
    this.HitThings = true;
    let rect = new cc.Rect();
    self.world.aabb.intersection(rect, other.world.aabb);

    let pos5 = cc.v2(rect.x + rect.width / 2, rect.y + rect.height / 2);
    this.p = cc.find("Canvas/GameOnj/Player");

    //受击特效，随机偏移
    var Hit = cc.instantiate(this.hitEffect);
    Hit.parent = cc.find("Canvas/GameObj");
    let localPos = Hit.parent.convertToNodeSpaceAR(pos5);
    Hit.setPosition(
      localPos.x + Math.random() * 50,
      localPos.y + Math.random() * 50
    );

    Hit.angle += Math.random() * 360;
    Hit.scaleX += 0.5; //Math.random()
    Hit.scaleY += 0.5; //Math.random()
    var player = cc.find("Canvas/GameObj/Player");
    Hit.zIndex = player.zIndex;

    //伤害飘字
    if (other.node.group == "enemy") {
      var damage = cc.instantiate(this.showDamage);
      damage.parent = this.node.parent; //cc.find("Canvas/bj")
      damage.setPosition(
        localPos.x + Math.random() * 80,
        localPos.y + Math.random() * 80
      );
      damage.getComponent(cc.Label).string = this.MainGame.thunder_01_pow;
      damage.zIndex = 9998;
    }

    var shake = cc
      .find("Canvas/map/PlayerFollower/Main Camera")
      .getComponent("MainCam");
    shake.getShake(1.5);

    if (this.MainGame.agility_04 > 0) {
      var ARROW = cc.instantiate(this.arrow);
      ARROW.parent = Hit.parent;
      ARROW.setPosition(player.getPosition());
    }
    // }
  },
});
