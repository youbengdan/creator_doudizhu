//处理洗牌
let washCard = cc.Class({
    extends: cc.Component,
    properties: {
        //总牌
        cardArrs: [],
        //玩家扑克
        playerCard: [],
        //地主牌
        diZhuCard: [],
        //总牌分成4个数组
        cardArrLen: 4,
        //操纵发牌好坏    只有一个元素单独处理，3个元素分开处理牌的好坏
        opWashCard: [],
        //玩家发牌时的扑克数
        playerCardNum: 17,
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        this.opWashCard = [15];
        this.wash();

    },
    /**
     * 操纵牌
     */
    opCard() {
        if (this.opWashCard.length == 1) {
            let opWashCard = 0;
            for (let i = 0; i < this.playerCard.length; ++i) {
                opWashCard += this.opCardNum(this.playerCard[i])
            }
            if (opWashCard > this.opWashCard[0]) {
                this.wash();
                return;
            }
        } else if (this.opWashCard.length == 3) {
            for (let i = 0; i < this.playerCard.length; ++i) {
                let opWashCard = this.opCardNum(this.playerCard[i])
                if (opWashCard > this.opWashCard[i]) {
                    this.wash();
                    return;
                }
            }
        }

        // for (let i = 0; i < this.playerCard.length; ++i) {
        //     this.playerCard[i].sort(function (a, b) {
        //         return b - a;
        //     })
        // }
        this.faCard();

    },

    /**
     * 获取操纵牌的分数 分数越低越好
     * @param {*} arr 单个玩家的牌
     */
    opCardNum(arr) {
        let cardData = chooseCard._getCardDataRemain(arr.sort());
        let a = 0;
        //如果有一对王，操纵牌减分
        for (let i = 0; i < cardData.cardArrs.length; ++i) {
            if (cardData.cardArrs[i] == cardValue.daWang && cardData.cardArrs[i] == cardValue.xiaoWang) {
                a++;
            }
        }
        return a==2?cardData.cardArrs.length - a:cardData.cardArrs.length;
    },
    /**
     * 发牌
     */
    faCard() {

    },
    /**
     * 洗牌
     */
    wash() {
        this.cardArrs = cardNum().sort(function (a, b) {
            return Math.random() > .5 ? -1 : 1;
        });

        for (let i = 0; i < this.cardArrLen; ++i) {
            if (i + 1 == this.cardArrLen) {
                this.diZhuCard = [];
                U._arrPushArr(this.diZhuCard, this.cardArrs, this.playerCardNum * i, this.cardArrs.length - this.playerCardNum * i);
            } else {
                this.playerCard[i] = [];
                U._arrPushArr(this.playerCard[i], this.cardArrs, i * this.playerCardNum, this.playerCardNum);
            }
        }
        this.opCard();
    },

    start() {
        // cc.log("-------3333")
    },

    onEnable() {
        // cc.log("-------22222")

    },
    // update (dt) {},
});
