
cc.Class({
    extends: cc.Component,

    properties: {
        hitEffect:{
            type:cc.Prefab,
            default:null,
        },
        arrow:{
            type:cc.Prefab,
            default:null,
        },
        showDamage:{
            type:cc.Prefab,
            default:null,
        },
    },

    onLoad () {
        this.MainGame = cc.find("Canvas").getComponent('MainGame')
        this.p = cc.find("Canvas/GameObj")
    },

    start () {

    },
    onCollisionEnter(other,self){
        


        // if(other.node.group == 'obj'){
            this.MainGame.target = other.node
            // cc.log(other.node)
            let rect = new cc.Rect();
            self.world.aabb.intersection(rect, other.world.aabb);

            let pos5 = cc.v2(rect.x + rect.width / 2, rect.y + rect.height / 2);

            //受击特效，随机偏移
            var Hit = cc.instantiate(this.hitEffect)
            Hit.parent = this.p
            let localPos =  Hit.parent.convertToNodeSpaceAR(pos5);
            Hit.setPosition(localPos.x+Math.random()*50,localPos.y+Math.random()*50);
            Hit.angle += Math.random()*360
            Hit.scaleX += 0.5 //Math.random()
            Hit.scaleY += 0.5//Math.random()
            var player = cc.find("Canvas/GameObj/Player")
            Hit.zIndex = player.zIndex
            //伤害飘字
            if(other.node.group == "enemy"){
            var damage = cc.instantiate(this.showDamage)
            damage.parent = this.p//cc.find("Canvas/GameObj")
            let localPos2 = damage.parent.convertToNodeSpaceAR(pos5);
            damage.setPosition(localPos2.x+Math.random()*50,localPos2.y+Math.random()*50);
            damage.getComponent(cc.Label).string = this.MainGame.basicATK
            damage.zIndex = 9998}

            //发射追踪箭
            if(this.MainGame.agility_04 > 0){
                var ARROW = cc.instantiate(this.arrow)
                // ARROW.getComponent('agility_04_arrow').target = other
                ARROW.parent = this.p
                ARROW.setPosition(player.getPosition())
            }

            var shake = cc.find("Canvas/map/PlayerFollower/Main Camera").getComponent('MainCam')
            shake.getShake(3)
            
        // }
        
    },
    // update (dt) {},
});
