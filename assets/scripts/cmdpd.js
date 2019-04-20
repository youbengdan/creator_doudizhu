cts = {
    hello: 1000,
    helloData: "",
    login: 1001,        //登录
    loginData: { ID: '', passWord: '' },
    signIn: 1002,          //注册
    signInData: { ID: '', passWord: '' },
    forgetPassWord: 1003,    //忘记密码
    forgetPassWordData: { ID: '', passWord: '' },
    signInID: 1004,       //查看id是否存在
    signInIDData: "",
    quickRoom: 1005,         //快速房间
    quickRoomData: "ID",
    createRoom: 1006,        //创建房间
    createRoomData: { ID: '', roomNum: '' },//输入六位数字的房间号码
    addRoom: 1007,           //加入房间
    addRoomData: { ID: '', roomNum: '' },//输入六位数字的房间号码
    head: 1008,              //更换头像
    headData: { ID: '', head: '' },
    name: 1009,              //更换名字
    nameData: { ID: '', name: '' },
    roomXinTiao:1010,          //房间网络心跳判断
    roomXinTiaoData:"ID",
    roomTuiChu:1011,          //退出房间
    roomTuiChuData:"ID",
    roomPlayer:1012,          //房间玩家数据
    roomPlayerData:"roomData",
    StartXiPai:1013,           //开始洗牌
    StartXiPaiData:"",         //发送玩家牌和3张庄家牌
};
stc = {
    hello: 1000,
    helloData: "",
    login: 1001,
    loginData: {
        ID: '', passWord: '', UID: '', nickName: '',
        headUrl: '', gold: 0, baoShi: 0,
    },
    signIn: 1002,
    signInData: "",
    forgetPassWord: 1003,
    forgetPassWordData: { num: 0 },//1成功，2失败，3出错
    signInID: 1004,
    signInIDData: "",
    quickRoom: 1005,         //快速房间
    quickRoomData: "roomData",
    createRoom: 1006,        //创建房间
    createRoomData: "roomData",
    addRoom: 1007,           //加入房间
    addRoomData: "roomData",
    head: 1008,              //更换头像
    headData: "",
    name: 1009,              //更换名字
    nameData: "",
    roomXinTiao:1010,          //房间网络心跳判断
    roomXinTiaoData:"ID",
    roomTuiChu:1011,          //退出房间
    roomTuiChuData:"ID",
    roomPlayer:1012,          //房间玩家数据
    roomPlayerData:"roomData",
    StartXiPai:1013,           //要求开始洗牌
    StartXiPaiData:"",         //
};