// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        monstersPre:{
            type:cc.Prefab,
            default:[],
        },
        monster:{
            type:cc.Prefab,
            default:null,
        },
        monsterCounts:4,//单波刷怪上限
        monsterWaves:3,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.MainGame = cc.find("Canvas").getComponent('MainGame')
        this.player = cc.find("Canvas/GameObj/Player")
        
        this.monster_pool = []
        for (var i = 0; i < this.monstersPre.length; i++) {
            this.monster_pool[i] = new cc.NodePool();
        }
        this.makeLavelMonster()
        
        // this.addspd = 0.0001
        // this.done = false

        // this.sound = this.getComponent(cc.AudioSource)
        // //怪物波数
        // this.wave = this.monsterWaves
        // //当下这波的怪物数量
        // this.count = 1 + Math.round((Math.random()*this.monsterCounts))
        // //怪物下限
        // // if(this.count < 2){ this.count = 2 }
        // this.Monster = this.count
        // cc.log("刷怪量"+this.count)
        //  return this.count
    },

    makeLavelMonster(){
        // 每一波生成前更新lavel数据
        this.MainGame.lavelFlag = Math.ceil((this.MainGame.totalLavelNum+1)/4)
        this.MainGame.monsterNum = this.MainGame.monsterNum + Math.ceil(Math.random()*this.MainGame.lavelFlag)
        this.MainGame.totalLavelNum = this.MainGame.totalLavelNum + 1

        // 一波有多少个回合
        for(let i=0;i<this.MainGame.lavelFlag;i++) {
            if(i==0){
                for(let k=0;k<(this.MainGame.monsterNum+i);k++){
                    this.makeMonster(0)
                }
                this.MainGame.currentLastLavelMonsterNum =this.MainGame.currentLastLavelMonsterNum + this.MainGame.monsterNum+i
            }else{
                let timeSCHEDULE = function () {
                    for(let k=0;k<(this.MainGame.monsterNum+i);k++){
                        this.makeMonster(0)
                    }
                }
                this.scheduleOnce(timeSCHEDULE, i*15);
                this.MainGame.currentLastLavelMonsterNum =this.MainGame.currentLastLavelMonsterNum + this.MainGame.monsterNum+i
            }
            
        }
        console.log("currentLastLavelMonsterNum:"+this.MainGame.currentLastLavelMonsterNum)
    },

    makeMonster(monsterType){
        let monster = null;
        if (this.monster_pool[monsterType].size() > 0) {
            monster = this.monster_pool[monsterType].get();
        } else {
            monster = cc.instantiate(this.monstersPre[monsterType]);
            monster.CollType = 1;
        }
        // monster.setPosition(this.randomPosition());
        let r1 = Math.random()
        let r2 = Math.random()
        let a
        let b
        if(r1<0.5){ a = 1}else{ a = -1}
        if(r2<0.5){ b = 1}else{ b = -1}
        monster.x = this.player.x+(Math.random()*600+200)*a
        monster.y = this.player.y+(Math.random()*500+200)*b
        monster.parent = cc.find("Canvas/GameObj")
        monster.id = monsterType;
        this.totalMonsterNum = this.totalMonsterNum +1
    },
    
    spawn() {
        // if(this.count>=1){
        
        let r1 = Math.random()
        let r2 = Math.random()
        let a
        let b
        if(r1<0.5){ a = 1}else{ a = -1}
        if(r2<0.5){ b = 1}else{ b = -1}

        var spawn = cc.instantiate(this.monster)
        spawn.parent = cc.find("Canvas/GameObj")
        spawn.x = this.node.x+(Math.random()*800+200)*a
        spawn.y = this.node.y+(Math.random()*1000+500)*b
        spawn.getComponent('spawnPointChild').getNode(this.node)
        
        
        this.count -= 1
        // spawn.parent = cc.find("Canvas")
    // }
    },
    //由怪物死亡传入
    monsterReSpawn(){
        this.Monster -= 1
        // cc.log("怪物死了一个")
        //一波打完重新刷怪
        if(this.Monster == 0 && this.wave > 1){
            this.wave -= 1
            this.spawnTimer = setTimeout(() => {
                this.count = 1 + Math.round((Math.random()*this.monsterCounts))
                cc.log("剩余" + this.wave + "波" + " 当前数量" + this.count)
                this.Monster = this.count
                // return this.count
            }, 1000+Math.random()*500);
            
        }else if(this.Monster == 0 && this.wave == 1 ){
            this.done = true
            cc.log("刷完了3波")
        }
    },

    update (dt) {
        return
        // if(this.totalMonsterNum<5){
        //     this.makeMonster(0)
        // }
        
        if(this.MainGame.Kills == this.MainGame.AllMonster && this.done == true){

            cc.log("过关")

            //慢动作
            setTimeout(() => {
                this.sound.play()
                this.MainGame.addspd = 0.0001
                this.MainGame.MainSpeed = 0.0
                cc.kSpeed(this.MainGame.MainSpeed)
                this.MainGame.Clear = true
                
            }, 50);

            //给果子
            setTimeout(() => {
                cc.find("Canvas/UI/spawnAskillBall").getComponent('spawnAskillBall').giveABall()
            }, 800);
            
            
        
            this.done = false
        }
        if(this.count > 0 && this.MainGame.unSpawn == false){
            this.spawn()
        }
    },
});
