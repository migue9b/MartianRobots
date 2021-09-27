const db = "robots"
const collec = "robots"
const url = "mongodb://localhost:27017/" + db
const {MongoClient} = require('mongodb');


class MongoBot {
    constructor() {
        this.client = new MongoClient(url);
    }

    async init() {
        await this.client.connect();
        console.log('Conectado');
        this.db = this.client.db(db);
    }

    async addRobot(r1, i1) {
        await this.client.db().collection(collec).insertOne({
            robot_id: r1.robot_id,
            posicion: [[r1.posicion[0].x, r1.posicion[0].y], r1.posicion[1].orientacion],
            LOST: r1.LOST,
            instrucciones: i1
        }).then(console.log("Robot añadido a la BD"))
    }

    async getAllRobots() {
        return await this.client.db().collection(collec).find({}).toArray()
    }

    async getLostRobots() {
        return await this.client.db().collection(collec).find({"LOST": true}).toArray()
    }
}


module.exports = {
    MongoBot: new MongoBot()
}