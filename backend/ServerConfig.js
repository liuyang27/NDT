const ServerConfig = {
    MongoConnectionString:"mongodb://localhost:27017/NDT",
    ModelServerConfig:[
        {
            modelId: '5e8d94e200bc28e910a8a24a',
            modelName:'PoresModel(2 file inputs)',
            serverIP:'127.0.0.1',
            port:22,
            username:'acer-v5',
            password:'Stel@871127$',
            workDir:'D:\\ARTC-NDT\\',
            fileUpladPath:'D:\\ARTC-NDT\\'
        },
        {
            modelId: '5e8add664840065c3c09e8d1',
            modelName:'test model',
            serverIP:'127.0.0.1',
            port:22,
            username:'acer-v5',
            password:'Stel@871127$',
            workDir:'D:\\ARTC-NDT\\',
            fileUpladPath:'D:\\ARTC-NDT\\'
        },
        {
            modelId: '5e8add664840065c3c09e8d1--',
            modelName:'test model',
            serverIP:'10.2.17.90',
            port:22,
            username:'wanglong',
            password:'artcgui',
            workDir:'/home/wanglong/ARTC-NDT',
            fileUpladPath:'/home/wanglong/ARTC-NDT/'
        },
    ]
}


module.exports = ServerConfig;
