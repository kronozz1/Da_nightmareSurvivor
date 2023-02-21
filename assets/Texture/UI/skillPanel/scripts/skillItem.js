// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const NameArr = [
    "Lightning Ball",
    "Lightning Dash",
    "Thor's Wrath",
    "Tracking Arrow",
    // "Get Game Token",
  ];
const descArr = [
    "Players have a chance to fire lightning balls",
    "Improve character flash dexterity",
    "Greatly increases lightning damage",
    "Summons tracking arrows immediately after attacking",
    // "Get a certain amount of game tokens",
  ];

cc.Class({
  extends: cc.Component,

  properties: {
    id: 0,
    skillBg: {
      type: cc.Node,
      default: null,
    },
    skillIcon: {
      type: cc.Node,
      default: null,
    },
    skillName: {
      type: cc.Node,
      default: null,
    },
    skillDesc: {
      type: cc.Node,
      default: null,
    },
    skillAttackNum: {
      type: cc.Node,
      default: null,
    },
    bgSpriteArr: {
      type: cc.SpriteFrame,
      default: [],
    },
    iconSpriteArr: {
      type: cc.SpriteFrame,
      default: [],
    },
  },
  onLoad() {
    // this.skillId = 0
  },

  selectSkill() {
    console.log(this.skillId)
    this.node.parent.parent.getComponent("skillPanel").updateSelectedSkillLavel(this.skillId,this.node)
    console.log(this.node.parent.parent.getComponent("skillPanel").skillAtkNum)
  },

  resetData(id, atkNum) {
    this.skillId = id;
    console.log("id:"+id)
    console.log("this.skillId:"+this.skillId)
    this.skillBg.getComponent(cc.Sprite).spriteFrame = this.bgSpriteArr[id];
    this.skillIcon.getComponent(cc.Sprite).spriteFrame = this.iconSpriteArr[id];
    this.skillName.getComponent(cc.Label).string = NameArr[id];
    this.skillDesc.getComponent(cc.Label).string = descArr[id];
    this.skillAttackNum.getComponent(cc.Label).string = atkNum + "";
  },
});
