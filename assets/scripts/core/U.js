let U = {
    /**
     * 数组
     * @param {获取一个新数组} arr 
     */
    _getArr: function (arr) {
        let that = [];

        if (arr.length) {
            for (let i = 0; i < arr.length; ++i) {
                that.push(arr[i]);
            }
        }
        return that;
    },
    /**
     * 给数组添加元素
     * @param {需要添加元素的数组} arr 需要添加元素的数组
     * @param {被复制元素的数组} arr1 被复制元素的数组
     * @param {下标} index 下标
     * @param {添加数目} num 添加数目
     */
    _arrPushArr: function (arr, arr1, index, num) {
        if (arr.length >= 0 && arr1.length >= index + num) {
            for (let i = 0; i < num; ++i) {
                arr.push(arr1[index++]);
            }
        } else {
            cc.error("给数组添加元素 _arrPushArr error");
        }
    },
    /**
     * 数组移除相同元素
     * @param {*} arr 需要被移除元素的数组
     * @param {*} arr1 进行匹配的数组
     */
    _arrRemoveArr: function (arr, arr1) {
        if (arr.length || arr1.length) {
            let arrs = [];
            for (let i = 0; i < arr.length; ++i) {
                let bol = true;
                for (let j = 0; j < arr1.length; ++j) {
                    if (arr[i] == arr1[j]) {
                        bol = false;
                        break;
                    }
                }
                if (bol) {
                    arrs.push(arr[i]);
                }
            }
            return arrs;
        } else {
            cc.error("数组移除相同元素 _arrRemoveArr error");
        }
    },
    /**
     * 判断2数组是否相等
     * @param {数组1} arr 
     * @param {数组2} arr1 
     */
    _ArrAndArr: function (arr, arr1) {
        let bol = false;
        if (arr && arr.length && arr1 && arr.length && arr.length == arr1.length) {
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i] !== arr1[i]) {
                    break;
                }
                if (i + 1 == arr.length) {
                    bol = true;
                }
            }
        }
        return bol;
    },
    /**
     * 获取数组里数字的平均数
     */
    _getPingJun: function (arr) {
        if (arr && arr.length) {
            let num = 0;
            for (let i = 0; i < arr.length; ++i) {
                num += arr[i]
            }
            return Math.floor(num / arr.length);
        }
        return null;
    },
};
U.SpriteFrame = function (sprite, url) {
    cc.loader.loadRes(url, cc.SpriteFrame, (err, spriteFrame) => {
        if (err) {
            cc.log(err);
            return;
        }
        sprite.spriteFrame = spriteFrame;
    })
}
U.tongzhi = function (str) {
    U.prefabs("tongZhiBox", function (prefabs) {
        prefabs.runAction(
            cc.sequence(
                cc.fadeOut(3.5),
                cc.callFunc(function () {
                    prefabs.removeFromParent();
                })
            )
        );
        prefabs.getChildByName("tongzhi").getComponent(cc.Label).string = str;
        return prefabs;
    });

};
U.cardNode = function (data) {
    U.prefabs("cardNode", function (prefabs) {
        prefabs.cardData = data;
        // that = prefabs;
    });
};
U.headInfo = function () {
    U.prefabs("headInfo");
};
U.roomNum = function (str) {
    U.prefabs("roomNum", function (prefabs) {
        prefabs.roomBtn = str;
    });
};
U.signIn = function () {
    U.prefabs("signIn");
};
U.prefabs = function (prefabName, cb) {
    cc.loader.loadRes("prefabs/" + prefabName, function (err, prefab) {
        var prefabName = cc.instantiate(prefab);
        cc.director.getScene().addChild(prefabName);
        prefabName.x = cc.winSize.width / 2;
        prefabName.y = cc.winSize.height / 2;
        cb && cb(prefabName)
    });

};
U.soketInit = function () {
    if (!socketClient.socket) {
        socketClient.init();
    }
};