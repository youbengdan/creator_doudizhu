
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {
        cc.log("roomNum onLoad")
        this.roomNum = "";
        this.roomNumLabels = [];
        let numLayout =  this.node.getChildByName("numLayout");
        for(let i = 0;i<numLayout.childrenCount;++i){
            this.roomNumLabels[i] = numLayout.children[i].getComponent(cc.Label);
            this.roomNumLabels[i].string = "";
        }
        
        
    },

    start () {

    },

    clickButton (err,butData){
        cc.log("roomNum clickButton butData = ",butData);
        switch (butData){
            case "kongBai":this.node.removeFromParent();
            break;
            case "queRen":
                if(this.roomNum.length == 6){
                    //未完成
                    if(this.node.roomBtn == "createBtn"){
                        let createRoom = {
                            ID:playerData.ID,
                            roomNum:this.roomNum,
                        }
                        socketClient.cts(cts.createRoom,createRoom);
                        socketClient.stc(stc.createRoom,function(data){
                            if(typeof data!="string"){
                                roomData =data;
                                if(roomData.roomNum&&roomData.roomPlayer.length){
                                    let roomPlayer = roomData.roomPlayer;
                                    for(let i = 0;i<roomPlayer.length;++i){
                                        if(roomPlayer[i].playerID==playerData.ID){
                                            cc.director.loadScene("game");
                                        }
                                    }
                                }
                            }else{
                                U.tongzhi(data);
                            }
                        });
                    }else if(this.node.roomBtn =="addBtn"){
                        let addRoom = {
                            ID:playerData.ID,
                            roomNum:this.roomNum,
                        }
                        socketClient.cts(cts.addRoom,addRoom);
                        socketClient.stc(stc.addRoom,function(data){
                            if(typeof data!="string"){
                                roomData =data;
                                if(roomData.roomNum&&roomData.roomPlayer.length){
                                    let roomPlayer = roomData.roomPlayer;
                                    for(let i = 0;i<roomPlayer.length;++i){
                                        if(roomPlayer[i].playerID==playerData.ID){
                                            cc.director.loadScene("game");
                                        }
                                    }
                                }
                            }else{
                                U.tongzhi(data);
                            }
                        });
                    }

                }else{
                    U.tongzhi("房间号出错");
                }
              
            break;
            case "qingChu":
                this.roomNum = ""
            break;
            case "houTui":
                if(this.roomNum.length){
                    let str = '';
                    for(let i = 0;i<this.roomNum.length-1;++i){
                        str +=this.roomNum[i];
                    }
                    this.roomNum  = str;
                }
           
                cc.log(this.roomNum)
            break;
            default:
                if(this.roomNum.length<6){
                    this.roomNum+=butData;
                }
            break;
        }
    },

    update (dt) {
        if(this.roomNum.length<=6){
            for(let i = 0;i<this.roomNumLabels.length;++i){
                this.roomNumLabels[i].string = this.roomNum[i]?this.roomNum[i]:'';
            }
        }
    },
});
