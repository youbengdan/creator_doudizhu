/**
 *  代替玩家出牌
 */
let operation = cc.Class({

    extends: cc.Component,
    properties: {
        //桌面上的牌
        outCards: [],
        //玩家的状态 是否为地主
        playerStatuss: [],       //true是地主
        //玩家的牌的长度
        palyerCardLen: [],
        //所有的未出的牌
        noOutCard: [],
        //让单牌  如果是队友就让一次牌
        rangDanPai: [],
        //让对牌  如果是队友就让一次牌
        rangDuiPai: [],
    },
    /**
     * 
     * @param {*} data 出牌必须的数据
     */
    ctor(data) {
        this.noOutCard = cardNum();
        this.rangDuiPai = [false, false, false];
        this.rangDanPai = [false, false, false];
        if (data.playerStatuss.length == palyerNum) {
            this.playerStatuss = U._getArr(data.playerStatuss);
        } else {
            cc.error("operation  ctor this.playerStatuss");
        }

    },

    /**
     * 更新操纵扑克
     * @param {*} outCards 已出的所有牌
     * @param {*} palyerCardLen 
     */
    updateOperation(outCards, palyerCardLen) {

        if (outCards.length >= 0) {
            this.noOutCard = U._arrRemoveArr(this.noOutCard, outCards);
            // this.outCards = U._arrPushArr(this.outCards, outCards, 0, outCards.length);
        } else {
            cc.error("operation  upDate  outCards");
        }

        if (palyerCardLen.length == palyerNum) {
            this.palyerCardLen = U._getArr(palyerCardLen);
        } else {
            cc.error("operation  upDate  palyerCardLen");
        }

    },

    /**
     * 出牌
     * @param {*} UpOutCards 上家出牌
     * @param {*} MyCards 当前玩家的牌
     * @param {*} upSite 上个出牌人的位置
     * @param {*} MySite 当前玩家的位置
     */
    outCard(UpOutCards, MyCards, upSite, MySite) {
        cc.log("出牌", UpOutCards, MyCards, upSite, MySite)
        let outCards = [];
        //把当前玩家的牌进行从小到大排序
        MyCards = MyCards.sort();
        let myStatuss = this.playerStatuss[MySite]; //判断自己是地主还是农民 true是地主
        let cardArrs = chooseCard._getCardDataRemain(MyCards).cardArrs;//自己最少需要出的几手牌
        let xiaSite = MySite + 1 > 2 ? 0 : MySite + 1;    //判断下家的位置
        let qiTaPai = U._arrRemoveArr(this.noOutCard, MyCards);
        if (!cardArrs.length) {
            cc.error(MyCards);
        }
        //这一轮不是当前玩家先出
        if (UpOutCards.length && upSite != MySite) {
            let outAllCard = this._outAllCards(UpOutCards, MyCards); //能出的牌
            let shangJia = upSite - MySite; //判断上个出牌人是上家还是下家 false是下家。 true是上家
            // //能出牌数据
            // let outCardData = {
            //     card:[],   //能出牌
            //     shengYuScore:0, //剩余牌的积分
            //     shengYuArr:17,  //剩余多少手牌
            // }
            // let goodOutCard = [];    //所有需要比较的能出牌

            if (shangJia == 1 || shangJia == -2) {
                shangJia = false;
            } else {
                shangJia = true;
            }

            if (outAllCard.length) {
                if (outAllCard[0].length == MyCards.length) {
                    outCards = U._getArr(outAllCard[0]);
                    return outCards;
                }

                //评分
                let score = 0;
                for (let j = 0; j < cardArrs.length; ++j) {
                    score += this.cardsScore1(cardArrs[j]);
                }
                let MyCardsLen = cardArrs.length;
                let pingFen = this.cardsScore2(score, MyCardsLen);
                for (let i = 0; i < outAllCard.length; ++i) {
                    let MyCard = U._arrRemoveArr(MyCards, outAllCard[i]);
                    let cardArrs1 = chooseCard._getCardDataRemain(MyCard).cardArrs;

                    //玩家出了这手牌之后只剩一手牌，玩家的这手牌最大
                    if (cardArrs1.length == 1 && this.isMaxCard(outAllCard[i], qiTaPai)) {
                        outCards = U._getArr(outAllCard[i]);
                        return outCards;
                    }

                    if (myStatuss) { //我是地主
                        //如果是炸弹
                        if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {
                            //评价分数 
                            let score = 0;
                            for (let j = 0; j < cardArrs1.length; ++j) {
                                score += this.cardsScore1(cardArrs1[j]);
                            }
                            if (score / cardArrs1.length > this.cardsScore(this.noOutCard) + cardArrs1.length * 10) {
                                let a = this.cardsScore2(score, cardArrs1.length);
                                if (outCards) {
                                    if (pingFen < a) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                } else {
                                    pingFen = a;
                                    outCards = U._getArr(outAllCard[i]);
                                }
                            }
                        } else {
                            //评价分数 
                            let score = 0;
                            for (let j = 0; j < cardArrs1.length; ++j) {
                                score += this.cardsScore1(cardArrs1[j]);
                            }
                            let a = this.cardsScore2(score, cardArrs1.length);
                            if (outCards) {
                                if (pingFen < a) {
                                    pingFen = a;
                                    outCards = U._getArr(outAllCard[i]);
                                }
                            } else if (pingFen < a) {
                                pingFen = a;
                                outCards = U._getArr(outAllCard[i]);
                            }
                        }
                    } else if (this.playerStatuss[upSite]) { //上个出牌人是地主
                        if (shangJia) {   //上家是地主
                            //队友在下家，且只有一对牌且没让过牌可以压，并且让牌
                            if (this.palyerCardLen[xiaSite] == 2 && !this.rangDuiPai[xiaSite]) {
                                //如果是炸弹
                                if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {
                                    //评价分数 
                                    let score = 0;
                                    for (let j = 0; j < cardArrs1.length; ++j) {
                                        score += this.cardsScore1(cardArrs1[j]);
                                    }
                                    let a = this.cardsScore2(score, cardArrs1.length) + 100;
                                    if (pingFen < a) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                } else {
                                    let score = 0;
                                    for (let j = 0; j < cardArrs1.length; ++j) {
                                        score += this.cardsScore1(cardArrs1[j]);
                                    }
                                    let a = this.cardsScore2(score, cardArrs1.length) + 81;
                                    if (pingFen < a) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                }
                            } else if (this.palyerCardLen[xiaSite] == 1 && !this.rangDanPai[xiaSite]) { //队友在下家，且只有一牌且没让过牌可以重压，并且让牌
                                //如果是炸弹 优先炸弹
                                if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {
                                    let a = this.cardsScore1(outAllCard[i]) + 1000;
                                    if (outCards) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }
                                } else {
                                    let a = this.cardsScore1(outAllCard[i]) + 1000;
                                    if (outCards) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }

                                }
                            } else if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) { //如果是炸弹
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                if (score / cardArrs1.length > this.cardsScore(this.noOutCard) + cardArrs1.length * 10) {
                                    let a = this.cardsScore2(score, cardArrs1.length);
                                    if (outCards) {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    } else {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                }
                            } else {
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                let a = this.cardsScore2(score, cardArrs1.length);
                                if (outCards) {
                                    if (pingFen < a) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                } else if (pingFen < a) {
                                    pingFen = a;
                                    outCards = U._getArr(outAllCard[i]);
                                }
                            }
                        } else {  //下家的地主
                            //如果是炸弹
                            if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                if (score / cardArrs1.length > this.cardsScore(this.noOutCard) + cardArrs1.length * 10) {
                                    let a = this.cardsScore2(score, cardArrs1.length);
                                    if (outCards) {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    } else {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                }
                            } else {
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                let a = this.cardsScore2(score, cardArrs1.length) + this.cardsScore(this.noOutCard);
                                if (pingFen < a) {
                                    pingFen = a;
                                    outCards = U._getArr(outAllCard[i]);
                                }
                            }
                        }

                    } else if (myStatuss == this.playerStatuss[upSite]) { //都是农民  未完成
                        if (shangJia) {   //上家是农民
                            //队友在上家
                            if (this.palyerCardLen[xiaSite] == 1 && !this.rangDanPai[xiaSite]) {
                                //如果是炸弹
                                if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {
                                    let a = this.cardsScore1(outAllCard[i]) - 300;
                                    if (outCards) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }
                                } else {
                                    let a = this.cardsScore1(outAllCard[i]) - 200;
                                    if (outCards) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }
                                }
                            } else if (this.palyerCardLen[xiaSite] == 2 && !this.rangDuiPai[xiaSite]) {
                                if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {
                                    let a = this.cardsScore1(outAllCard[i]) - 300;
                                    if (outCards) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }
                                } else {
                                    let a = this.cardsScore1(outAllCard[i]) - 200;
                                    if (outCards) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }
                                }
                            } else if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {//如果是炸弹
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                if (score / cardArrs1.length > this.cardsScore(this.noOutCard) + cardArrs1.length * 10) {
                                    let a = this.cardsScore2(score, cardArrs1.length) - 80;
                                    if (outCards) {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    } else {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                }
                            } else {
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                let a = this.cardsScore2(score, cardArrs1.length) - this.cardsScore(this.noOutCard);
                                if (outCards) {
                                    if (pingFen < a) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    }
                                } else if (pingFen < a) {
                                    pingFen = a;
                                    outCards = U._getArr(outAllCard[i]);
                                }
                            }
                        } else {  //下家是农民
                            if (this.palyerCardLen[xiaSite] == 1 && !this.rangDanPai[xiaSite]) { //队友在下家，且只有一牌且没让过牌可以重压，并且让牌
                                //如果是炸弹 优先炸弹
                                if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {
                                    let a = this.cardsScore1(outAllCard[i]) + 1000;
                                    if (outCards) {
                                        pingFen = a;
                                        outCards = U._getArr(outAllCard[i]);
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }
                                }
                            } else if (chooseCard._getWangZha(outAllCard[i]).length || chooseCard._getSi1(outAllCard[i]).length) {   //如果是炸弹
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                if (score / cardArrs1.length > this.cardsScore(this.noOutCard) + cardArrs1.length * 10) {
                                    let a = this.cardsScore2(score, cardArrs1.length) - 300;
                                    if (outCards) {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    } else {
                                        if (pingFen < a) {
                                            pingFen = a;
                                            outCards = U._getArr(outAllCard[i]);
                                        }
                                    }
                                }
                            } else {
                                //评价分数 
                                let score = 0;
                                for (let j = 0; j < cardArrs1.length; ++j) {
                                    score += this.cardsScore1(cardArrs1[j]);
                                }
                                let a = this.cardsScore2(score, cardArrs1.length) - this.cardsScore(this.noOutCard);
                                if (pingFen < a) {
                                    pingFen = a;
                                    outCards = U._getArr(outAllCard[i]);
                                }
                            }
                        }
                    }

                }

            } else {
                return outCards;
            }
        } else {
            //这一轮出牌是当前玩家先出

            //剩一张牌
            if (MyCards.length == 1) {
                outCards = U._getArr(MyCards);
                return outCards;
            }
            //剩一手牌
            if (cardArrs.length == 1) {
                if (chooseCard._panDuanarr(cardArrs[0]) == 12 && chooseCard._panDuanarr(cardArrs[0]) == 11) {
                    let zhaDan = chooseCard._getSi1(cardArrs[0])
                    if (this.isMaxCard(zhaDan, qiTaPai)) {
                        //判断4带2.其中炸弹是最大的
                        let cards = chooseCard._getCardDataRemain(U._arrRemoveArr(cardArrs[0], zhaDan)).cardArrs;
                        outCards = U._getArr(cards[0]);
                        return outCards;
                    }
                }
                outCards = U._getArr(cardArrs[0]);
                return outCards;
            }
            //剩二手牌
            if (cardArrs.length == 2) {
                let score = 1000;
                for (let i = cardArrs.length - 1; i >= 0; --i) {
                    if (this.isMaxCard(cardArrs[i], qiTaPai)) {
                        outCards = U._getArr(cardArrs[i]);
                        return outCards;
                    }
                    // //优先出牌长的或者牌差点的
                    // let a = this.cardsScore1(cardArrs[i])+cardArrs[i].length*2
                    // if(score>a){
                    //     score = a ;
                    //     outCards = U._getArr(cardArrs[i]);
                    // }
                }

            }

            if (myStatuss) { //我的地主
                let score = 0;
                for (let j = 0; j < cardArrs.length; ++j) {
                    let a = this.cardsScore1(cardArrs[j]);
                    if (outCards.length) {
                        if (score > a) {
                            score = a;
                            outCards = U._getArr(cardArrs[j]);
                        }
                    } else {
                        score = a;
                        outCards = U._getArr(cardArrs[j]);
                    }

                }
            } else { //我是农民
                if (this.playerStatuss[xiaSite]) {
                    //下家是地主
                    for (let i = 0; i < this.playerStatuss.length; ++i) {
                        if (this.playerStatuss[i]) {
                            //i就是地主位置

                            //如果地主牌只剩一个或者只剩2个的时候尽量不出对应的牌长度
                            if (this.palyerCardLen[i] == 1 || this.palyerCardLen[i] == 2) {
                                let score1 = 0;
                                let num = this.palyerCardLen[i];
                                let num1 = 0;
                                for (let j = 0; j < cardArrs.length; ++j) {
                                    if (cardArrs[j].length == num) {
                                        num1++;
                                    }
                                }
                                if (num1 >= 2) {
                                    score1 = 80;
                                } else {
                                    score1 = 180;
                                }
                                let score2 = 0;
                                for (let j = 0; j < cardArrs.length; ++j) {
                                    let a = this.cardsScore1(cardArrs[j]);
                                    if (cardArrs[j].length == num) {
                                        if (!this.isMaxCard(cardArrs[j], qiTaPai)) {
                                            a = score1;
                                        }
                                    }

                                    if (outCards.length) {
                                        if (score2 > a) {
                                            score2 = a;
                                            outCards = U._getArr(cardArrs[j]);
                                        }
                                    } else {
                                        if (outCards.length == num && cardArrs[j].length == num) {
                                            if (this.cardsScore(outCards) < this.cardsScore(cardArrs[j])) {
                                                score2 = a;
                                                outCards = U._getArr(cardArrs[j]);
                                            }
                                        } else {
                                            score2 = a;
                                            outCards = U._getArr(cardArrs[j]);
                                        }

                                    }

                                }

                            } else {
                                let score = 0;
                                for (let j = 0; j < cardArrs.length; ++j) {
                                    let a = this.cardsScore1(cardArrs[j]);
                                    if (outCards.length) {
                                        if (score > a) {
                                            score = a;
                                            outCards = U._getArr(cardArrs[j]);
                                        }
                                    } else {
                                        score = a;
                                        outCards = U._getArr(cardArrs[j]);
                                    }

                                }
                            }
                        }
                    }
                } else {
                    //下家是农民
                    if (this.palyerCardLen[xiaSite] == 1 && !this.rangDanPai[xiaSite]) {
                        this.rangDanPai[xiaSite] = true;
                        outCards.push(MyCards[0]);
                        return outCards;
                    }

                    if (this.palyerCardLen[xiaSite] == 2 && !this.rangDuiPai[xiaSite]) {
                        this.rangDuiPai[xiaSite] = true;
                        let score = 0;
                        for (let i = 0; i < cardArrs.length; ++i) {
                            score += this.cardsScore1(cardArrs[i]);
                        }
                        //自己牌比较好，不让对子
                        if (!this.cardsScore2(score, cardArrs.length) > -25) {
                            outCards = chooseCard._getDui(MyCards);
                        }

                        if (outCards.length) return outCards;
                    }

                    for (let i = 0; i < this.playerStatuss.length; ++i) {
                        if (this.playerStatuss[i]) {
                            //i就是地主位置

                            //如果地主牌只剩一个或者只剩2个的时候尽量不出对应的牌长度
                            if (this.palyerCardLen[i] == 1 || this.palyerCardLen[i] == 2) {
                                let score1 = 0;
                                let num = this.palyerCardLen[i];
                                let num1 = 0;
                                for (let j = 0; j < cardArrs.length; ++j) {
                                    if (cardArrs[j].length == num) {
                                        num1++;
                                    }
                                }
                                if (num1 >= 2) {
                                    score1 = 80;
                                } else {
                                    score1 = 180;
                                }
                                let score2 = 0;
                                for (let j = 0; j < cardArrs.length; ++j) {
                                    let a = this.cardsScore1(cardArrs[j]);
                                    if (cardArrs[j].length == num) {
                                        if (!this.isMaxCard(cardArrs[j], qiTaPai)) {
                                            a = score1;
                                        }
                                    }

                                    if (outCards.length) {
                                        if (score2 > a) {
                                            score2 = a;
                                            outCards = U._getArr(cardArrs[j]);
                                        }
                                    } else {
                                        if (outCards.length == num && cardArrs[j].length == num) {
                                            if (this.cardsScore(outCards) < this.cardsScore(cardArrs[j])) {
                                                score2 = a;
                                                outCards = U._getArr(cardArrs[j]);
                                            }
                                        } else {
                                            score2 = a;
                                            outCards = U._getArr(cardArrs[j]);
                                        }

                                    }

                                }

                            } else {
                                let score = 0;
                                for (let j = 0; j < cardArrs.length; ++j) {
                                    let a = this.cardsScore1(cardArrs[j]);
                                    if (outCards.length) {
                                        if (score > a) {
                                            score = a;
                                            outCards = U._getArr(cardArrs[j]);
                                        }
                                    } else {
                                        score = a;
                                        outCards = U._getArr(cardArrs[j]);
                                    }

                                }
                            }
                        }
                    }
                }
            }

        }
        return outCards;
    },
    /**
     * 另一种所有牌评分 分数越大越好
     * @param {} score 剩余牌的分数
     * @param {*} len 剩余牌的长度
     */
    cardsScore2(score, len) {
        return score - len * 81
    },
    /**
     * 当前牌型的分数1 90以上是炸弹 170以上是王炸
     * @param {*} cards 一手牌
     */
    cardsScore1(cards) {
        let score = 0;
        if (cards && cards.length) {
            score = this.cardsScore(cards);
            let num = chooseCard._panDuanarr(cards);
            switch (num) {
                case 1: score += 100;
                    break;
                case 2:
                    score += 80;
                    break;
                case 3:
                    score += 5;
                    break;
                case 4:
                    score += 8;
                    break;
                case 5:
                    score += 10;
                    break;
                case 6:
                    score += 10;
                    break;
                case 7:
                    score += 10;
                    break;
                case 8:
                    score += 5;
                    break;
                case 9:
                    score += 5;
                    break;
                case 10:
                    score += 5;
                    break;
                case 11:
                    score += 4;
                    break;
                case 12:
                    score += 4;
                    break;
                case 13:
                    score += 2;
                    break;
                case 14:
                    score += 1;
                    break;
                default:
                    score += 0;
            }
        }
        return score
    },

    /**
     * 当前牌组的分数
     * @param {*} cards 一手牌
     */
    cardsScore(cards) {
        return U._getPingJun(cards);
    },
    /**
     * 是否是最大的牌
     * @param {arr} cards 一手牌
     * @param {*} allCard 其他人的牌
     */
    isMaxCard(cards, allCard) {
        if (cards && allCard) {
            if (cards.length && allCard.length) {
                if (this._outAllCards(cards, allCard).length) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        } else {
            cc.error("是否是最大的牌 isMaxCard error");
        }

    },
    /**
     * 所有能要的牌
     * @param {*} cards 被要牌
     * @param {*} cardss 要牌
     */
    _outAllCards: function (cards, cardss) {
        let allCards = [];
        let self = this;

        if (cards && cards.length && cardss && cardss.length) {
            let arr = cards.sort();
            let num = chooseCard._panDuanarr(arr);
            let cards1 = U._getArr(arr); //处理过适合比牌的牌
            let allCard = [];
            //返回比被要牌大的牌组
            let fun = function (card) {
                let arrs = [];
                for (let i = 0; i < allCard.length; ++i) {
                    if (self.cardsScore(card) < self.cardsScore(allCard[i])) {
                        arrs[arrs.length] = U._getArr(allCard[i]);
                    }
                }
                return arrs;
            }
            switch (num) {
                case 1:
                    break;
                case 2:
                    allCard = chooseCard._getXiangTongArr("_getSi1", 4, cardss);
                    allCards = fun(cards1);
                    break;
                case 3:
                    allCard = chooseCard._getShun1(cardss, cards1.length);
                    allCards = fun(cards1);
                    break;
                case 4:
                    allCard = chooseCard._getShunDui1(cardss, cards1.length);
                    allCards = fun(cards1);
                    break;
                case 5:
                    allCard = chooseCard._getShunSan3(cardss, cards1.length);
                    allCards = fun(cards1);
                    break;
                case 6:
                    cards1 = chooseCard._getShunSan1(cards1);//把单牌先去掉
                    allCard = chooseCard._getShunSan3(cardss, cards1.length);
                    allCards = this.zuHeDan(fun(cards1), cardss, arr.length - cards1.length); //allcards的牌组重新加上单牌
                    break;
                case 7:
                    cards1 = chooseCard._getShunSan1(cards1);//把对牌先去掉
                    allCard = chooseCard._getShunSan3(cardss, cards1.length);
                    allCards = this.zuHeDui(fun(cards1), cardss, arr.length - cards1.length); //allcards的牌组重新加上对牌
                    break;
                case 8:
                    allCard = chooseCard._getXiangTongArr("_getSan1", cards1.length, cardss);
                    allCards = fun(cards1);
                    break;
                case 9:
                    cards1 = chooseCard._getSan1(cards1);//把单牌先去掉
                    allCard = chooseCard._getXiangTongArr("_getSan1", cards1.length, cardss);
                    allCards = this.zuHeDan(fun(cards1), cardss, arr.length - cards1.length);//allcards的牌组重新加上单牌
                    break;
                case 10:
                    cards1 = chooseCard._getSan1(cards1);//把对牌先去掉
                    allCard = chooseCard._getXiangTongArr("_getSan1", cards1.length, cardss);
                    allCards = this.zuHeDui(fun(cards1), cardss, arr.length - cards1.length); //allcards的牌组重新加上对牌
                    break;
                case 11:
                    cards1 = chooseCard._getSi1(cards1);//把单牌先去掉
                    allCard = chooseCard._getXiangTongArr("_getSi1", cards1.length, cardss);
                    allCards = this.zuHeDan(fun(cards1), cardss, arr.length - cards1.length); //allcards的牌组重新加上单牌
                    break;
                case 12:
                    cards1 = chooseCard._getSi1(cards1);//把对牌先去掉
                    allCard = chooseCard._getXiangTongArr("_getSi1", cards1.length, cardss);
                    allCards = this.zuHeDui(fun(cards1), cardss, arr.length - cards1.length); //allcards的牌组重新加上对牌
                    break;
                case 13:
                    allCard = chooseCard._getXiangTongArr("_getDui", cards1.length, cardss);
                    allCards = fun(cards1);
                    break;
                case 14:
                    for (let i = 0; i < cardss.length; ++i) {
                        allCard[allCard.length] = [cardss[i]];
                    }
                    allCards = fun(cards1);
                    break;
                default:
                    cc.error("operation cardsScore num");
                    break;
            }
            if (num != 1) {
                if (num != 2) {
                   
                    let zhadans = chooseCard._getXiangTongArr("_getSi1", 4, cardss);
                    if (zhadans.length) {
                        for (let i = 0; i < zhadans.length; ++i) {
                            allCards[allCards.length] = zhadans[i];
                        }
                    }
                    cc.log("zhadans",zhadans,cardss);
                }
                let wangzha = chooseCard._getWangZha(cardss);
                if (wangzha.length) {
                    allCards.push(wangzha);
                }
            }
            cc.log("---------_outAllCards:", allCards,cards,cardss);
        } else if (cardss && cardss.length) {
            let arr = chooseCard._getCardDataRemain(cardss).cardArrs;
            for (let i = 0; i < arr.length; ++i) {
                allCards[i] = U._getArr(arr[i]);
            }
        }
        return allCards;
    },

    /**
     * 任意牌组组合单牌
     * @param {arr} cardss 多牌组
     * @param {*} cards 需要进行组合的牌
     * @param {*} danLen 单牌长度
     */
    zuHeDan: function (cardss, cards, danLen) {
        let zuHeCard = [];//组合牌
        if (cardss && cardss[0] && cardss[0].length && cards && cards.length && danLen) {
            if (cards.length + cardss[0].length > 20 || danLen + cardss[0].length < cards.length) {
                return cardss;
            }
            for (let i = 0; i < cardss.length; ++i) {
                let arr = U._getArr(cardss[i]);
                let arr1 = chooseCard.removeWangZha(U._arrRemoveArr(cards, arr));
                if (arr1.length < danLen) {
                    continue;
                }

                this.zuhe = [];
                this.getarrZUhe(arr1, danLen, 0, [], 0)
                for (let j = 0; j < this.zuhe.length; ++j) {
                    let arr2 = U._getArr(arr);
                    U._arrPushArr(arr2, this.zuhe[j], 0, danLen);
                    zuHeCard[zuHeCard.length] = U._getArr(arr2);
                }
            }
        }
        return zuHeCard;
    },
    /**
     * 任意牌组组合对牌
     * @param {arr} cardss 多牌组
     * @param {*} cards 需要进行组合的牌
     * @param {*} duiLen 单牌长度
     */
    zuHeDui: function (cardss, cards, duiLen) {
        let zuHeCard = [];//组合牌
        if (cardss && cardss[0] && cardss[0].length && cards && cards.length && duiLen) {
            if ((cards.length + cardss[0].length) > 20) {
                return cardss;
            }
            for (let i = 0; i < cardss.length; ++i) {
                let arr = U._getArr(cardss[i]);
                let arr1 = chooseCard._getAllDui(U._arrRemoveArr(cards, arr));
                if (arr1.length < duiLen) {
                    cc.error("operation zuHeDui");
                }
                this.zuhe = [];
                this.getarrZUhe(arr1, duiLen / 2, 0, [], 0, 2)
                for (let j = 0; j < this.zuhe.length; ++j) {
                    let arr2 = U._getArr(arr);
                    U._arrPushArr(arr2, this.zuhe[j], 0, duiLen);
                    zuHeCard[zuHeCard.length] = U._getArr(arr2);
                }
            }
        }
        return zuHeCard;
    },
    /**
     * 一个数组，里面的元素不重复组合成n长度的数组
     * 得出所有的组合
     * @param {*} allCard 所有的牌
     * @param {*} danLen 长度
     * @param {*} n  第n个长度
     * @param {*} arr 生成的数组
     * @param {*} i 第i个元素
     * @param {*} j 找单还是找对
     */
    getarrZUhe(allCard, danLen, n, arr, i, j) {
        j = j ? j : 1;

        if (n != 0) {
            arr = U._getArr(arr);
            for (let a = 0; a < j; ++a) {
                while (allCard[i + a] <= arr[arr.length - 1]) {
                    return;
                }
                arr.push(allCard[i + a]);
            }
        }
        if (n == danLen) {
            this.zuhe.push(U._getArr(arr));
            return;
        }
        for (let a = n * j; a < allCard.length - (danLen - n - 1); a += j) {
            this.getarrZUhe(allCard, danLen, n + 1, arr, a, j);
        }
    },

});