"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function processSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        const { problemId, code, language } = JSON.parse(submission);
        console.log(`Processing Submission for problemId: ${problemId}...`);
        console.log(`Code: ${code}`);
        console.log(`Language: ${language}`);
        // Here will be the actual code submission processing logic
        // Simulate processing delay
        yield new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Finished processing submission for problemId ${problemId}`);
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Worker connected to Redis');
            // actual logic implementation
            while (true) {
                try {
                    const submission = yield client.brPop("problems", 0);
                    yield processSubmission(submission.element);
                }
                catch (error) {
                    console.log('Error processing Submission', error);
                    // we can have the logic here to push the submission back into the queue or
                    // use the AOF(Append Only File) to add the logs of the request received
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
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
