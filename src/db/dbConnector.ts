import { initializeMongoDB } from "./mongoDB";

export const initializeDB = async () => {
    // switch (dbType) {
    //   case DBType.MongoDb:
    // }
    //     initializeMongoDB();

    return await initializeMongoDB();
};
