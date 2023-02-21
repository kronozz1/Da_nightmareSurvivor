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
    connectWallet(){

    },
    startGame(){
        // pay 1 matic
        cc.find("Canvas").getComponent("web3").StartGame()
        // cc.director.loadScene('game');
    },
    showJoinGamePanel(){
        cc.find("Canvas/panel/JoinGame").getComponent("hideSelf").show()
    },
    showRulesPanel(){
        cc.find("Canvas/panel/rulesPanel").getComponent("hideSelf").show()
    },
    showChampionPanel(){
        let data = cc.find("Canvas").getComponent("web3").getRankData()
        console.log(data)
        cc.find("Canvas/panel/championPanel").getComponent("hideSelf").show()
        cc.find("Canvas/panel/championPanel/block/address").getComponent(cc.Label).string = data.address
        cc.find("Canvas/panel/championPanel/block/gameBlock").getComponent(cc.Label).string = data.grade
        cc.find("Canvas/panel/championPanel/block/gameBlock").getComponent(cc.Label).string = data.block
    },
    
});
