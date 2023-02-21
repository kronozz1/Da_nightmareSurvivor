cc.Class({
  extends: cc.Component,

  properties: {
    enemy: {
      type: cc.Node,
      default: null,
    },
    die: {
      type: cc.Prefab,
      default: null,
    },
    sprite: {
      type: cc.Node,
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
    HPBAR: {
      type: cc.Node,
      default: null,
    },
    Damage: {
      type: cc.Node,
      default: null,
    },
    num: 1,
    hp: 20,
    maxhp: 20,
    state: "stand",
    speed: 500,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.Mother = cc
      .find("Canvas/spawnPointMother")
      .getComponent("spawnPointMother");
    this.MainGame = cc.find("Canvas").getComponent("MainGame");
    //
    this.MainGame.AllMonster += 1;
    cc.log(this.MainGame.AllMonster);
    this.node.zIndex = this.node.y * -1;
    this.state = null;
    this.hitforce = 0; //攻击时的位移
    this.target = cc.v2(0, 0); //自由走动时的目标
    //this.maxhp = this.hp
    this.onChase = false; //是否看见玩家
    this.player = cc.find("Canvas/GameObj/Player");
    this.canMove = false;
    // this.target = this.player.getPosition()
    this.findPlayer(); //计算与玩家的距离
    this.distance; //当前和玩家的距离
    this.atking = false; //是否在播攻击动画
    this.atkDir; //攻击突进方向
    this.IsRolling = false;
    this.HPbar = this.HPBAR.getComponent(cc.ProgressBar);
    //当次显示的累计伤害
    this.getDamage = 0;
    //开局满血隐藏血条
    this.HPBAR.opacity = 0;
    //隐藏血条开关
    this.hpHide = 0;
    this.showHPbar(); //血条

    setTimeout(() => {
      this.canMove = true;
      this.state = "stand";
    }, 800);
  },

  //受伤反白
  hurtflash() {
    this.sprite.getComponent(cc.Sprite).setMaterial(0, this.flash);
    this.flashTimer = setTimeout(() => {
      if (this.sprite != null) {
        this.sprite.getComponent(cc.Sprite).setMaterial(0, this.flashEnd);
      }
    }, 100);
  },
  //刷新血条
  showHPbar(d) {
    this.showDamage(d);
    clearTimeout(this.barTimer);
    if (this.hp != this.maxhp) {
      this.HPBAR.opacity = 255;
      this.hpHide = 0;
      //血条隐
      this.barTimer = setTimeout(() => {
        this.hpHide = 1;
      }, 4000);
    }
    this.onChase = true;
    this.hurtflash();
    this.HPbar.progress = this.hp / this.maxhp;
    if (this.hp <= 0) {
      this.MainGame.Kills += 1;
      this.node.group = "ui";
      clearTimeout(this.flashTimer);
      clearTimeout(this.TIMER);
      clearTimeout(this.playerstand);
      this.HPBAR.opacity = 0;
      var dieEffect = cc.instantiate(this.die);
      dieEffect.parent = this.node.parent;
      dieEffect.setPosition(this.node.x, this.node.y + 100);
      dieEffect.getComponent(cc.AudioSource).volume = 0.8;
      dieEffect.getComponent(cc.AudioSource).play();
      //刷新刷怪点数据
      this.Mother.monsterReSpawn();
      
      console.log(this.MainGame.currentLastLavelMonsterNum)
      if((this.MainGame.currentLastLavelMonsterNum-1)==0){
        cc.find("Canvas/UI").getComponent("spawnAskillBall").getSkillBallByPosition(this.node.x,this.node.y);
      }else if(this.MainGame.currentLastLavelMonsterNum<0){
        this.MainGame.currentLastLavelMonsterNum = 0;
      }
      this.MainGame.currentLastLavelMonsterNum = this.MainGame.currentLastLavelMonsterNum -1
      this.node.destroy();
    }
    // cc.log(this.node.getComponent(cc.Sprite).Material)
  },

  //显示扣血数字
  showDamage(d) {
    clearTimeout(this.sdTimer);
    let a = this.getDamage;

    if (this.getDamage > 30) {
      this.Damage.getComponent(cc.Label).fontSize = 40;
    }
    if (this.getDamage > 100) {
      this.Damage.getComponent(cc.Label).fontSize = 50;
    }
    this.Damage.getComponent(cc.Label).string = a;
    // something error
    // this.Damage.getComponent(cc.Animation).play("showDamage")
    this.sdTimer = setTimeout(() => {
      this.getDamage = 0;
    }, 800);
  },

  //受伤碰撞
  onCollisionEnter(other, self) {
    if (this.hp > 0) {
        console.log(other.node.name)
      switch (other.node.name) {
        //基本攻击打中
        case "PlayerHitBox":
        //   console.log("PlayerHitBox");
          this.hp -= this.MainGame.basicATK;
          this.getDamage += this.MainGame.basicATK;
          this.showHPbar(this.MainGame.basicATK);
          if (this.atking != true) {
            this.state = "hurt";
          }
          break;
        //闪电球打中
        case "thunder_01":
          this.hp -= this.MainGame.thunder_01_pow;
          this.getDamage += this.MainGame.thunder_01_pow;
          this.showHPbar(this.MainGame.thunder_01_pow);
          if (this.atking != true) {
            this.state = "hurt";
          }
          break;
        //落雷打中
        case "dash_hit_thunder_effect":
          this.hp -= this.MainGame.thunder_02_pow;
          this.getDamage += this.MainGame.thunder_02_pow;
          this.showHPbar(this.MainGame.thunder_02_pow);
          if (this.atking != true) {
            this.state = "hurt";
          }
          break;
        //追踪箭击中
        case "agility_04":
          this.hp -= this.MainGame.agility_04_pow;
          this.getDamage += this.MainGame.agility_04_pow;
          this.showHPbar(this.MainGame.agility_04_pow);
          if (this.atking != true) {
            this.state = "hurt";
          }
          break;
      }
    }
  },
  //行为刷新
  timer(t) {
    // console.log("刷新行为");
    this.IsRolling = true;
    clearTimeout(this.TIMER);
    this.TIMER = setTimeout(() => {
      let r = Math.random();

      if (this.onChase == false) {
        if (r >= 0.7) {
          this.state = "stand";
        } else if (r >= 0.3 && r < 0.7 && this.atking == false) {
          this.state = "move";
        } else if (r >= 0 && r < 0.3 && this.atking == false) {
          this.state = "atk";
        }
      } else {
        if (r >= 0.8) {
          this.state = "stand";
        } else if (r >= 0.4 && r < 0.8 && this.atking == false) {
          if (this.distance < 100) {
            this.state = "atk";
          } else {
            this.state = "chase";
          }
        } else if (r >= 0 && r < 0.4 && this.atking == false) {
          this.state = "atk";
        }
      }

      this.roll();
    }, t);
  },
  //行为执行几率
  roll() {
    // console.log("执行roll()");
    if (this.IsRolling == false) {
      // console.log("roll")
      this.timer(1000);
    }
  },
  //待机
  stand() {
    this.findPlayer();

    if (this.atking == false) {
      this.IsRolling = false;
      // clearTimeout(this.atkEndTime)
      // clearTimeout(this.atkTime)
      // this.atking = false
      this.target = cc.v2(0, 0);

      let R = Math.random();
      if (R >= 0.5) {
        this.node.scaleX = this.node.scaleX * -1;
        this.HPBAR.scaleX = this.HPBAR.scaleX * -1;
      }
      this.sprite.getComponent(cc.Animation).play("monster01_stand");

      // console.log("stand")
    }
  },
  //漫游
  move() {
    if (this.atking == false) {
      this.IsRolling = false;
      // clearTimeout(this.atkEndTime)
      // clearTimeout(this.atkTime)
      // this.atking = false
      // console.log("move")
      var r = Math.random();
      var r2 = Math.random();
      var a;
      var b;
      if (r < 0.5) {
        a = -1;
      } else {
        a = 1;
      }
      if (r2 < 0.5) {
        b = -1;
      } else {
        b = 1;
      }

      this.sprite.getComponent(cc.Animation).play("monster01_run");
      if (this.onChase == false) {
        this.target = cc
          .v2(
            (50 + Math.random() * 200) * a - this.enemy.x,
            80 + Math.random() * 200 * b - this.enemy.y
          )
          .normalizeSelf();
      } else {
        this.target = cc
          .v2(
            (this.player.x + Math.random() * 200) * a - this.enemy.x,
            this.player.y + Math.random() * 200 * b - this.enemy.y
          )
          .normalizeSelf();
      }

      this.roll();
    }
  },
  //受伤
  hurt() {
    if (this.atking == false) {
      this.IsRolling = false;
      clearTimeout(this.playerstand);
      // clearTimeout(this.atkEndTime)
      // clearTimeout(this.atkTime)

      this.playerstand = setTimeout(() => {
        this.stand();
      }, 800);
      this.target = cc.v2(0, 0);
      //受击反白
      this.hurtflash();

      this.sprite.getComponent(cc.Animation).play("monster01_hurt");
    }
    // this.timer(500)
  },
  //追玩家
  chase() {
    if (this.distance < 100) {
      this.state = "atk";
      return;
    }

    if (this.atking == false) {
      this.IsRolling = false;
      // clearTimeout(this.atkEndTime)
      // clearTimeout(this.atkTime)
      // this.atking = false
      // cc.log("chase")
      var r = Math.random();
      var r2 = Math.random();
      var a;
      var b;
      if (r < 0.5) {
        a = -1;
      } else {
        a = 1;
      }
      if (r2 < 0.5) {
        b = -1;
      } else {
        b = 1;
      }

      this.sprite.getComponent(cc.Animation).play("monster01_run");
      this.target = cc
        .v2(
          (this.player.x + 100 + Math.random() * 200) * a - this.enemy.x,
          this.player.y + Math.random() * 100 * b - this.enemy.y
        )
        .normalizeSelf();

      this.roll();
    }
  },
  //攻击
  atk() {
    if (this.atking == false) {
      this.hitforce = 0;
      this.IsRolling = false;
      // cc.log("atk")
      clearTimeout(this.atkEndTime);
      clearTimeout(this.TIMER);

      this.atkDir = cc
        .v2(this.player.x - this.enemy.x, this.player.y - this.enemy.y)
        .normalizeSelf();
      // this.atkTime = setTimeout(() => {
      //     this.hitforce = 5

      // }, 600);

      this.target = cc.v2(0, 0);
      if (this.player.x < this.node.x) {
        this.node.scaleX = -1;
        this.HPBAR.scaleX = -1;
      }
      if (this.player.x > this.node.x) {
        this.node.scaleX = 1;
        this.HPBAR.scaleX = 1;
      }
      this.sprite.getComponent(cc.Animation).play("monster01_atk");

      this.atkEndTime = setTimeout(() => {
        this.atking = false;
        this.state = "stand";
      }, 1500);
    }
  },

  //索敌
  findPlayer() {
    // console.log("findPlayer()11")
    if (this.onChase == false && this.canMove == true) {
        // console.log("findPlayer()22")
      //检测玩家和自己的距离
      let p1 = cc.v2(this.node.x, this.node.y);
      let p2 = cc.v2(this.player.x, this.player.y);
      let distance = p1.sub(p2).mag();
      this.distance = distance;
      console.log("距离玩家" + distance);
      if (distance < 200) {
        this.onChase = true;
        this.state = "chase";
      }
    }
  },

  update(dt) {
    this.node.zIndex = -this.node.y;
    //血条渐隐
    if (this.hpHide == 1 && this.HPBAR.opacity >= 5) {
      this.HPBAR.opacity -= 5;
    }

    //移动前坐标
    let prePos = this.node.getPosition();
    //移动
    this.enemy.x += this.target.x * this.speed * (1 / 40);
    this.enemy.y += this.target.y * this.speed * (1 / 40);
    //  console.log(this.target.x)
    //攻击突进
    if (this.atking == true) {
      this.enemy.x += this.atkDir.x * this.speed * (1 / 40) * this.hitforce;
      this.enemy.y += this.atkDir.y * this.speed * (1 / 40) * this.hitforce;
      if (this.hitforce >= 0.2) {
        this.hitforce -= 0.2;
      }
    }
    //移动后坐标
    let curPos = this.node.getPosition();

    //  this.node.zIndex = this.node.y*-1

    if (curPos.x > prePos.x) {
      this.node.scaleX = 1;
      this.HPBAR.scaleX = 1;
      this.findPlayer();
    }
    if (curPos.x < prePos.x) {
      this.node.scaleX = -1;
      this.HPBAR.scaleX = -1;
      this.findPlayer();
    }
    //  if(this.state != "hurt" && this.state != "atk" && prePos == curPos){
    //     this.state = "stand "

    //  }

    //状态切换
    // if(this.state){
    //     console.log(this.state)
    // }
    switch (this.state) {
      case "stand":
        this.stand();
        this.node.zIndex = this.node.y * -1;
        this.state = null;
        break;

      case "move":
        this.move();
        this.state = null;

        break;

      case "chase":
        this.chase();
        this.node.zIndex = this.node.y * -1;
        this.state = null;
        break;

      case "atk":
        this.atk();
        this.node.zIndex = this.node.y * -1;
        this.state = null;
        break;

      case "hurt":
        this.hurt();
        this.node.zIndex = this.node.y * -1;
        this.state = null;
        break;
    }
  },
});
