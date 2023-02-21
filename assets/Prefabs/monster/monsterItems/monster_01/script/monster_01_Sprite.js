
cc.Class({
    extends: cc.Component,
 
    properties: {
        enemy:{
            type:cc.Node,
            default:null,
        },
        hitBox:{
            type:cc.Node,
            default:null,
        },
    },
 
    // LIFE-CYCLE CALLBACKS:
 
    onLoad () {
        this.ENEMY = this.enemy.getComponent('monster_01')
        
    },
 
    AnimEnd() {
        // this.atking = false
        setTimeout(() => {
            if(this.ENEMY != null)
                { this.ENEMY.roll()} 
                }, 600);
    },
    hitboxOn(){
        this.hitBox.group = "EnemyHitBox"
    },
    hitboxOff(){
        this.hitBox.group = "default"
    },
    atkEnd(){
        this.ENEMY.atking = false
        
        // this.ENEMY.state = "stand"
    },
    atkStart(){
        clearTimeout(this.ENEMY.TIMER)
        this.ENEMY.atking = true
    },
    hitForce(){
        this.ENEMY.hitforce = 8
        setTimeout(() => {
            if(this.ENEMY != null)
                { this.ENEMY.roll()} 
        }, 600);
        
    },
    // update (dt) {},
});
 
