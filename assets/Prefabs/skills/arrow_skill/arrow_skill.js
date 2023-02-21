cc.Class({
  extends: cc.Component,

  properties: {
    sprite: {
      type: cc.Node,
      default: null,
    },
    hitEffect: {
      type: cc.Prefab,
      default: null,
    },
    showDamage: {
      type: cc.Prefab,
      default: null,
    },
  },

  onLoad() {
    this.Opos = cc.v2(this.node.getPosition());
    this.MainGame = cc.find("Canvas").getComponent("MainGame");

    //是否击中目标
    this.hit = false;

    this.a;
    this.b;
    //初始速度
    this.speed = 100 + Math.random() * 100;

    //玩家当前目标
    this.target = this.MainGame.target;
    // 初始角度
    let prePos = this.Opos;

    // 默认方向为（0，1）即y轴朝上为0度
    let curPos = cc.v2(this.target.x, this.target.y);
    let origin = cc.v2(0, 1);
    let dis = curPos.subSelf(prePos);
    let r = origin.signAngle(dis);
    let angle = cc.misc.radiansToDegrees(r);
    this.node.angle = angle;
    this.newT = curPos;
    this.name = this.target.name;
    this.randomA();
    this.randomB();
    this.downx = 10 + Math.random() * 20;
    this.downy = 10 + Math.random() * 20;
  },
  randomA() {
    if (Math.random() > 0.5) {
      this.a = -1;
    } else {
      this.a = 1;
    }
  },

  randomB() {
    if (Math.random() > 0.5) {
      this.b = -1;
    } else {
      this.b = 1;
    }
  },
  start() {
    setTimeout(() => {
      this.done();
    }, 3500);
  },

  update(dt) {
    if (this.hit == false) {
      let prePos = this.Opos;
      let dir = cc.v2(this.newT.x - this.node.x, this.newT.y - this.node.y);
      dir = dir.normalizeSelf();
      //随机位置推力
      this.node.y += this.downy * this.a;
      this.node.x += this.downx * this.b;
      //正常前进速度
      this.node.x += dir.x * this.speed * dt;
      this.node.y += dir.y * this.speed * dt;
      //飞行加速度
      this.speed += 50 / 2;
      //推力递减
      if (this.downy >= 0.5) {
        this.downy -= 0.5;
        this.downx -= 0.5;
      }

      // 更新角度
      let curPos = this.node.getPosition();

      let dis = curPos.subSelf(prePos);
      // dis = dis.normalizeSelf();
      // 默认方向为（0，1）即y轴朝上为0度
      let origin = cc.v2(0, 1);

      let r = origin.signAngle(dis);
      let angle = cc.misc.radiansToDegrees(r);
      // cc.log("angle:", angle);
      this.node.angle = angle;

      this.Opos = this.node.getPosition();
      this.node.zIndex = 100; //this.node.y
    } else {
      this.sprite.opacity -= 20;
    }

    // console.log(this.target.name)
    if (this.name == this.target.name) {
      this.newT = cc.v2(this.target.x, this.target.y);

      // console.log("1")
    } else {
      this.done();
      // this.hit = true
    }
  },

  onCollisionEnter(other, self) {
    setTimeout(() => {
      this.hit = true;
    }, 30);

    //伤害飘字
    if (other.node.group == "enemy") {
      var damage = cc.instantiate(this.showDamage);
      damage.parent = this.node.parent; //cc.find("Canvas/GameObj")
      damage.setPosition(this.node.getPosition());
      damage.getComponent(cc.Label).string = this.MainGame.agility_04_pow;
      damage.zIndex = 9998;
    }

    // //受击特效，随机偏移
    var Hit = cc.instantiate(this.hitEffect);
    Hit.parent = this.node.parent; //cc.find("Canvas/GameObj")
    Hit.setPosition(this.node.getPosition());

    Hit.angle += Math.random() * 360;

    setTimeout(() => {
      if (this.node != null) this.node.destroy();
    }, 500);
  },
  done() {
    this.hit = true;
    if (this.sprite != null) {
      this.sprite.opacity = 0;
    }

    setTimeout(() => {
      if (this.node != null) {
        this.node.destroy();
      }
    }, 500);
  },
});
