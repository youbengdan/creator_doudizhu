
cc.Class({
    extends: cc.Component,

    properties: {
        myHeadSprite:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        this.myHeadSprite = this.myHeadSprite.getComponent(cc.Sprite);
        if(!playerData.headUrl){
            U.SpriteFrame(this.myHeadSprite,"appearance/n201");
           
        }else{
            U.SpriteFrame(this.myHeadSprite,"appearance/"+playerData.headUrl);
        }
        this.headData = playerData.headUrl;
        cc.log(this.myHeadSprite)
    },
    clickButton (err,butData){
        cc.log("headInfo clickButton butData = ",butData);
        if(butData == "kongbai"){
            cc.log("--------- this.headData:", this.headData)
            socketClient.cts(cts.head,{ID:playerData.ID,head:this.headData});
            socketClient.stc(stc.head,function(headData){
                if(headData){
                    playerData.headUrl = headData;
                }else{
                    cc.error("socketClient stc.head");
                }
            })
            this.node.removeFromParent();
            return ;
        }
        U.SpriteFrame(this.myHeadSprite,"appearance/"+butData);
        this.headData =  butData;

    },
    nodeButton(err,butData){
        
    },
    update (dt) {
        
    },
});
