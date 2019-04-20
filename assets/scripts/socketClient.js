let socketClient = {};
socketClient.socket = undefined;
socketClient.init = function(){
    socketClient.socket = io(defines.serverUrl);
};
socketClient.cts = function(info,data){
    console.log("socketClient.cts = "+info);
    console.log(JSON.stringify(data));
    if(socketClient.socket){
        socketClient.socket.emit(info,data);
    }else{
        console.log("socketClient.socket = "+socketClient.socket);
    }
};
socketClient.stc = function(info,cb){
    console.log("socketClient.cts = "+info);
    if(socketClient.socket){
        socketClient.socket.on(info,cb);
    }else{
        console.log("socketClient.socket = "+socketClient.socket);
    }
}; 