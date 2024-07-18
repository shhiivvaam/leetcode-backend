import { createClient } from "redis";
const client = createClient();

async function main() {
    await client.connect();

    while (1) {
        const response = await client.brPop("problems", 0);
        // const response = await client.rPop("problems");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // send it to the pub sub
        console.log("Processed users submission");
    }
}

main();