import { createClient } from "redis";
const client = createClient();

async function processSubmission(submission: string) {
    const { problemId, code, language } = JSON.parse(submission);

    console.log(`Processing Submission for problemId: ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);

    // Here will be the actual code submission processing logic

    // Simulate processing delay
    // Send it to the Pub Sub
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problemId}`);
    client.publish("problem_done", JSON.stringify({ problemId, status: "TLE" }))
}


async function startWorker() {
    try {
        await client.connect();
        console.log('Worker connected to Redis');

        // actual logic implementation
        while (true) {
            try {
                const submission = await client.brPop("problems", 0);
                // const response = await client.rPop("problems");
                await processSubmission(submission.element);

                // A probelem can occur here, if this redis server goes down here, so in this case we
                // need some kind of logic that -> while popping out some instance form the queue, if we failed then push back the stuff in to the queue again or something else
            } catch (error) {
                console.log('Error processing Submission', error);
                // we can have the logic here to push the submission back into the queue or
                // use the AOF(Append Only File) to add the logs of the request received
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();








// async function main() {
//     await client.connect();

//     while (1) {
//         const response = await client.brPop("problems", 0);
//         // const response = await client.rPop("problems");
//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         // send it to the pub sub
//         console.log("Processed users submission");
//     }
// }

// main();