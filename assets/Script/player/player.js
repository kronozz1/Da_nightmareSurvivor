cc.Class({
  extends: cc.Component,

  properties: {
    sprite: {
      type: cc.Node,
      default: null,
    },
    // firePoint: {
    //   type: cc.Node,
    //   default: null,
    // },

    daizi: {
      type: cc.Node,
      default: null,
    },
    // dashskillEffectPrefabs: {
    //   type: [cc.Prefab],
    //   default: null,
    // },
    speed: 500,
    // dash
    hurtBox: {
      type: cc.Node,
      default: null,
    },
    dashEff: {
      type: cc.Prefab,
      default: null,
    },
    //雷电冲刺
    dashHit01_Eff: {
      type: cc.Prefab,
      default: null,
    },
  },

  onLoad() {
    this.Rocker = cc.find("Canvas/UI/Rocker").getComponent("Rocker");
    this.MainGame = cc.find("Canvas").getComponent("MainGame");
    //1 表示可移动状态，btnDash 按键中，禁止移动和冲刺状态的叠加，冲刺完毕后 canmove变回 1
    this.canMove = 1;
    //攻击两段动画中的其中一段
    this.atkAnim = 1;
    //1 表示正在播放攻击动画，禁止其他动画
    this.canATK = 0;
    //攻击位移
    this.HitForce = 0;
    //是否正在攻击
    this.IsAtk = 0;
    //dash距离，由 btnDash 传入
    this.dash = 0;

    //确保 stand（）中，只指定一次播放待机循环的动画，避免 update（）的每帧执行播放的指令
    this.IsStand = 0;

    //键盘移动开关
    this.left = 0;
    this.right = 0;
    this.up = 0;
    this.down = 0;

    //手指移动开关，并且决定移动状态切换到待机状态后，播放哪一个朝向的待机动画，
    this.left2 = 0;
    this.right2 = 0;
    this.up2 = 0;
    this.down2 = 0;

    //攻击动画方向:小键盘数字方位，4-左,8-上,2-下,6-右
    this.atkDir = 4;

    //朝向点方向
    this.dir = cc.v2(1, 0);

    this.faceTo = this.node.getChildByName("fireDir");

    this.Anim = this.sprite.getComponent(cc.Animation);
    this.runsound = this.sprite.getComponent(cc.AudioSource);

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  start() {
    //在父节点中的显示层级
    this.node.zIndex = this.node.y;
  },
  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.left = 1;

        this.daizi.zIndex = -1;
        this.Rocker.dir.x = -1;
        this.Rocker.dir.normalizeSelf();
        break;
      case cc.macro.KEY.d:
        this.right = 1;

        this.daizi.zIndex = -1;
        this.Rocker.dir.x = 1;
        this.Rocker.dir.normalizeSelf();
        break;
      case cc.macro.KEY.w:
        this.up = 1;

        this.daizi.zIndex = 1;
        this.Rocker.dir.y = 1;
        this.Rocker.dir.normalizeSelf();
        break;
      case cc.macro.KEY.s:
        this.down = 1;

        this.daizi.zIndex = -1;
        this.Rocker.dir.y = -1;
        this.Rocker.dir.normalizeSelf();
        break;
      case cc.macro.KEY.n:
        this.MainGame.addspd = 0.0001;
        this.MainGame.MainSpeed = 0.0;
        cc.kSpeed(this.MainGame.MainSpeed);
        break;
      case cc.macro.KEY.u:
        this.canATK = 1;
        this.speed = 50;
        break;
      case cc.macro.KEY.i:
        this.DASH();
        break;
    }
  },

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.left = 0;
        this.Rocker.dir.x = 0;
        break;
      case cc.macro.KEY.d:
        this.right = 0;
        this.Rocker.dir.x = 0;
        break;
      case cc.macro.KEY.w:
        this.up = 0;
        this.Rocker.dir.y = 0;
        break;
      case cc.macro.KEY.s:
        this.down = 0;
        this.Rocker.dir.y = 0;
        break;
      // slow-speed run
      case cc.macro.KEY.n:
        break;
      // attack
      case cc.macro.KEY.u:
        this.canATK = 0;
        break;
      // dash
      case cc.macro.KEY.i:
        break;
    }
  },
/* *******************************************
* dash
*********************************************/
  GetNewDash() {
    switch (this.MainGame.dashHit) {
      //雷电冲刺
      case 1:
        this.dashskill = this.dashHit01_Eff;
        break;
    }
  },
  DASH() {
    this.GetNewDash();

    if (this.MainGame.dashPoint >= 1) {
      this.hurtBox.group = "default";
      //默认冲刺粉色拖尾
      var DASHEFF1 = cc.instantiate(this.dashEff);
      // console.log(DASHEFF1)
      DASHEFF1.parent = cc.find("Canvas/GameObj");
      DASHEFF1.x = this.node.x;
      DASHEFF1.y = this.node.y + 38;
      //拖尾消失
      setTimeout(() => {
        var ParticleSystem = DASHEFF1.getComponent(cc.ParticleSystem);
        ParticleSystem.stopSystem();
      }, 100);

      // var sound = DASHEFF.getComponent(cc.AudioSource)
      // this.DASHEFF.resetSystem()
      // sound.play()

      //判定用哪一个冲刺特效
      if (this.MainGame.dashHit > 0) {
        setTimeout(() => {
          var DASHhitEFF = cc.instantiate(this.dashskill);
          DASHhitEFF.parent = cc.find("Canvas/GameObj/dashHitEff_box");
          cc.find("Canvas/GameObj/dashHitEff_box").zIndex = -9999;
          DASHhitEFF.x = this.node.x;
          DASHhitEFF.y = this.node.y;
        }, 150);
      }

      this.canMove = 0;
      this.dash = this.MainGame.dashTime;

      //冲刺结束
      setTimeout(() => {
        this.dash = 0;
      }, 100);
      //冲刺完可行走
      setTimeout(() => {
        this.canMove = 1;
        this.IsAtk = 0;
        this.hurtBox.group = "PlayerHurtBox";
      }, 180);

      //当前冲刺次数消耗
      this.MainGame.dashPoint -= 1;
      this.MainGame.dashRest();
    }
  },

/* *******************************************
* dash end
*********************************************/

  lookAtObj(target) {
    if (target != null || this.Rocker.dir.mag() > 0.5) {
      //计算出朝向
      var dir = cc.v2(this.dir.x, this.dir.y);

      //根据朝向计算出夹角弧度
      var angle = dir.signAngle(cc.v2(1, 0));

      //将弧度转换为欧拉角
      var degree = (angle / Math.PI) * 180;

      //赋值给节点
      this.faceTo.angle = -degree;
    }
  },

  //播放待机动画
  stand() {
    if (this.IsStand == 1) {
      this.runsound.stop();
      if (this.atkDir == 4 || this.left2 == 1) {
        if (this.canATK == 0) {
          this.Anim.play("standLeft");
          this.speed = this.MainGame.moveSpeed;
          this.faceTo.angle = -180;
        }
      }
      if (this.atkDir == 6 || this.right2 == 1) {
        if (this.canATK == 0) {
          this.Anim.play("standRight");
          this.speed = this.MainGame.moveSpeed;
        }
        this.faceTo.angle = 0;
      }
      if (this.atkDir == 8 || this.up2 == 1) {
        if (this.canATK == 0) {
          this.Anim.play("standUp");
          this.speed = this.MainGame.moveSpeed;
        }
        this.faceTo.angle = 90;
      }
      if (this.atkDir == 2 || this.down2 == 1) {
        if (this.canATK == 0) {
          this.Anim.play("standDown");
          this.speed = this.MainGame.moveSpeed;
        }
        this.faceTo.angle = -90;
      }
      this.IsAtk = 0;
      this.left2 = 0;
      this.up2 = 0;
      this.down2 = 0;
      this.right2 = 0;
      this.IsStand = 0;
    }
  },
  //播放攻击动画
  attack() {
    if (this.canATK == 1 && this.IsAtk == 0) {
      if (this.atkDir == 4) {
        if (this.atkAnim == 1) {
          this.Anim.play("attackLeft").speed = this.MainGame.atkSpeed;
        }
        if (this.atkAnim == 2) {
          this.Anim.play("attackLeft2").speed = this.MainGame.atkSpeed;
        }
      }
      if (this.atkDir == 6) {
        if (this.atkAnim == 1) {
          this.Anim.play("attackRight").speed = this.MainGame.atkSpeed;
        }
        if (this.atkAnim == 2) {
          this.Anim.play("attackRight2").speed = this.MainGame.atkSpeed;
        }
      }
      if (this.atkDir == 2) {
        if (this.atkAnim == 1) {
          this.Anim.play("attackDown").speed = this.MainGame.atkSpeed;
        }
        if (this.atkAnim == 2) {
          this.Anim.play("attackDown2").speed = this.MainGame.atkSpeed;
        }
      }
      if (this.atkDir == 8) {
        if (this.atkAnim == 1) {
          this.Anim.play("attackUp").speed = this.MainGame.atkSpeed;
        }
        if (this.atkAnim == 2) {
          this.Anim.play("attackUp2").speed = this.MainGame.atkSpeed;
        }
      }
      this.IsAtk = 1;
    }
  },
  //播放移动动画
  move() {
    this.node.zIndex = -this.node.y;

    //右动画
    if (
      this.faceTo.angle <= 45 &&
      this.faceTo.angle > -45 &&
      this.right2 == 0
    ) {
      if (this.canATK == 0) {
        this.Anim.play("moveRight");
        this.IsAtk = 0;
      }
      this.atkDir = 6;
      this.daizi.zIndex = -1;
      this.daizi.y = 37 + 10;
      this.daizi.x = 7;
      this.left2 = 0;
      this.up2 = 0;
      this.down2 = 0;
      this.right2 = 1;
      this.IsStand = 1;

      return;
    }
    //上动画

    if (this.faceTo.angle <= 135 && this.faceTo.angle > 45 && this.up2 == 0) {
      if (this.canATK == 0) {
        this.Anim.play("moveUp");
        this.IsAtk = 0;
      }
      this.atkDir = 8;
      this.daizi.zIndex = 1;
      this.daizi.y = 37 + 10;
      this.daizi.x = 0;
      this.right2 = 0;
      this.left2 = 0;
      this.down2 = 0;
      this.up2 = 1;
      this.IsStand = 1;

      return;
    }
    //左
    if (
      (this.faceTo.angle <= 180 &&
        this.faceTo.angle > 135 &&
        this.left2 == 0) ||
      (this.faceTo.angle >= -180 && this.faceTo.angle < -135 && this.left2 == 0)
    ) {
      if (this.canATK == 0) {
        this.Anim.play("moveLeft");
        this.IsAtk = 0;
      }

      this.atkDir = 4;
      this.daizi.zIndex = -1;
      this.daizi.y = 37 + 10;
      this.daizi.x = -7;
      this.right2 = 0;
      this.up2 = 0;
      this.down2 = 0;
      this.left2 = 1;
      this.IsStand = 1;

      return;
    }
    //下动画
    if (
      this.faceTo.angle >= -135 &&
      this.faceTo.angle <= -45 &&
      this.down2 == 0
    ) {
      if (this.canATK == 0) {
        this.Anim.play("moveDown");
        this.IsAtk = 0;
      }

      this.atkDir = 2;
      this.daizi.zIndex = -1;
      this.daizi.x = 0;
      this.daizi.y = 37;
      this.right2 = 0;
      this.left2 = 0;
      this.up2 = 0;
      this.down2 = 1;
      this.IsStand = 1;

      return;
    }
  },

  update(dt) {
    console.log("player group:"+this.node.group)
    // console.log(this.MainGame.moveSpeed)
    this.node.zIndex = -this.node.y;
    if (this.MainGame.GameEvent == 0) {
      this.attack();

      //冲刺
      if (this.dash > 0) {
        this.canMove = 0;
        if (this.faceTo.angle <= 135 && this.faceTo.angle > 45) {
          this.Anim.play("dashUp");
        }
        if (this.faceTo.angle >= -135 && this.faceTo.angle <= -45) {
          this.Anim.play("dashDown");
        }
        if (this.faceTo.angle <= 45 && this.faceTo.angle > -45) {
          this.Anim.play("dashRight");
        }
        if (
          (this.faceTo.angle <= 180 && this.faceTo.angle > 135) ||
          (this.faceTo.angle >= -180 && this.faceTo.angle < -135)
        ) {
          this.Anim.play("dashLeft");
        }
        var vx = this.dir.x * (this.speed + this.dash);
        var vy = this.dir.y * (this.speed + this.dash);

        var sx = vx * (1 / 60);
        var sy = vy * (1 / 60);

        // this.node.x += sx * this.MainGame.MainSpeed;
        // this.node.y += sy * this.MainGame.MainSpeed;

        let viewSize = cc.view.getVisibleSize();
        let maxWidth = (this.MainGame.screenWidthLenMax+viewSize.width/2)
        let maxHeight = (this.MainGame.screenHeightLenMax+viewSize.height/2)
        
        let preNodeX = this.node.x + sx * this.MainGame.MainSpeed
        let preNodeY = this.node.y + sy * this.MainGame.MainSpeed

        if(preNodeX<maxWidth&&preNodeX>-maxWidth){
          this.node.x += sx * this.MainGame.MainSpeed;
        }else{
          if(preNodeX>maxWidth){
            this.node.x = maxWidth
          }else if(preNodeX<-maxWidth){
            this.node.x = -maxWidth
          }
        }
        if(preNodeY<maxHeight&&preNodeY>-maxHeight){
          this.node.y += sy * this.MainGame.MainSpeed;
        }else{
          if(preNodeY>maxHeight){
            this.node.y = maxHeight
          }else if(preNodeY<-maxHeight){
            this.node.y = -maxHeight
          }
        }
      }

      //键盘移动
      if (this.left == 1) {
        this.node.zIndex = -this.node.y;
      }
      if (this.right == 1) {
        this.node.zIndex = -this.node.y;
      }
      if (this.up == 1) {
        this.node.zIndex = -this.node.y;
      }
      if (this.down == 1) {
        this.node.zIndex = -this.node.y;
      }
      //移动
      if (this.Rocker.dir.mag() < 0.5) {
        // if (this.firePoint.x >= 40) {
        //   this.firePoint.x -= 4;
        //   this.firePoint.opacity -= 8;
        // }

        this.stand();

        return;
      }
      //朝向点显示

      if (this.Rocker.dir.mag() >= 0.5) {
        //&&  ){
        this.move();
        //朝向敌人
        this.lookAtObj();
        // if (this.firePoint.x < 150) {
        //   this.firePoint.x += 4;
        //   this.firePoint.opacity += 5;
        // }
        if (this.canMove == 1) {
          var vx = this.Rocker.dir.x * (this.speed + this.dash + this.HitForce);
          var vy = this.Rocker.dir.y * (this.speed + this.dash + this.HitForce);
          // console.log("this.HitForce:"+ this.HitForce)
          // console.log("this.dash:"+ this.dash)
          // console.log("(this.speed + this.dash + this.HitForce):"+ (this.speed + this.dash + this.HitForce))
          // console.log("this.MainGame.MainSpeed:"+ this.MainGame.MainSpeed)

          var sx = vx * (1 / 60);
          var sy = vy * (1 / 60);

          // this.node.x += sx * this.MainGame.MainSpeed;
          // this.node.y += sy * this.MainGame.MainSpeed;

          let viewSize = cc.view.getVisibleSize();
          let maxWidth = (this.MainGame.screenWidthLenMax+viewSize.width/2)
          let maxHeight = (this.MainGame.screenHeightLenMax+viewSize.height/2)
          let preNodeX = this.node.x + sx * this.MainGame.MainSpeed
          let preNodeY = this.node.y + sy * this.MainGame.MainSpeed
  
          if(preNodeX<maxWidth&&preNodeX>-maxWidth){
            this.node.x += sx * this.MainGame.MainSpeed;
          }else{
            if(preNodeX>maxWidth){
              this.node.x = maxWidth
            }else if(preNodeX<-maxWidth){
              this.node.x = -maxWidth
            }
          }
          if(preNodeY<maxHeight&&preNodeY>-maxHeight){
            this.node.y += sy * this.MainGame.MainSpeed;
          }else{
            if(preNodeY>maxHeight){
              this.node.y = maxHeight
            }else if(preNodeY<-maxHeight){
              this.node.y = -maxHeight
            }
          }

          if (this.HitForce > 0) {
            this.HitForce -= 100;
          }

          this.dir = this.Rocker.dir;
          return this.dir;
        }
      }
    }
  },
});
