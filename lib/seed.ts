import { Data } from './db';
import { log } from "./log";

async function init(): Promise<void> {
    // Init version
    await Data.SysInfo.create(
        {
            version: "0.1.0"
        }
    );
}

export { init }
