//4张相同的牌
let equalCard = 4;
//玩家数量
let palyerNum = 3;
//A到k有13张牌
let equalCardLen = 13;
/**
 * 几个特别的牌值   //大王到2之间，每个数字都跳开一个数
 */
let cardValue = {
    xiaoWang : 18*equalCard,    //小王
    daWang : 20*equalCard,      //大王
    xiaoSan : 3*equalCard,      //3 
    daEr : 16*equalCard,        //2
}
/**
 * 获取所有的牌 从小到大
 */
let cardNum = function(){
    let that = [];
    (function(){
        for(let i = 0,j=cardValue.xiaoSan; i <equalCardLen*equalCard;++i,++j){
            if(j>=cardValue.daEr-equalCard&&j<cardValue.daEr){
                j+=4;
            }
            that.push(j);
        }
        that.push(cardValue.xiaoWang);
        that.push(cardValue.daWang);
    })();
    return that;
};
