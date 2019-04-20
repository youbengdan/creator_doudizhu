
cc.Class({
    extends: cc.Component,

    properties: {
        black: cc.Sprite,    //13张牌的数字
        color: cc.Sprite,    //牌的四种色彩
        king_tag: cc.Sprite, //牌上的大小王人物
        king: cc.Sprite,     //大小王
        bg:cc.Sprite,        //背景
    },
    start() {
        
   
        // setTimeout(() => {
        //     cc.log(self.card);
        // }, 2 * 1000);

        if(this.node.cardNum&&this.node.beiMian){
            U.SpriteFrame(this.bg, "poke/bg_0");
            this.activeNode(false);
        }else if (this.node.cardNum) {
            //如果是地主牌
            if (this.node.isDiZhu) {
                U.SpriteFrame(this.bg, "poke/bg_3");
                this.bg.node.rotation = 90;
            }
            this.opCardNode(this.node.cardNum)
        } else {
            U.SpriteFrame(this.bg, "poke/bg_0");
            this.activeNode(false);
        }
    },
    activeNode(bol){
        this.king.node.active = bol;
        this.king_tag.node.active = bol;
        this.color.node.active = bol;
        this.black.node.active = bol;

    },
    /**
     * 操纵牌节点
     * @param {} num 牌的数字
     */
    opCardNode(num) {
        // cc.log("num",num);
        let name = "";
        // 如果牌不是大小王
        if (num >= 12 && num < 72) {
            let a = num % 4;
            if (a == 1 || a == 3) {
                name = "red_";
            } else {
                name = "black_";
            }
            name += parseInt(num / 4);
    
            this.king_tag.node.active = false;
            this.king.node.active = false;
            
            if(this.node.isDiZhu){
                this.black.node.scaleX = 0.5;
                this.black.node.scaleY = 0.5;
                this.color.node.scaleX = 0.5;
                this.color.node.scaleY = 0.5;
                this.black.node.x = -14;
                this.black.node.y = 0;
                this.color.node.x = 17;
                this.color.node.y = 0;
            }
            U.SpriteFrame(this.color, "poke/color_" + a);
            U.SpriteFrame(this.black, "poke/" + name);
        } else if (num >= 72) {   // 如果牌是大小王
         

            let a = parseInt(num / 4)
            name = '' + a + '_';
            if(a==18){
                U.SpriteFrame(this.king_tag, "poke/small_king_tag_2");
            }else{
                U.SpriteFrame(this.king_tag, "poke/big_king_tag_2");
            }
            //地主牌
            if (this.node.isDiZhu) {
                name += "0";
                this.king.node.x = 0;
                this.king_tag.node.active = false;
            } else {
                name += "1";
            }
            U.SpriteFrame(this.king, "poke/" + name);
            this.color.node.active = false;
            this.black.node.active = false;
        }
        return name;
    },
    onEnable() {
    },
    // update (dt) {},
});
