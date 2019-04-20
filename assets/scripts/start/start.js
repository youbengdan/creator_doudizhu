
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad() {
        defines.zhangHao = false;
    },

    start() {

    },
    clickButton(err, butData) {
        cc.log("start clickButton butData = ", butData);
        if (butData == "zhangHao") {
            defines.zhangHao = true;
            cc.director.loadScene("login");
        } else if (butData == "youKe") {
            defines.zhangHao = false;
            playerData = {
                ID: '111111',             //账号  
                // UID: '',            //另一个账号
                nickName: '123',      //名字
                headUrl: 'n201',       //头像相关
                gold: 100,           //金币
                baoShi: 100,         //财宝

            };
            roomData = {
                roomPlayer: [{
                    playerID: playerData.ID,
                    nickName: playerData.nickName,
                    headUrl: playerData.headUrl,
                }],
                roomNum: "0",
            }
            cc.director.loadScene("game");
        }
    }

    // update (dt) {},
});
