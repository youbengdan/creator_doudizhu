let chooseCard = {
    /**
     * 获取顺子
     * @param {*} arr 
     */
    _getShun: function (arr) {
        let Shun = [];
        if (arr.length && arr.length > 4) {
            //剔除重复的值生成新的数组
            let arr1 = [];
            for (let i = 0; i < arr.length; ++i) {
                let a = this.numToCardNum(arr[i]);
                if (!arr[i + 1]) {
                    arr1.push(arr[i]);
                    break;
                }
                if (a == this.numToCardNum(arr[i + 1])) {
                    continue;
                }
                arr1.push(arr[i]);
            }

            if (arr1.length > 4) {
                //根据连续的值生成的数组
                let arr2 = [];
                for (let i = 0; i < arr1.length; ++i) {
                    //根据新的连续的值生成的新的数组
                    let arr3 = [];
                    let a = this.numToCardNum(arr1[i]);
                    if (i + 4 < arr1.length) {
                        for (let j = i; j < arr1.length; ++j) {
                            arr3.push(arr1[j]);
                            if (!arr[j + 1] || ++a != this.numToCardNum(arr1[j + 1])) {
                                if (arr3.length > 4 && arr2.length < arr3.length) {
                                    arr2 = U._getArr(arr3);
                                }
                                arr3 = [];
                                i = j;
                                break;
                            }
                        }
                    }
                }
                if (arr2.length > 4) {
                    Shun = U._getArr(arr2);
                }
            }
        }
        return Shun
    },
    /**
    * 获取顺子 固定长度 返回二维数组
    * @param {*} arr 
    * @param {*}  cardLen 固定长度
    */
    _getShun1: function (arr, cardLen) {
        let Shun = [];
        if (cardLen <= 5) {
            return Shun;
        }
        if (arr.length && arr.length >= cardLen) {
            //剔除重复的值生成新的数组
            let arr1 = [];
            for (let i = 0; i < arr.length; ++i) {
                let a = this.numToCardNum(arr[i]);
                if (!arr[i + 1]) {
                    arr1.push(arr[i]);
                    break;
                }
                if (a == this.numToCardNum(arr[i + 1])) {
                    continue;
                }
                arr1.push(arr[i]);
            }

            if (arr1.length >= cardLen) {
                for (let i = 0; i < arr1.length; ++i) {
                    //根据新的连续的值生成的新的数组
                    let arr3 = [];
                    let a = this.numToCardNum(arr1[i]);
                    if (i + cardLen <= arr1.length) {
                        for (let j = i; j < arr1.length; ++j) {
                            if (arr[j + 1]) {
                                if (i == j) {
                                    arr3.push(arr1[j]);
                                }
                                if (++a == this.numToCardNum(arr1[j + 1])) {
                                    arr3.push(arr1[j + 1]);
                                } else {
                                    break;
                                }

                            }
                            if (arr3.length == cardLen) {
                                Shun[Shun.length] = U._getArr(arr3);
                                arr3 = [];
                                break;
                            }
                        }
                    }
                }
            }
        }
        return Shun
    },

    /**
     * 获得连对
     * @param {*} arr 
     */
    _getShunDui: function (arr) {
        let ShunDui = [];
        if (arr.length && arr.length > 5) {
            //保存有且只有一对的元素
            let arr1 = this._getAllDui(arr);
            if (arr1.length > 5) {
                //根据连对生成的数组

                let arr2 = [];
                for (let i = 0; i < arr1.length; ++i) {
                    //根据新连对生成的新的数组
                    let arr3 = [];
                    let a = this.numToCardNum(arr1[i]);
                    if (i + 5 < arr1.length) {
                        for (let j = i; j < arr1.length; ++j, ++j) {
                            arr3.push(arr1[j]);
                            arr3.push(arr1[j + 1]);
                            if (!arr1[j + 2] || ++a != this.numToCardNum(arr1[j + 2])) {
                                if (arr3.length > 5 && arr3.length > arr2.length) {
                                    arr2 = U._getArr(arr3);
                                }
                                arr3 = [];
                                i = j;
                                break;
                            }
                        }
                    }
                }

                if (arr2.length > 5) {
                    ShunDui = U._getArr(arr2);
                }
            }
        }

        return ShunDui;
    },
    /**
     * 获得连对 固定长度 返回二维数组
     * @param {*} arr 
     * @param {*}  cardLen 固定长度
     */
    _getShunDui1: function (arr, cardLen) {
        let ShunDui = [];
        if (arr.length && arr.length >= cardLen) {
            //保存有且只有一对的元素
            let arr1 = [];
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    arr1.push(arr[i++]);
                    arr1.push(arr[i]);
                    if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                        i++;
                    }
                }
            }
            if (arr1.length >= cardLen) {

                for (let i = 0; i < arr1.length; i += 2) {
                    //根据新连对生成的新的数组
                    let arr3 = [];
                    let a = this.numToCardNum(arr1[i]);
                    if (i + cardLen <= arr1.length) {
                        for (let j = i; j < arr1.length; ++j, ++j) {
                            if (arr1[j + 2]) {
                                if (i == j) {
                                    arr3.push(arr1[j]);
                                    arr3.push(arr1[j + 1]);
                                }
                                if (++a == this.numToCardNum(arr1[j + 2])) {
                                    arr3.push(arr1[j + 2]);
                                    arr3.push(arr1[j + 3]);
                                } else {
                                    break;
                                }

                            }
                            if (arr3.length == cardLen) {
                                ShunDui[ShunDui.length] = U._getArr(arr3);
                                arr3 = [];
                                break;
                            }
                        }
                    }
                }
            }
        }

        return ShunDui;
    },
    /**
     * 三顺不带牌
     * @param {数组} arr 
     */
    _getShunSan1: function (arr) {
        let ShunSan = [];
        if (arr.length && arr.length > 5) {
            let arr1 = [];          //保存有且只有3张的元素
            let arr2 = [];          //保存其余的元素
            for (let i = 0; i < arr.length; ++i) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        U._arrPushArr(arr1, arr, i, 3);
                        i += 2;
                    } else {
                        U._arrPushArr(arr2, arr, i, 2);
                        i++;
                    }
                } else {
                    arr2.push(arr[i]);
                }
            }
            if (arr1.length > 5) {
                let arr3 = [];           //根据3顺生成的数组
                for (let i = 0; i < arr1.length; i += 3) {
                    let arr4 = [];          //根据3顺生成 新的数组
                    let a = this.numToCardNum(arr1[i])
                    if (i + 5 < arr1.length) {
                        for (let j = i; j < arr1.length; j += 3) {
                            U._arrPushArr(arr4, arr1, j, 3);
                            if (!arr1[j + 3] || ++a != this.numToCardNum(arr1[j + 3])) {
                                if (arr4.length > 5 && arr4.length > arr3.length) {
                                    arr3 = U._getArr(arr4);
                                }
                                arr4 = [];
                                i = j;
                                break;
                            }
                        }
                    }
                }

                ShunSan = U._getArr(arr3);
            }
        }

        return ShunSan;
    },
    /**
     * 三顺不带牌 固定长度 返回二维数组
     * @param {*} arr 
     * @param {*}  cardLen 固定长度
     */
    _getShunSan3: function (arr, cardLen) {
        let ShunSan = [];
        if (arr.length && arr.length >= cardLen) {
            let arr1 = [];          //保存有且只有3张的元素
            let arr2 = [];          //保存其余的元素
            for (let i = 0; i < arr.length; ++i) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        U._arrPushArr(arr1, arr, i, 3);
                        i += 2;
                    } else {
                        U._arrPushArr(arr2, arr, i, 2);
                        i++;
                    }
                } else {
                    arr2.push(arr[i]);
                }
            }
            if (arr1.length >= cardLen) {
                for (let i = 0; i < arr1.length; i += 3) {
                    let arr3 = [];          //根据3顺生成 新的数组
                    let a = this.numToCardNum(arr1[i])
                    if (i + cardLen <= arr1.length) {
                        for (let j = i; j < arr1.length; j += 3) {
                            if (arr1[j + 3]) {
                                if (i == j) {
                                    U._arrPushArr(arr3, arr1, j, 3);
                                }
                                if (++a == this.numToCardNum(arr1[j + 3])) {
                                    U._arrPushArr(arr3, arr1, j + 3, 3);
                                } else {
                                    break;
                                }

                            }
                            if (arr3.length == cardLen) {
                                ShunSan[ShunSan.length] = U._getArr(arr3);
                                arr3 = [];
                                break;
                            }
                        }
                    }
                }
            }
        }

        return ShunSan;
    },

    /**
     * 三顺带牌
     * @param {数组} arr 
     */
    _getShunSan: function (arr) {
        let ShunSan = [];
        arr = this.removeWangZha(arr);
        if (arr.length && arr.length > 5) {
            let arr1 = [];          //保存有且只有3张的元素
            let arr2 = [];          //保存其余的元素
            for (let i = 0; i < arr.length; ++i) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        U._arrPushArr(arr1, arr, i, 3);
                        i += 2;
                    } else {
                        U._arrPushArr(arr2, arr, i, 2);
                        i++;
                    }
                } else {
                    arr2.push(arr[i]);
                }
            }
            if (arr1.length > 5) {
                let arr3 = [];           //根据3顺生成的数组
                for (let i = 0; i < arr1.length; i += 3) {
                    let arr4 = [];          //根据3顺生成 新的数组
                    let a = this.numToCardNum(arr1[i])
                    if (i + 5 < arr1.length) {
                        for (let j = i; j < arr1.length; j += 3) {
                            U._arrPushArr(arr4, arr1, j, 3);
                            if (!arr1[j + 3] || ++a != this.numToCardNum(arr1[j + 3])) {
                                if (arr4.length > 5 && arr4.length > arr3.length) {
                                    arr3 = U._getArr(arr4);
                                }
                                arr4 = [];
                                i = j;
                                break;
                            }

                        }
                    }
                }
                if (arr3.length > 5) {
                    let duiLen = Math.floor(arr3.length / 3);   //带对要求的最低长度 
                    if (arr2.length < duiLen) {
                        U._arrPushArr(arr3, arr2, 0, arr2.length);
                    } else {
                        let arr5 = []; //多余的单张 
                        let arr6 = [];  //多余的对

                        for (let i = 0; i < arr2.length; ++i) {
                            let a = this.numToCardNum(arr2[i]);
                            if (arr2[i + 1] && a == this.numToCardNum(arr2[i + 1])) {
                                U._arrPushArr(arr6, arr2, i++, 2);
                            } else {
                                arr5.push(arr2[i]);
                            }
                        }


                        if (arr5.length >= duiLen && arr6.length >= duiLen * 2) {   //单牌和对子都足够的情况下
                            let a = 0, b = 0;
                            for (let i = 0; i < duiLen; ++i) {
                                a += arr5[i];
                            }
                            for (let i = 0; i < duiLen * 2; ++i) {
                                b += arr6[i];
                            }
                            if (a * 2 <= b) {
                                U._arrPushArr(arr3, arr5, 0, duiLen);
                            } else {
                                U._arrPushArr(arr3, arr6, 0, duiLen * 2);
                            }
                        } else if (arr5.length >= duiLen) {       //单牌足够的情况下
                            U._arrPushArr(arr3, arr5, 0, duiLen);
                        } else if (arr6.length >= duiLen * 2) {        //对子足够的情况下
                            U._arrPushArr(arr3, arr6, 0, duiLen * 2);
                        } else {
                            U._arrPushArr(arr3, arr2, 0, duiLen);
                        }
                    }
                }

                ShunSan = U._getArr(arr3);
            }

        }

        return ShunSan;
    },
    /**
       * 三顺带牌 确定带单还是带对
       * @param {数组} arr 
       * @param {*} daiShu 带的单还是带对  1 带单 2带对 0不带
       */
    _getShunSan2: function (arr, daiShu) {
        let ShunSan = [];
        arr = this.removeWangZha(arr);
        if (arr.length && arr.length > 5) {
            let arr1 = [];          //保存有且只有3张的元素
            let arr2 = [];          //保存其余的元素
            for (let i = 0; i < arr.length; ++i) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        U._arrPushArr(arr1, arr, i, 3);
                        i += 2;
                    } else {
                        U._arrPushArr(arr2, arr, i, 2);
                        i++;
                    }
                } else {
                    arr2.push(arr[i]);
                }
            }
            if (arr1.length > 5) {
                let arr3 = [];           //根据3顺生成的数组
                for (let i = 0; i < arr1.length; i += 3) {
                    let arr4 = [];          //根据3顺生成 新的数组
                    let a = this.numToCardNum(arr1[i])
                    if (i + 5 < arr1.length) {
                        for (let j = i; j < arr1.length; j += 3) {
                            U._arrPushArr(arr4, arr1, j, 3);
                            if (!arr1[j + 3] || ++a != this.numToCardNum(arr1[j + 3])) {
                                if (arr4.length > 5 && arr4.length > arr3.length) {
                                    arr3 = U._getArr(arr4);
                                }
                                arr4 = [];
                                i = j;
                                break;
                            }

                        }
                    }
                }
                if (arr3.length > 5) {
                    let duiLen = Math.floor(arr3.length / 3);   //带对要求的最低长度 
                    if (arr2.length < duiLen) {
                        U._arrPushArr(arr3, arr2, 0, arr2.length);
                    } else {
                        let arr5 = []; //多余的单张 
                        let arr6 = [];  //多余的对

                        for (let i = 0; i < arr2.length; ++i) {
                            let a = this.numToCardNum(arr2[i]);
                            if (arr2[i + 1] && a == this.numToCardNum(arr2[i + 1])) {
                                U._arrPushArr(arr6, arr2, i++, 2);
                            } else {
                                arr5.push(arr2[i]);
                            }
                        }
                        if (daiShu && daiShu == 1 && arr5.length >= duiLen) {       //单牌足够的情况下
                            U._arrPushArr(arr3, arr5, 0, duiLen);
                        } else if (daiShu && daiShu == 2 && arr6.length >= duiLen * 2) {        //对子足够的情况下
                            U._arrPushArr(arr3, arr6, 0, duiLen * 2);
                        }
                    }
                }

                ShunSan = U._getArr(arr3);
            }

        }

        return ShunSan;
    },

    /**
     * 3不带牌
     * @param {数组} arr 
     */
    _getSan1: function (arr) {
        let San = [];
        if (arr.length && arr.length > 2) {
            let arr1 = [];      //找出3张 4张的除外
            let arr2 = [];      //找到对子
            let arr3 = [];      //找到单牌
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        if (arr[i + 3] && a == this.numToCardNum(arr[i + 3])) {
                            i += 3;
                        } else {
                            if (!arr1.length) {
                                U._arrPushArr(arr1, arr, i, 3);
                            }
                            i += 2;
                        }
                    } else {
                        U._arrPushArr(arr2, arr, i++, 2);
                    }
                } else {
                    arr3.push(arr[i]);
                }
            }
            if (arr1.length) {
                San = U._getArr(arr1);
            }

        }
        return San;
    },

    /**
     * 3带牌
     * @param {数组} arr 
     */
    _getSan: function (arr) {
        let San = [];
        arr = this.removeWangZha(arr);
        if (arr.length && arr.length > 2) {
            let arr1 = [];      //找出3张 4张的除外
            let arr2 = [];      //找到对子
            let arr3 = [];      //找到单牌
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        if (arr[i + 3] && a == this.numToCardNum(arr[i + 3])) {
                            i += 3;
                        } else {
                            if (!arr1.length) {
                                U._arrPushArr(arr1, arr, i, 3);
                            }
                            i += 2;
                        }
                    } else {
                        U._arrPushArr(arr2, arr, i++, 2);
                    }
                } else {
                    arr3.push(arr[i]);
                }
            }
            if (arr1.length) {
                if (arr2.length && arr3.length) {
                    if (arr3[0] > arr2[0]) {
                        U._arrPushArr(arr1, arr2, 0, 2);
                    } else {
                        arr1.push(arr3[0]);
                    }
                } else if (arr2.length) {
                    U._arrPushArr(arr1, arr2, 0, 2);
                } else if (arr3.length) {
                    arr1.push(arr3[0]);
                }
                San = U._getArr(arr1);
            }


        }
        return San;
    },
    /**
   * 3带牌 确定带单还是带对
   * @param {数组} arr 
   * @param {*} daiShu 带的单还是带对  1 带单 2带对 0不带
   */
    _getSan2: function (arr, daiShu) {
        let San = [];
        arr = this.removeWangZha(arr);
        if (arr.length && arr.length > 2) {
            let arr1 = [];      //找出3张 4张的除外
            let arr2 = [];      //找到对子
            let arr3 = [];      //找到单牌
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        if (arr[i + 3] && a == this.numToCardNum(arr[i + 3])) {
                            i += 3;
                        } else {
                            if (!arr1.length) {
                                U._arrPushArr(arr1, arr, i, 3);
                            }
                            i += 2;
                        }
                    } else {
                        U._arrPushArr(arr2, arr, i++, 2);
                    }
                } else {
                    arr3.push(arr[i]);
                }
            }
            if (arr1.length) {
                if (daiShu && daiShu == 2 && arr2.length) {
                    U._arrPushArr(arr1, arr2, 0, 2);
                } else if (daiShu && daiShu == 1 && arr3.length) {
                    arr1.push(arr3[0]);
                }
                San = U._getArr(arr1);
            }
        }
        return San;
    },

    /**
     * 炸弹
     * @param {数组} arr 
     */
    _getSi1: function (arr) {
        let Si = [];
        if (arr.length && arr.length > 3) {
            let arr1 = [];      //找出4张的
            let arr2 = [];      //找到对子
            let arr3 = [];      //找到单牌
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        if (arr[i + 3] && a == this.numToCardNum(arr[i + 3])) {
                            if (!arr1.length) {
                                U._arrPushArr(arr1, arr, i, 4);
                            }
                            i += 3;
                        } else {
                            i += 2;
                        }
                    } else {
                        U._arrPushArr(arr2, arr, i++, 2);
                    }
                } else {
                    arr3.push(arr[i]);
                }
            }
            if (arr1.length) {
                Si = U._getArr(arr1);
            }

        }

        return Si;
    },

    /**
     * 4带牌 确定带单还是带对
     * @param {数组} arr 
     * @param {*} daiShu 带的单还是带对  1 带单 2带对 0不带
     */
    _getSi2: function (arr, daiShu) {
        let Si = [];
        arr = this.removeWangZha(arr);
        if (arr.length && arr.length > 3) {
            let arr1 = [];      //找出4张的
            let arr2 = [];      //找到对子
            let arr3 = [];      //找到单牌
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        if (arr[i + 3] && a == this.numToCardNum(arr[i + 3])) {
                            if (!arr1.length) {
                                U._arrPushArr(arr1, arr, i, 4);
                            }
                            i += 3;
                        } else {
                            i += 2;
                        }
                    } else {
                        U._arrPushArr(arr2, arr, i++, 2);
                    }
                } else {
                    arr3.push(arr[i]);
                }
            }
            if (arr1.length) {
                let len = 2;
                if (daiShu && daiShu == 2 && arr2.length >= len * 2) {
                    U._arrPushArr(arr1, arr2, 0, len * 2);
                } else if (daiShu && daiShu == 1 && arr3.length >= len) {
                    U._arrPushArr(arr1, arr3, 0, len);
                }
                Si = U._getArr(arr1);
            }

        }

        return Si;
    },
    /**
   * 4带牌
   * @param {数组} arr 
   */
    _getSi: function (arr) {
        let Si = [];
        arr = this.removeWangZha(arr);
        if (arr.length && arr.length > 3) {
            let arr1 = [];      //找出4张的
            let arr2 = [];      //找到对子
            let arr3 = [];      //找到单牌
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        if (arr[i + 3] && a == this.numToCardNum(arr[i + 3])) {
                            if (!arr1.length) {
                                U._arrPushArr(arr1, arr, i, 4);
                            }
                            i += 3;
                        } else {
                            i += 2;
                        }
                    } else {
                        U._arrPushArr(arr2, arr, i++, 2);
                    }
                } else {
                    arr3.push(arr[i]);
                }
            }
            if (arr1.length) {
                let len = 2;
                if (arr2.length >= len * 2 && arr3.length >= len) {
                    let a = 0, b = 0;
                    for (let i = 0; i < len; ++i) {
                        a += arr3[i];
                    }
                    for (let i = 0; i < len * 2; ++i) {
                        b += arr2[i];
                    }
                    if (a * 2 <= b) {
                        U._arrPushArr(arr1, arr3, 0, len);
                    } else {
                        U._arrPushArr(arr1, arr2, 0, len * 2);
                    }

                } else if (arr2.length >= len * 2) {
                    U._arrPushArr(arr1, arr2, 0, len * 2);
                } else if (arr3.length >= len) {
                    U._arrPushArr(arr1, arr3, 0, len);
                } else {
                    if (arr2.length && arr3.length) {
                        if (arr2[0] > arr3[0]) {
                            arr1.push(arr2[0]);
                            arr1.push(arr3[0]);
                        } else {
                            U._arrPushArr(arr1, arr2, 0, len);
                        }
                    } else if (arr2.length) {
                        U._arrPushArr(arr1, arr2, 0, len);
                    } else if (arr3.length) {
                        arr1.push(arr3[0]);
                    }
                }
                Si = U._getArr(arr1);
            }

        }

        return Si;
    },
    /**
     * 王炸
     * @param {数组} arr 
     */
    _getWangZha: function (arr) {
        let WangZha = [];

        if (arr.length && arr.length > 1) {
            let len = arr.length;
            if (arr[len - 1] == cardValue.xiaoWang && arr[len - 2] == cardValue.daWang) {
                U._arrPushArr(WangZha, arr, len - 2, 2);
            }
        }

        return WangZha;
    },
    /**
     * 对子
     * @param {数组} arr 
     */
    _getDui: function (arr) {
        let Dui = [];
        if (arr.length && arr.length > 1) {
            let arr1 = [];
            for (let i = 0; i < arr.length; ++i) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    if (arr[i + 2] && a == this.numToCardNum(arr[i + 2])) {
                        i += 2;
                    } else {
                        U._arrPushArr(arr1, arr, i, 2);
                        break;
                    }

                }
            }
            if (arr1.length) {
                Dui = U._getArr(arr1);
            }
        };
        return Dui;
    },
    /**
     * 单牌
     * @param {*} arr 
     */
    _getDan: function (arr) {
        let dan = [];
        if (arr.length) {
            dan.push(arr[0]);
        }
        return dan;
    },

    /**
     * 获取当前牌能出的最小次数
     * @param {数组} arr 
     */
    _getCardDataRemain: function (arr) {
        let reData = {};
        if (arr && arr.length) {
            // arr = this.removeWangZha(arr);

            reData = this._getRemainCard(arr);
            for (let i = 0; i < reData.cardArrs.length; ++i) {
                if (reData.cardArrs && reData.cardArrs[i].length == 0) {
                    reData.cardArrs.splice(i, 1);
                }
            }
        }
        return reData;
    },
    /**
     * 获取当前牌能出的最小次数
     * @param {当前所有牌} values 
     * @param {能出的次数} outCardCiShu 
     * @param {需要被移除的牌} value 
     * @param {最终牌组} CardArrs 
     */
    _getRemainCard: function (values, outCardCiShu, value, CardArrs) {
        values = values ? values : [];
        outCardCiShu = outCardCiShu ? outCardCiShu : 0;
        value = value ? value : [];
        CardArrs = CardArrs ? CardArrs : [];

        //当前被选牌
        let arrs = [];
        for (let i = 0; i < values.length; ++i) {
            let bol = true;
            let a = values[i];
            for (let j = 0; j < value.length; ++j) {
                if (a === value[j]) {
                    bol = false;
                    break;
                }
            }
            if (bol) {
                arrs.push(a);
            }
        }
        //返回数据
        let reData = {};
        reData.cardArrs = U._getArr(CardArrs);
        reData.cardArrs.push(value);
        for (let i = 0; i < arrs.length; ++i) {
            let a = [];
            a.push(arrs[i]);
            reData.cardArrs.push(U._getArr(a));
        }
        //当前牌要出的最多的次数
        reData.ciShu = reData.cardArrs.length;
        //出牌的类型
        let tip = [
            this._getShun(arrs),
            this._getShunDui(arrs),
            this._getShunSan1(arrs),
            this._getShunSan(arrs),
            // this._getShunSan(arrs, 1),
            // this._getShunSan2(arrs, 2),

            this._getSan1(arrs),
            this._getSan(arrs),
            // this._getSan2(arrs, 1),
            // this._getSan2(arrs, 2),

            this._getSi1(arrs),
            this._getSi(arrs),
            // this._getSi2(arrs, 1),
            // this._getSi2(arrs, 2),

            this._getWangZha(arrs),
            this._getDui(arrs),
        ]

        let len = tip.length
        for (let i = 0; i < len; i++) {
            if (tip[i] && tip[i].length) {
                bol = true;
                let num = outCardCiShu + 1;
                let cardDatas = U._getArr(CardArrs);
                if (value.length) {
                    cardDatas.push(value);
                }
                //新生成的用来对比的数据
                let reData1 = {};
                reData1 = this._getRemainCard(arrs, num, tip[i], cardDatas);
                //刷新最少牌次数
                if (reData.ciShu > reData1.ciShu) {
                    reData.ciShu = reData1.ciShu;
                    reData.cardArrs = U._getArr(reData1.cardArrs);
                }
            }

        }

        return reData;
    },
    /**
     * 获得判断的牌的标签
     * 1 王炸 2 炸弹 3 顺子 4 连对
     * 5 三顺不带牌 6 三顺带单 7三顺带对 8 三不带牌 
     * 9 三带牌单 10 三带牌对 11 四带单 12 四带对
     * 13 对子 14 单张 
     * @param {*} arr 要进行判断的牌组
     */
    _panDuanarr(arr) {
        let num = 0;
        if (arr && arr.length) {
            let tip = [
                this._getWangZha(arr), //王炸
                this._getSi1(arr),//炸弹
                this._getShun(arr),//顺子
                this._getShunDui(arr),//连对
                this._getShunSan1(arr),//三顺不带牌
                this._getShunSan2(arr, 1),//三顺带单
                this._getShunSan2(arr, 2),//7三顺带对
                this._getSan1(arr),//三不带牌
                this._getSan2(arr, 1),//三带牌单
                this._getSan2(arr, 2),//三带牌对
                this._getSi2(arr, 1),//四带单
                this._getSi2(arr, 2),//四带对
                this._getDui(arr),//对子
                this._getDan(arr),//单张
            ];
            for (let i = 0; i < tip.length; ++i) {
                if (tip[i] && tip[i].length) {
                    if (tip[i].length == arr.length) {
                        num = i + 1;
                        break;
                    }
                }
            }

        }
        return num;

    },
    /**
     * 获取所有相同的牌的牌组 能匹配的数组 比如 3带1 ，xiangTongArr(chooseCard._getSan1,3,arrs);
     * @param {*} hanShu 能匹配的数组的函数 如果能带牌的话就选择不带牌的
     * @param {*} cardLen 能匹配的数组的长度
     * @param {*} arrs 所有牌
     */
    _getXiangTongArr: function (hanShu, cardLen, arrs) {
        
        let allcard = [];
        if(hanShu&&cardLen&&arrs&&arrs.length){
            for (let i = 0; i <= arrs.length - cardLen; ++i) {
                let card = [];
                U._arrPushArr(card, arrs, i, cardLen);
                let arr1 = this[hanShu](card);
                if (arr1.length) {
                    allcard[allcard.length] = U._getArr(arr1);
                }
            }
        }else{
            cc.error("_getXiangTongArr:function()参数有误 ");
        }
        return allcard;
    },
    /**
     * 移除王炸 王炸不参与被带牌
     * @param {*} arr 数组 
     */
    removeWangZha: function (arr) {
        let arr1 = [];
        if (arr.length && arr.length > 1) {
            let len = arr.length;
            if (arr[len - 1] == cardValue.daWang && arr[len - 2] == cardValue.xiaoWang) {
                arr.splice(len - 2, 2);
            }
            arr1 = arr;

        }
        return arr1;
    },

    /**
     * 获取数组里面所有的对子
     * @param {*} arr 
     */
    _getAllDui:function(arr){
        let arr1 = [];
        if(arr&&arr.length>=2){
            for (let i = 0; i < arr.length; i++) {
                let a = this.numToCardNum(arr[i]);
                if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                    arr1.push(arr[i++]);
                    arr1.push(arr[i]);
                    if (arr[i + 1] && a == this.numToCardNum(arr[i + 1])) {
                        i++;
                    }
                }
            }
        }
        return arr1;
    },
    
    numToCardNum: function (a) {
        return Math.floor(a / 4);
    },

    numToCardsNum: function (arr) {
        let arr1 = [];
        if (arr.length) {
            for (const k in arr) {
                if (arr.hasOwnProperty(k)) {
                    arr1.push(this.numToCardNum(arr[k]));
                }
            }
        }
        return arr1;
    },

    _getCardNum(arr) {
        return arr.sort();
    },
};


