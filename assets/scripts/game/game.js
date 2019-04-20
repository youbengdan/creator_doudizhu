
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("------------------")
        this.zhangHao = []; //玩家账号
        this.headbox = []; //玩家头像框
        this.roomNum = roomData.roomNum; //房间编号
        this.paiJieGe = [55, 42, 32];//牌之间的间隔 自己的手牌，自己出的牌，别人出的牌
        this.qiangDiZhuNode = this.node.getChildByName("qiangDiZhu"); //抢地主节点
        this.buQiangCiShu = 0; // 不抢次数
        this.faPaiCishu = 0;//发牌次数
        this.diZhuWeiZhi = null;    //地主位置
        this.playerCard = [];   //3人玩家牌
        this.diZhuCard = []; // 三张地主牌
        this.diZhuCardNode = []; //三张地主牌节点
        this.diZhuCardNodeP = cc.v2(cc.winSize.width / 2, cc.winSize.height - 150); //三张地主牌节点
        this.myCardNode = []; // 我的手牌节点
        this.myCardNodeP = cc.v2(cc.winSize.width / 2, 130);//我的手牌节点的位置
        this.outCardNodes = [[], [], []]; //3个出牌节点
        this.outCardNodeP = [cc.v2(cc.winSize.width / 2, cc.winSize.height / 2 - 60),   //3个出牌节点的位置
        cc.v2(cc.winSize.width / 2 + 300, cc.winSize.height / 2 + 90), cc.v2(cc.winSize.width / 2 - 300, cc.winSize.height / 2 + 90)];
        this.bgCardNode1 = this.node.getChildByName("bgCard1"); //1号位置的背面手牌
        this.bgCardLabel1 = this.bgCardNode1.getChildByName("label"); //1号位置的背面手牌数量
        this.bgCardNode2 = this.node.getChildByName("bgCard2"); //2号位置的背面手牌
        this.bgCardLabel2 = this.bgCardNode2.getChildByName("label"); //2号位置的背面手牌数量
        this.roomNumNode = this.node.getChildByName("roomsp").getChildByName("roomNum"); //房间编号节点
        this.naozhongNode = this.node.getChildByName("naozhong");   //倒计时
        this.timeNode = this.naozhongNode.getChildByName("time");   //倒计时时间
        this.outCardNode = this.node.getChildByName("outCardNode"); //出牌按钮节点
        this.operation = {}; //操纵牌
        this.upOutCard = []; //上次出的牌
        this.upOutCardPlayer = null;//上次出牌人的位置
        this.zhaDanCiShu = 0;  //炸弹次数
        this.buChuNodes = [this.node.getChildByName("buChu0"),          //3个不出
        this.node.getChildByName("buChu1"), this.node.getChildByName("buChu2")];
        this._initNode();
        this._initZhangHao();
        this._initPlayerInfo();
        this._initRoomNum(this.roomNum);

    },
    start() {
        this.startFaPai();
    },
    /**
     * 初始节点状态
     */
    _initNode() {
        let self = this;
        this.bgCardNode1.active = false;
        this.bgCardNode2.active = false;
        this.qiangDiZhuNode.active = false;
        this.outCardNode.active = false;
        for (let i = 0; i < this.buChuNodes.length; ++i) {
            this.buChuNodes[i].active = false;
        }
        let time = this.timeNode.getComponent(cc.Label);
        time.schedule(function () {
            time.string -= 1;
        }, 1);

    },

    /**
     * 开始处理账号和游客发牌
     */
    startFaPai() {
        let self = this;
        this.buQiangCiShu = 0;
        this.faPaiCishu++;
        this.playerCard = [];
        this.diZhuCard = [];
        if (defines.zhangHao) {

        } else {
            let wash = new washCard();
            let cards = this.playerCard;
            for (let i = 0; i < wash.playerCard.length; ++i) {
                cards[cards.length] = U._getArr(wash.playerCard[i]);
            }
            this.diZhuCard = U._getArr(wash.diZhuCard);
            this.faPaiNode();
            //延时抢地主
            this.scheduleOnce(function () {
                self.qiangDiZhu(Math.floor(Math.random() * 3));
            }, 3)

        }
    },
    /**
     * 自己手牌x位置
     * @param {*} num 第几张手牌 
     */
    myCardNodeX(num) {
        return this.playerCard[0].length / 2 * this.paiJieGe[0] - num * this.paiJieGe[0] + this.myCardNodeP.x;
    },

    faPaiNode() {
        let self = this;
        let cards = this.playerCard;
        for (let i = 0; i < 3; ++i) {
            this.cardUpdate(i);
        }

        for (let i = 0; i < self.diZhuCard.length; ++i) {
            U.prefabs("cardNode", function (prefabs) {
                prefabs.cardNum = self.diZhuCard[i];
                prefabs.isDiZhu = false;
                prefabs.beiMian = true;
                self.diZhuCardNode[i] = prefabs;
                self.diZhuCardNode[i].x = self.diZhuCardNodeP.x + (i - 1) * prefabs.width * 0.6;
                self.diZhuCardNode[i].y = self.diZhuCardNodeP.y;
                self.diZhuCardNode[i].scaleX = 0.6;
                self.diZhuCardNode[i].scaleY = 0.6;
            });

        }
    },
    /**
     * 抢到地主
     * @param {*} num 抢到地主的位置
     */
    qiangDiZhu1(num) {
        cc.log("抢到地主", num)
        let self = this;
        this.diZhuWeiZhi = num;
        this.buQiangCiShu = 0;
        this.faPaiCishu = 0;
        this.operation = {};
        this.timeNode.getComponent(cc.Label).string = '15';
        for (let i = 0; i < self.diZhuCardNode.length; ++i) {
            self.diZhuCardNode[i].removeFromParent();
        }
        for (let i = 0; i < self.diZhuCard.length; ++i) {
            U.prefabs("cardNode", function (prefabs) {
                prefabs.cardNum = self.diZhuCard[i];
                prefabs.isDiZhu = true;
                prefabs.beiMian = false;
                self.diZhuCardNode[i] = prefabs;
                self.diZhuCardNode[i].x = self.diZhuCardNodeP.x + (i - 1) * prefabs.width * 0.45;
                self.diZhuCardNode[i].y = self.diZhuCardNodeP.y + 30;

            });
            this.playerCard[num].push(self.diZhuCard[i]);
        }

        let headSp = self.headbox[num].getComponent(cc.Sprite)
        U.SpriteFrame(headSp, "appearance/head_bg");

        this.playerCard[num].sort();
        let Statuss = [false, false, false];
        Statuss[num] = true;
        this.operation = new operation({ playerStatuss: Statuss });
        this.cardUpdate(num);
        this.startOutCard(num);
    },
    /**
     * 轮到该玩家出牌
     * @param {*} num 要出牌的位置
     */
    startOutCard(num) {
        let self = this;
        if (self.outCardNodes[num]) {
            for (let i = 0; i < self.outCardNodes[num].length; ++i) {
                self.outCardNodes[num][i].removeFromParent();
            }
        }
        this.buChuNodes[num].active = false;
        this.timeNode.getComponent(cc.Label).string = '15';
        if (num == 0) {
            self.outCardNode.active = true;
            self.outCardNode.getChildByName("noOutCard").getComponent(cc.Sprite).unscheduleAllCallbacks();
            self.outCardNode.getChildByName("noOutCard").getComponent(cc.Sprite).scheduleOnce(function () {
                if (self.outCardNode.active) {
                    self.yiOutCard(0, self.operation.outCard(self.upOutCard, self.playerCard[0], self.upOutCardPlayer, 0));
                    self.outCardNode.active = false;
                }
            }, 15)
        } else {

            this.scheduleOnce(function () {
                self.yiOutCard(num, self.operation.outCard(self.upOutCard, self.playerCard[num], self.upOutCardPlayer, num));
            }, 3);
        }

    },

    /**
     * 已出牌
     * @param {*} num   出牌人的位置 
     * @param {*} card 出的牌
     */
    yiOutCard(num, card) {
        let self = this;
        cc.log("已出牌", card);

        if (card && card.length) {
            let a = chooseCard._panDuanarr(card);
            if (a == 1 || a == 2) {
                this.zhaDanCiShu++;
            }
            this.playerCard[num] = U._arrRemoveArr(this.playerCard[num], card);
            this.cardUpdate(num);
            this.operation.updateOperation(card, [this.playerCard[0].length,
            this.playerCard[1].length, this.playerCard[2].length])

            self.upOutCard = U._getArr(card)
            self.upOutCardPlayer = num;
            for (let i = 0; i < card.length; ++i) {
                U.prefabs("cardNode", function (prefabs) {
                    prefabs.cardNum = card[i];
                    prefabs.isDiZhu = false;
                    prefabs.beiMian = false;
                    self.outCardNodes[num][i] = prefabs;
                    if (num == 0) {
                        self.outCardNodes[num][i].x = self.outCardNodeP[num].x - (card.length / 2 - i) * self.paiJieGe[1];
                    } else if (num == 1) {
                        self.outCardNodes[num][i].x = self.outCardNodeP[num].x - (card.length - i) * self.paiJieGe[2];
                    } else if (num == 2) {
                        self.outCardNodes[num][i].x = self.outCardNodeP[num].x + i * self.paiJieGe[2];
                    }
                    self.outCardNodes[num][i].y = self.outCardNodeP[num].y;
                    self.outCardNodes[num][i].zIndex = i;
                    self.outCardNodes[num][i].scaleX = 0.6;
                    self.outCardNodes[num][i].scaleY = 0.6;
                });
            }


        } else {
            this.buChuNodes[num].active = true;
        }

        //该玩家出完了
        if (self.playerCard[num].length == 0) {
            let playerStatuss = this.operation.playerStatuss;
            this.outCardNode.active = false;
            for (let i = 0; i < this.buChuNodes.length; ++i) {
                this.buChuNodes[i].active = false;
            }
            if (playerStatuss[num] == playerStatuss[0]) {
                U.tongzhi("你获得了胜利！");
            } else {
                U.tongzhi("你失败了！");
            }
            return;
        }
        this.startOutCard(this.getXiaWeiZhi(num));
    },

    /**
     * 更新扑克
     * @param {*} num 当前位置
     */
    cardUpdate(num) {
        let self = this;
        let cards = this.playerCard;
        if (num == 1) {
            if (cards[num].length) {
                this.bgCardNode1.active = true;
            } else {
                this.bgCardNode1.active = false;
            }

            this.bgCardLabel1.getComponent(cc.Label).string = cards[num].length;
        } else if (num == 2) {
            if (cards[num].length) {
                this.bgCardNode2.active = true;
            } else {
                this.bgCardNode2.active = false;
            }
            this.bgCardLabel2.getComponent(cc.Label).string = cards[num].length;
        } else {
            if (self.myCardNode.length != cards[0].length) {
                for (let i = 0; i < self.myCardNode.length; ++i) {
                    self.myCardNode[i].removeFromParent();
                }
                self.myCardNode = [];
                this.mycardQuyu = [];
                cc.log("cards:", cards[0].length)
                for (let i = 0; i < cards[0].length; ++i) {

                    U.prefabs("cardNode", function (prefabs) {
                        prefabs.cardNum = cards[0][i];
                        prefabs.isDiZhu = false;
                        prefabs.beiMian = false;
                        self.myCardNode[i] = prefabs;
                        self.myCardNode[i].x = self.myCardNodeX(i);
                        self.myCardNode[i].y = self.myCardNodeP.y;
                        self.myCardNode[i].zIndex = 20 - i;
                        self.myCardNode[i].scaleX = 0.8;
                        self.myCardNode[i].scaleY = 0.8;
                        if (i == 0) {
                            self.mycardQuyu.push(prefabs.x + prefabs.scaleX * prefabs.width * 0.5);
                        }
                        self.mycardQuyu.push(prefabs.x - prefabs.scaleX * prefabs.width * 0.5)
                        self.cardTouch(self.myCardNode[i]);
                        if (self.myCardNode.length == cards[0].length) {
                            self.mycardQuyu.sort(function (a, b) {
                                return b - a;
                            });
                        }

                        // cc.log(self.myCardNode[i])
                    });
                }
            }

        }



    },

    cardTouch(node) {
        let self = this;
        this.myCardTouMOVEX = null;
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.myCardTouX = event.getLocation().x;
            node.opacity = 155;
        })


        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self.myCardTouMOVEX) {
                /**
                 * 调节手牌的透明度 155or255
                 * @param {*} x 当前位置
                 * @param {*} bol 继续前移or返回
                 */
                let fun = function (x, bol) {
                    for (let i = 0; i < self.mycardQuyu.length - 1; ++i) {
                        if (x <= self.mycardQuyu[i] && x > self.mycardQuyu[i + 1]) {
                            if (bol) {
                                self.myCardNode[i].opacity = 155;
                            } else {
                                self.myCardNode[i].opacity = 255;
                            }

                        }
                    }
                }
                //从左往右移动
                if (self.myCardTouMOVEX > self.myCardTouX) {
                    //继续从左往右移动
                    if (event.getLocation().x > self.myCardTouMOVEX) {
                        fun(event.getLocation().x, bol);
                    }

                    //返回从右往左移动
                    if (event.getLocation().x < self.myCardTouMOVEX) {
                        fun(event.getLocation().x, false);
                    }
                }
                //从右往左移动
                if (self.myCardTouMOVEX < self.myCardTouX) {
                    //继续从右往左移动
                    if (event.getLocation().x < self.myCardTouMOVEX) {
                        fun(event.getLocation().x, bol);
                    }

                    //返回从左往右移动
                    if (event.getLocation().x > self.myCardTouMOVEX) {
                        fun(event.getLocation().x, false);
                    }
                }

            }
            self.myCardTouMOVEX = event.getLocation().x;

        })
        // node.on(cc.Node.EventType.TOUCHEND, function (event) {
        //     cc.log(event)
        //     self.xuanPai();
        // })

        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log(a, a.getLocation());
            self.xuanPai();

        })
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            // cc.log(a, a.getLocation());
            self.xuanPai();

        })
    },

    xuanPai() {
        let arr = [];
        let a = 0;
        this.myCardTouMOVEX = null;
        for (let i = 0; i < this.myCardNode.length; ++i) {
            if (this.myCardNode[i].opacity == 155) {
                if (this.myCardNode[i].y > this.myCardNodeP.y) {
                    a++;
                }
                arr.push(this.playerCard[0][i]);
            }
        }
        if (a == arr.length) {
            for (let i = 0; i < this.myCardNode.length; ++i) {
                if (this.myCardNode[i].opacity == 155) {
                    this.myCardNode[i].y = this.myCardNodeP.y;
                }
            }
            this.cardOpacity255();
            return;
        }
        let cards = chooseCard._getCardDataRemain(arr).cardArrs;
        if (cards && cards.length) {
            let card = cards[0];
            for (let i = 1; i < cards.length; ++i) {
                if (card.length < cards[i].length) {
                    card = cards[i];
                }
            }

            for (let i = 0; i < this.myCardNode.length; ++i) {
                for (let j = 0; j < card.length; ++j) {
                    if (this.myCardNode[i].cardNum == card[j]) {
                        this.myCardNode[i].y = this.myCardNodeP.y + 30;
                    }
                }
            }
        }
        this.cardOpacity255();

    },
    /**
     * 手牌Y回归
     */
    MycardY() {
        for (let i = 0; i < this.myCardNode.length; ++i) {
            this.myCardNode[i].y = this.myCardNodeP.y;
        }
        this.cardOpacity255();
    },
    /**
     * 手牌透明度返回255
     */
    cardOpacity255() {
        for (let i = 0; i < this.myCardNode.length; ++i) {
            this.myCardNode[i].opacity = 255;
        }
    },
    /**
     * 谁抢地主位置
     * @param {*} num  地主位置
     */
    qiangDiZhu(num) {
        let self = this;
        this.timeNode.getComponent(cc.Label).string = '15';
        //超过3次不抢
        if (this.buQiangCiShu++ >= 3) {
            this.startFaPai();
        }
        if (this.faPaiCishu >= 3) {
            this.qiangDiZhu1(num);
        }
        if (num == 0) {
            this.qiangDiZhuNode.active = true;
            self.qiangDiZhuNode.getChildByName("buqiang").getComponent(cc.Sprite).unscheduleAllCallbacks();
            self.qiangDiZhuNode.getChildByName("buqiang").getComponent(cc.Sprite).scheduleOnce(function () {

                if (self.qiangDiZhuNode.active && self.diZhuWeiZhi == null) {
                    self.qiangDiZhu(self.getXiaWeiZhi(num));
                    self.qiangDiZhuNode.active = false;
                }
            }, 15);
        } else {
            if (chooseCard._getRemainCard(this.playerCard[num]).cardArrs.length <= 5 && U._getPingJun(this.playerCard[num])) {
                this.qiangDiZhu1(num);
            } else {
                this.qiangDiZhu(this.getXiaWeiZhi(num));
            }
        }
    },
    /**
     * 获取下一个位置
     * @param {*} weizhi 当前位置
     */
    getXiaWeiZhi(weizhi) {
        if (weizhi == 2) {
            return 0;
        } else {
            return weizhi + 1;
        }
    },
    _initRoomNum(num) {
        if (num) {
            this.roomNumNode.getComponent(cc.Label).string = num;
        } else {
            this.roomNumNode.getComponent(cc.Label).string = this.roomNum;
        }
    },
    _initRoomXinTiao() {
        let self = this;
        this.roomXinTiao = 0;
        cc.log(self.node.getChildByName("bg"))
        this.schedule(function () {
            socketClient.cts(cts.roomXinTiao, playerData.ID);
            if (++self.roomXinTiao >= 3) {
                U.tongzhi("网络连接出错");
                cc.game.restart();
            }
        }, 27);
        socketClient.stc(stc.roomXinTiao, function () {
            self.roomXinTiao = 0;
        });
    },
    /**
     * 准备好了，
     * 账号登入和游客登入
     */
    startZhanghao() {
        if (defines.zhangHao) {

        } else {

        }
    },
    /**
     * 账号登入和游客登入
     */
    _initZhangHao() {
        let self = this;
        if (defines.zhangHao) {
            this.palyerNum = 0;
            this._initRoomXinTiao();
            //接收玩家数据
            socketClient.stc(stc.roomPlayer, function (data) {
                if (typeof data != "string") {
                    roomData.roomPlayer = data;
                } else {
                    U.tongzhi(data);
                }
            });
            //接收洗牌消息
            socketClient.stc(stc.StartXiPai, function () {
                //洗牌并发送牌数据
                let wash = new washCard();

                for (let i = 0; i < wash.playerCard.length; ++i) {
                    cards[cards.length] = U._getArr(wash.playerCard);
                }
                cards[cards.length] = U._getArr(wash.diZhuCard);
                socketClient.cts(cts.StartXiPai, {
                    ID: playerData.ID,
                    roomNum: roomData.roomNum, cards: cards
                })
            });
        } else {
            cc.log("游客登入")

            this.palyerNum = 3;
        }
    },
    /**
     * 初始化玩家数据
     * @param {number} num 该参数不为空时，初始化第NUM个玩家数据
     */
    _initPlayerInfo(num) {
        let self = this;
        let fun = function (num) {
            let that = {};
            let player = roomData.roomPlayer[num] ? roomData.roomPlayer[num] : {
                playerID: "",
                nickName: "",
                headUrl: "",
            };
            that.ID = player.playerID ? player.playerID : '' + num;
            that.nickName = player.nickName ? player.nickName : "无名";
            that.headUrl = player.headUrl ? player.headUrl : "n201";
            self.headbox[num] = self.node.getChildByName("headbox" + num);
            let name = self.headbox[num].getChildByName("name");
            name.getComponent(cc.Label).string = that.nickName;
            let head = self.headbox[num].getChildByName("head");
            let headSp = head.getComponent(cc.Sprite)
            U.SpriteFrame(headSp, "appearance/" + that.headUrl);

            return that;
        }
        if (num >= 0 && num < this.palyerNum && this.zhangHao.length == this.palyerNum) {
            this.zhangHao[num] = fun(num);
        } else {
            for (let i = 0; i < this.palyerNum; ++i) {
                this.zhangHao[i] = fun(i);
            }
        }

    },
    /**
     * 获取玩家对应的位置
     * @param {*} IDs 房间里玩家的ID
     */
    getWeizhi(IDs) {
        let weizhi = []
        if (IDs && IDs.length) {
            for (let i = 0; i < IDs.length; ++i) {
                if (playerData.ID == IDs[i]) {
                    for (let j = 0; j < this.palyerNum; ++j) {
                        if (j >= i) {
                            weizhi.push(j - i)
                        } else {
                            weizhi.push(j - i + this.palyerNum);
                        }
                    }
                    break;
                }
            }
        }
        return weizhi;
    },


    clickButton(err, butData) {
        cc.log("game clickButton butData = ", butData);
        let self = this;
        switch (butData) {
            case "backBtn":
                if (defines.zhangHao) {
                    cc.director.loadScene("hallScenes");
                    socketClient.cts(cts.roomTuiChu, playerData.ID);
                    socketClient.stc(stc.roomTuiChu, function () {
                        if (cc.director.getScene() == "game") {
                            cc.director.loadScene("hallScenes");
                        }
                    });
                } else {
                    cc.director.loadScene("start");
                }
                break;
            case "qiang":
                this.qiangDiZhu1(0);
                this.qiangDiZhuNode.active = false;
                break;
            case "buqiang":
                this.qiangDiZhuNode.active = false;
                this.qiangDiZhu(this.getXiaWeiZhi(0));
                break;
            case "noOutCard":
                this.yiOutCard(0, []);
                this.outCardNode.active = false;
                break;
            case "outCard":
                let arr = []

                for (let i = 0; i < this.myCardNode.length; ++i) {
                    if (this.myCardNode[i].y > this.myCardNodeP.y) {
                        arr.push(this.playerCard[0][i]);
                    }
                }
                if (chooseCard._panDuanarr(arr)) {
                    if (this.upOutCardPlayer == 0) {
                        this.yiOutCard(0, arr);
                    } else {
                        let upCard = [];
                        if (this.upOutCardPlayer != 0) {
                            upCard = U._getArr(this.upOutCard);
                        }
                        let card = this.operation._outAllCards(upCard, arr)
                        if (card && card.length) {
                            for (let i = 0; i < card.length; ++i) {
                                if (card[i].length == arr.length) {
                                    this.yiOutCard(0, card[i]);
                                    this.outCardNode.active = false;
                                }
                            }
                            if (this.outCardNode.active) {
                                cc.log("card:", card, upCard, arr);
                                U.tongzhi("出牌错误");
                            }
                        } else {
                            cc.log("card:", card, upCard, arr);
                            U.tongzhi("出牌错误");
                        }
                    }
                } else {
                    cc.log("arr1:", arr);
                    U.tongzhi("出牌错误");

                }
                break;
            case "outCard1":
                this.yiOutCard(0, this.operation.outCard(self.upOutCard, this.playerCard[0], this.upOutCardPlayer, 0));
                this.outCardNode.active = false;
                break;
            case "bg": this.MycardY();
                break;

            default:
                break;
        }

    },
    zhangHaoUpdate() {
        if (defines.zhangHao) {
            if (roomData.roomPlayer.length != this.palyerNum) {
                this.palyerNum = roomData.roomPlayer.length;
                for (let i = 0; i < this.palyerNum; ++i) {
                    this._initPlayerInfo(i);
                }
            }
            if (this.roomNum != roomData.roomNum) {
                this.roomNum = roomData.roomNum;
                this._initRoomNum()
            }
        }
    },
    update(dt) {
        this.zhangHaoUpdate();
    },
});
