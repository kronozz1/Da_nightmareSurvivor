// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        monster: {
            type: cc.Prefab,
            default: null,       
        },
        monster2: {
            type: cc.Prefab,
            default: null,       
        
        },
    },


    onLoad () {
        this.mother = null
        this.born()
    },
    getNode(n){
        this.mother = n.getComponent('spawnPointMother')
        // cc.log("得到"+ n.name)
    },

    born() {
        this.timer = setTimeout(() => {
            this.mother.count += 1
            this.node.destroy()
        }, 200);
    },

    onCollisionEnter(other,self){
        if(other.node.group == "obj")
        
        return

        if(other.node.group == "floor"){
            var m
            
            if(this.mother.wave <= 2 ){
                var r = Math.random()
                if(r>0.6){m = this.monster2}else{m = this.monster}
                
            }else{
                m = this.monster
            }
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                var Monster = cc.instantiate(m)
                Monster.parent = cc.find("Canvas/GameObj")
                let player = cc.find("Canvas/GameObj/player")
                Monster.x = player.x
                Monster.y = player.y
                this.node.destroy()
            }, 500+Math.random()*500);
            // cc.log("出怪")
        }
        
    }
    // update (dt) {},
});
