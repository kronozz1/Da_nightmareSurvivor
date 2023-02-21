cc.Class({
  extends: cc.Component,

  properties: {},

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.screenHeightLenMax = 400
    this.screenWidthLenMax = 400

    this.lavelFlag = 0;
    this.totalLavelNum = 0;
    this.monsterNum = 2;
    this.currentLastLavelMonsterNum = 0;//默认为最大值

    // cc.game.setFrameRate(10)//帧率设置
    cc.director.getCollisionManager().enabled = true;
    cc.director.getPhysicsManager().enabled = true;
    //cc.director.getCollisionManager().enabledDebugDraw = true;
    //引擎全局速度，慢动作用
    this.MainSpeed = 1;
    this.addspd = 0.0001;
    //关卡完成
    this.Clear = false;
    //禁止刷怪
    this.unSpawn = true;
    //累计当关生成的怪物数量
    this.AllMonster = 0;
    //累计当关杀敌数量
    this.Kills = 0;
    //当前目标
    this.target = null;

    this.BGM = this.node.getComponent(cc.AudioSource);
    this.BGM.volume = 0;
    this.BGM_ON = 0;
    //事件触发，true：1=玩家不可操作;0=玩家可操作；
    this.GameEvent = 0;
    //主角移动速度
    this.moveSpeed = 600;
    //最大冲刺次数
    this.dashMaxPoint = 2;
    //初始冲刺次数
    this.dashPoint = this.dashMaxPoint;
    //基础攻击力
    this.basicATK = 5;
    //玩家生命上限
    this.PlayerMaxHP = 30;
    //玩家当前生命
    this.PlayerHP = this.PlayerMaxHP;

    /////////////     技能      ////////////////

    //冲击伤害技能    1--闪电冲刺（召唤雷击）    2---虚弱（减弱敌人伤害）
    // this.dashHit = 1;//有雷电击中的冲刺
    this.dashHit = -1; // 无效果
    this.dashTime = 1000

    //雷系列
    this.thunder_01 = 0; //闪电球，攻击能发出飞行道具，反弹？
    // this.thunder_01 = 1; //闪电球，攻击能发出飞行道具，反弹？
    this.thunder_01_pow = 2;

    this.thunder_02 = 0; //雷霆之怒,有几率召唤额为的雷击
    this.thunder_02_pow = 3;
    this.thunderCunt = 0; //当前落雷数量

    //敏捷系列
    this.agility_01 = 0; //攻速提升，几率
    this.agility_02 = 0; //冲刺次数，直接增加次数
    this.agility_03 = 0; //近身暴击率
    this.agility_04 = 0; //发追踪箭，数值为直接伤害
    this.agility_04_pow = 1;

    //攻击速度
    this.atkSpeed = 1.2; //+ this.agility_01


    //复活次数
    this.RespawnTime = 3;
  },

  start() {
    this.dashRest();
    this.BGM_START();
    setTimeout(() => {
      this.BGM_END();
    }, 1000 * 40);
  },

  //冲刺CD恢复
  dashRest() {
    clearTimeout(this.dashCD);
    this.dashCD = setTimeout(() => {
      if (this.dashPoint < this.dashMaxPoint) {
        this.dashPoint = this.dashMaxPoint;
      }
      // this.dashRest()
    }, 600 + this.dashPoint * 100);
  },
  //音乐开
  BGM_START() {
    this.BGM_ON = 1;
    // this.BGM.play()
  },
  //音乐关
  BGM_END() {
    this.BGM_ON = 0;
    // setTimeout(() => {

    //     this.BGM.stop()
    // }, 3000);
  },

  update(dt) {
    //慢动作
    if (this.MainSpeed < 1) {
      cc.kSpeed(this.MainSpeed);
      this.MainSpeed += this.addspd;
      this.addspd += 0.0001;
    }
    //进场bgm渐渐大声
    if (this.BGM_ON == 1 && this.BGM.volume < 0.5 && this.Clear == false) {
      this.BGM.volume += 0.003;
    }
    //音乐渐渐渐弱
    if (this.BGM_ON == 0 && this.BGM.volume > 0.005) {
      this.BGM.volume -= 0.005;
    }
  },
});
