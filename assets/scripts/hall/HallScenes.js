
cc.Class({
    extends: cc.Component,

    properties: {
        nameEBox:cc.EditBox,
        headBut:cc.Button,
    },

    onLoad () {
        cc.log('hallScenes onLoad');
        let self = this;
        if(playerData.nickName&&playerData.nickName!=this.nameEBox.string){
            this.nameEBox.string = playerData.nickName;
        }
        cc.log(playerData)
        // socketClient.init();
        // socketClient.cts(cts.hello,(cts.hello = "你好，server!!!"))
        // socketClient.stc(stc.hello,function(data){
        //     cc.log(data)
        // })
    },

    // start () {
    //     cc.log('hallScenes start');
    // },
    clickButton (err,butData){
        cc.log("headInfo clickButton butData = ",butData);
        switch(butData){
            case "head":
                U.headInfo();
            break;
            case "name":
                let data = {};
                data.ID = playerData.ID;
                data.name = this.nameEBox.string
                socketClient.cts(cts.name,data)
                socketClient.stc(stc.name,function(data){
                    cc.log("--------socketClient stc.name:",data)
                    if(data){
                        playerData.nickName = data;
                    }else{
                        cc.error("socketClient stc.name");
                    }
                    
                });
            break;
            case "backBtn":
                cc.director.loadScene("start");
            break;
            case "createBtn":
                U.roomNum(butData);
            break;
            case "addBtn":
                U.roomNum(butData);
            break;
            case "quickBtn":
                socketClient.cts(cts.quickRoom,playerData.ID);
                socketClient.stc(stc.quickRoom,function(data){
                    if(typeof data!="string"){
                        roomData = data;
                        if(roomData.roomNum&&roomData.roomPlayer.length){
                            
                            let roomPlayer = roomData.roomPlayer;
                            for(let i = 0;i<roomPlayer.length;++i){
                                if(roomPlayer[i].playerID==playerData.ID){
                                    cc.director.loadScene("game");
                                    return ;
                                }
                            }
                        }
                    }else{
                        U.tongzhi(data);
                    }
                });
            break;
            default:
            break;
        }
    },
    update (dt) {
        let self = this;
        if(playerData.headUrl&&playerData.headUrl!=this.headBut.headName){
            this.headBut.headName = playerData.headUrl;
            U.SpriteFrame(self.headBut._sprite,"appearance/"+playerData.headUrl);
            
        }
    },
});
