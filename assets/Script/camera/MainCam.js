
cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad() {
    //抖动幅度
    this.a = 0;
    this.node.getComponent(cc.Camera).zoomRatio = 0.7;
  },

  //开关,get抖动幅度参数传入后开始抖动,小怪死亡的话幅度在3或者4比较舒适，更大的爆炸事件可以传入10试试
  getShake(get) {
    this.a = get;
  },

  update(dt) {
    if (this.node.getComponent(cc.Camera).zoomRatio < 0.8) {
      this.node.getComponent(cc.Camera).zoomRatio += 0.0005;
    }
    //摄像抖动随机方向
    this.shakex = Math.random() < 0.5 ? -1 : 1;
    this.shakey = Math.random() < 0.5 ? -1 : 1;
    this.node.x = this.shakex * this.a;
    this.node.y = this.shakey * this.a;

    //抖动开始后，逐渐减小振幅
    if (this.a > 0) {
      this.a -= 0.3;
    } else if (this.a < 0) {
      this.a = 0;
    }
  },
});
