// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad(){
        this.MainGame = cc.find("Canvas").getComponent("MainGame")
    },

    // exitGame(){
    //     // return to last page
    //     cc.director.loadScene('start');
    // },
    exitGame(){
        cc.find("Canvas").getComponent("web3").postGrade(this.MainGame.Kills)
    },
    // FOR WEB3.JS
    continueGameForWeb3(){
        // pay 0.0005 eth to continue
        cc.find("Canvas/UI/deathPanel").getComponent("hideSelf").hide()
        cc.find("Canvas/GameObj/Player").getComponent("hideSelf").show()
        this.MainGame.PlayerHP = this.MainGame.PlayerMaxHP
        cc.find("Canvas/GameObj/Player/playerHurtbox").getComponent("PlayerHurtBox").fullHP()
    },
    continueGame(){
        // pay 0.0005 eth to continue
        cc.find("Canvas").getComponent("web3").ExpandCap()
    }
});
