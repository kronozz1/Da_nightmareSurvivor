// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        enemy:{
            type:cc.Node,
            default:null,
        },
        //主角的伤害飘字
        showDamage:{
            type:cc.Prefab,
            default:null,
        },
        damage:1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.MainGame = cc.find("Canvas").getComponent('MainGame')

        this.player = cc.find("Canvas/GameObj/Player")
        this.playerHurtBox = cc.find("Canvas/GameObj/Player/playerHurtbox").getComponent('PlayerHurtBox')
        this.hitback = 0
        this.dir = cc.v2(0,0)
        this.TAG = 0
        // this.force = 20
    },

    onCollisionEnter(other,self){
        this.MainGame.PlayerHP -= this.damage
        this.playerHurtBox.showHPbar(this.damage)
        
        let rect = new cc.Rect();
            self.world.aabb.intersection(rect, other.world.aabb);


            let pos5 = cc.v2(rect.x + rect.width / 2, rect.y + rect.height / 2);


           let a = Math.random()
           let c
           if(a<0.5){ c= -1}else{c =1 }
           
            
            //伤害飘字
            
            var damage = cc.instantiate(this.showDamage)
            damage.parent = cc.find("Canvas/GameObj")
            let localPos2 = damage.parent.convertToNodeSpaceAR(pos5);
            damage.zIndex = 9998
            damage.setPosition(localPos2.x+Math.random()*80*c,localPos2.y+100);
            if(this.damage >=15){
                damage.getComponent(cc.Label).fontSize = 50
            }
            damage.color = cc.color(255,0,0)
            damage.getComponent(cc.Label).string = this.damage
            
            

        cc.director.pause()
        setTimeout(() => {
            cc.director.resume()
        }, 80);
        

        cc.log(this.MainGame.PlayerHP+"/"+this.MainGame.PlayerMaxHP)
        this.dir.x = this.player.x - this.enemy.x
        this.dir.y = this.player.y - this.enemy.y
        this.dir.normalizeSelf()
        this.hitback = 1000
        this.node.group = "default"
        if(this.MainGame.PlayerHP<=0){
            this.MainGame.PlayerH = 0;
            if(this.MainGame.RespawnTime==0){
                cc.find("Canvas/UI/GameOver").getComponent("hideSelf").show()
                cc.find("Canvas/GameObj/Player").getComponent("hideSelf").hide()
            }else{
                this.MainGame.RespawnTime = this.MainGame.RespawnTime -1;
                cc.find("Canvas/UI/deathPanel").getComponent("hideSelf").show()
                cc.find("Canvas/GameObj/Player").getComponent("hideSelf").hide()
            }
        }
    },

    update (dt) {
        if(this.hitback >= 100){
            this.player.x += this.dir.x*this.hitback*(1/40)
            this.player.y += this.dir.y*this.hitback*(1/40)
            this.hitback -= 100
        }
    },
});
