// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChampionPanel extends cc.Component {

    @property(cc.Node)
    addressNode: cc.Node = null;

    @property(cc.Node)
    gradeNode: cc.Node = null;

    @property(cc.Node)
    gameBlockNode: cc.Node = null;

    async getChainLinkRandomNum(){
        let random = await cc.find("Canvas").getComponent("web3").getChainLinkRandomNum()
        return random;
    }

    async showChampionPanel(){
        let data = await cc.find("Canvas").getComponent("web3").getRankData()
        console.log(data)
        cc.find("Canvas/panel/championPanel").getComponent("hideSelf").show()
        this.addressNode.getComponent(cc.Label).string = data.address
        this.gradeNode.getComponent(cc.Label).string = data.grade
        this.gameBlockNode.getComponent(cc.Label).string = data.block
    }
}
