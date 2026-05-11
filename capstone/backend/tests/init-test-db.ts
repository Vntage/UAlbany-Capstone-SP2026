import { setupTestDB } from "./config/bootstrap-db";

async function start(){
    try{
        await setupTestDB();
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

start();