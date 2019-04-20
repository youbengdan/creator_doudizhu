cc.Class({
    extends: cc.Component,

    properties: {
        IDEBox:cc.EditBox,
        passwordEBox:cc.EditBox,
        loginBUt:cc.Node,
    },


    start () {
        U.soketInit();
        this.loginBUtInteractable(false);
    },
    loginBUtInteractable(bol){
        if(bol){
            this.loginBUt.opacity =255;
        }else{
            this.loginBUt.opacity =75;
        }
        this.loginBUt.interactable = bol;
    },
    clickButton (err,butData){
        cc.log("login clickButton butData = ",butData);
        switch(butData){
            case "signIn":
                U.signIn();
                
            break;
            case "login":
                let  loginData = cts.loginData;
                loginData.ID = this.IDEBox.string;
                loginData.passWord = this.passwordEBox.string;
                socketClient.cts(cts.login,loginData);
                socketClient.stc(stc.login,function(data){
                    if(data=="账号密码出错！"){
                        U.tongzhi(data)
                    }else{
                        cc.log("playerData=",data);
                        playerData = data;
                        defines.zhangHao = true;
                        cc.director.loadScene("hallScenes");
                    }
                })
          
            break;
            case "forget":
                U.tongzhi(defines.forget);
            break;
            default:
            break;
        }
    },

    update (dt) {
        if(this.IDEBox.string.length>=6&&this.passwordEBox.string.length>=6){
            this.loginBUtInteractable(true);
        }
    },
});
