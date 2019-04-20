
cc.Class({
    extends: cc.Component,

    properties: {
        ID:cc.EditBox,
        password1:cc.EditBox,
        password2:cc.EditBox,
        IDText:cc.Label,
        password1Text:cc.Label,
        password2Text:cc.Label,
        signinBut:cc.Node,
    },


    onLoad () {
        U.soketInit();
        cc.log("onLoad!!!")
        this.bUtsignin="";
        this.signInButInteractable(false);
    },
    signInButInteractable(bol){
        if(bol){
            this.signinBut.opacity =255;
        }else{
            this.signinBut.opacity =25;
        }
        this.signinBut.interactable = bol;
    },
    clickButton(err,bUtData){
        cc.log("clickButton bUtData = ",bUtData);
        let self = this;
        if(bUtData =="signin"){
            let signInData = cts.signInData;
            signInData.ID = this.ID.string;
            signInData.passWord = this.password1.string;
            socketClient.cts(cts.signIn,signInData);
            this.signInButInteractable(false);
            socketClient.stc(stc.signIn,function(data){
                cc.log("----stc.signIn",data)
                U.tongzhi(data);
                self.signInButInteractable(true);
            });
        }else if(bUtData =="IDEBox"){
            this.bUtsignin = bUtData;
        }else if(bUtData =="backBtn"){
            this.node.removeFromParent();
        }
        if(bUtData != "IDEBox"){
            cc.log("发送注册消息")
            if(this.ID.string && this.ID.string.length >= 6&&
            this.bUtsignin =="IDEBox"){
                cc.log("发送注册消息！！！")
                this.bUtsignin = '';
                cts.signInIDData = this.ID.string;
                socketClient.cts(cts.signInID,cts.signInIDData)
                socketClient.stc(cts.signInID,function(data){
                    self.IDText.string = data;
                })
            }
        }
    },
    update (dt) {
        if(this.ID.string && this.ID.string.length < 6){
            this.IDText.string ="账号长度不能小于6";
            this.signInButInteractable(false);
        }else if(this.IDText.string==="账号长度不能小于6"){
            this.IDText.string = '';
        };
        if(this.password1.string && this.password1.string.length
        &&this.password1.string.length < 6){
            this.password1Text.string = "密码长度不能小于6";
            this.signInButInteractable(false);
        }else if(this.password1Text.string == "密码长度不能小于6"){
            this.password1Text.string ="";
        };

        if(this.password2.string && this.password2.string.length
            &&this.password2.string.length < 6){
            this.password2Text.string = "密码长度不能小于6";
            this.signInButInteractable(false);
        }else if(this.password2Text.string == "密码长度不能小于6"){
            this.password2Text.string ="";
        }
        if(this.password2.string&&this.password1.string){
            if(this.password2.string.length>=6&&this.password1.string.length>=6){
                if(this.password1.string!=this.password2.string){
                    this.password2Text.string = "密码必须一致!";
                    this.signInButInteractable(false);
                }else if(this.password2Text.string == "密码必须一致!"){
                    this.password2Text.string = "";
                }else if(this.IDText.string =="可以使用此名称！"){
                    this.signInButInteractable(true);
                }
                
            }
        }
        
    },
});
