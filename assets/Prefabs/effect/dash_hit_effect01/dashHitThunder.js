// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
 
cc.Class({
    extends: cc.Component,
 
    properties: {
        dashHit01_particle:{
            type:cc.Prefab,
            default:null,
        },
        thunder:{
            type:cc.Node,
            default:null,
        },
        newthunder:{
            type:cc.Prefab,
            default:null,
        },
        showDamage:{
            type:cc.Prefab,
            default:null,
        },
    },
 
    // LIFE-CYCLE CALLBACKS:
 
    onLoad () {
        this.father 
        this.MainGame = cc.find("Canvas").getComponent('MainGame')
        
     },
 
    done () {
        if( Math.random() <= this.MainGame.thunder_02 ){
            if(this.MainGame.thunderCunt < 8){
            var DASHhitEFF = cc.instantiate(this.newthunder)
            DASHhitEFF.getComponent('dashHit_thunder').father = 0
            DASHhitEFF.parent = cc.find("Canvas/GameObj/dashHitEff_box")
            DASHhitEFF.x = cc.find("Canvas/GameObj/Player").x
            DASHhitEFF.y = cc.find("Canvas/GameObj/Player").y 
 
        }
        }
        this.MainGame.thunderCunt -=1
        this.node.destroy()
        // this.thunder.destroy()
    },
    start(){
        if(this.father == null){
            this.father = 1
        }
        
        this.MainGame.thunderCunt +=1
        if(this.father == 1){
        var p1 = cc.find("Canvas/GameObj/Player")
        var pos = Math.random() < 0.5 ? -1 : 1
        var pos2 = Math.random() < 0.5 ? -1 : 1
        
        var a = Math.random()*120
        var b = Math.random()*120}
        if(this.father == 0){
        var p1 = cc.find("Canvas/GameObj/Player")
        var pos = Math.random() < 0.5 ? -1 : 1
        var pos2 = Math.random() < 0.5 ? -1 : 1
        var a = Math.random()*200+100
        var b = Math.random()*200+100
        }
 
        this.node.setPosition(p1.x+(a*pos), p1.y+(b*pos2))
        var DASHhitparticle = cc.instantiate(this.dashHit01_particle)
        DASHhitparticle.parent = cc.find("Canvas/GameObj/dashHitEff_box")
        DASHhitparticle.setPosition(p1.x+(a*pos), p1.y+(b*pos2))
        
 
        var THUNDER = this.thunder
        THUNDER.parent = cc.find("Canvas/map_Top")
        THUNDER.setPosition(p1.x+(a*pos), p1.y+(b*pos2))
        THUNDER.zIndex = THUNDER.y
        var randomDir = Math.random()
        if (randomDir<0.5){
            this.random = -5*Math.random()
        }else{
            this.random = 15*Math.random()
        }
        THUNDER.angle += this.random*(0.5+Math.random())
 
        var randomScale = Math.random()
        if (randomScale<0.5){
            THUNDER.scaleX = -1 * THUNDER.scaleX  
        }
    },
    onCollisionEnter(other,self){
            //伤害飘字
            if(other.node.group == "enemy"){
            var damage = cc.instantiate(this.showDamage)
            
            damage.parent = cc.find("Canvas/GameObj")
            damage.setPosition(other.node.x+Math.random()*80,other.node.y+Math.random()*80);
            damage.getComponent(cc.Label).string = this.MainGame.thunder_02_pow
            damage.zIndex = 9998}
            self.node.group = "default"
    },
});
 
