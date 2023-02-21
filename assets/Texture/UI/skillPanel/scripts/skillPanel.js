// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    skillItemsArr: {
      type: cc.Node,
      default: [],
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.MainGame = cc.find("Canvas").getComponent("MainGame");
    this.playerHurtbox = cc.find("Canvas/GameObj/Player/playerHurtbox")
    this.skillAtkNum = {
        0:0,
        1:0,
        2:0,
        3:0
    }
    this.reflashSkill()
  },

  start() {},

  openPanel() {
    this.node.active = true
    this.reflashSkill()
  },
  hidePanel(){
    this.node.active = false
    this.MainGame.GameEvent = 0;
  },

  reflashSkill() {
    let idList = this.getRandomIdArr(3);
    console.log(idList);
    for(let i=0;i<this.skillItemsArr.length;i++) {
        this.skillItemsArr[i].getComponent("skillItem").resetData(idList[i],this.skillAtkNum[idList[i]])
    }
  },
  updateSelectedSkillLavel(id,itemNode){
    // todo:update atk real num
    this.skillAtkNum[id] = this.skillAtkNum[id] + 1
    // HP
    this.MainGame.PlayerMaxHP = this.MainGame.PlayerMaxHP + 1;
    this.MainGame.PlayerHP = this.MainGame.PlayerMaxHP;
    this.playerHurtbox.getComponent("PlayerHurtBox").fullHP()
    switch(id){
        case 0:
            // Lightning Ball
            this.MainGame.thunder_01 = 1
            this.MainGame.thunder_01_pow = 1+this.skillAtkNum[id]
            this.MainGame.basicATK = this.skillAtkNum[id]
            this.MainGame.atkSpeed = 1.2 + 0.001*this.skillAtkNum[id]
            break;
        case 1:
            // Lightning Dash
            if(this.MainGame.dashHit==-1){
              this.MainGame.dashHit = 0;
            }
            this.MainGame.dashTime = 1000 + 50*this.skillAtkNum[id]
            break;
        case 2:
            // Thor's Wrath
            this.MainGame.dashHit = 1;
            this.MainGame.thunder_02_pow = 1+this.skillAtkNum[id]
            break;
        case 3:
            // Tracking Arrow
            this.MainGame.agility_04_pow = Math.ceil(this.skillAtkNum[id]/10)
            this.MainGame.agility_04 = this.skillAtkNum[id]<15?this.skillAtkNum[id]:15
            break;
        default:
            break;
    }
    itemNode.getComponent("skillItem").resetData(id, this.skillAtkNum[id])
    this.hidePanel()
    cc.find("Canvas/spawnPointMother").getComponent("spawnPointMother").makeLavelMonster()
  },
  getRandomIdArr(maxId) {
    var result = [];
    var ran = Math.floor(Math.random() * (maxId));
    result.push(ran)
    if(ran+1>maxId){
        result.push(0)
        result.push(1)
    }else {
        result.push(ran+1)
        if(ran+2>maxId) {
            result.push(0)
        } else {
            result.push(ran+2)
        }
    }
    return result
  },

  // update (dt) {},
});
