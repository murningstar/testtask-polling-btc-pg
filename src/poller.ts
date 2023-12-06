/* Notes:
- Выполняемая часть: 10-17 строки
- Функции:
    1) setup()          - Инициализация кэша (при перезапуске) и базы (только при первом запуске)
    2) insertUpdate()   - Вставить запись с обновлением в базу
    3) run()            - запускает long polling
    4) fetchBtcData()   - получение данных от API
    5) sleep()          - sleep
*/

import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { BtcUpdateType } from "./types";

const prisma = new PrismaClient();
let cache: BtcUpdateType;
await setup();
await run({ interval: 60 * 1000 });

/* Инициализация */
async function setup() {
    return new Promise(async (res) => {
        const firstLaunch = (await prisma.btcUpdate.count()) == 0;
        /* При самом первом запуске сервиса инициализируем
        кэш данными из ответа от API и заодно кладём запись в базу*/
        if (firstLaunch) {
            const apiData = await fetchBtcData();
            cache = apiData;
            await insertUpdate({
                timestamp: apiData.time.updatedISO,
                json: apiData,
            });
        } else {
            /* При всех последующих запусках 
        инициализируем кэш записью из базы */
            const mostRecent = await prisma.btcUpdate.findFirst({
                select: { json: true },
                orderBy: { timestamp: "desc" },
            });
            // json достаётся из базы без строгого типа,
            // поэтому приводим его к BtcUpdateType
            cache = mostRecent!.json as unknown as BtcUpdateType;
        }
        res(null);
    });
}

/* Вставить BtcUpdate в базу */
async function insertUpdate(payload: {
    timestamp: string;
    json: BtcUpdateType;
}) {
    await prisma.btcUpdate.create({
        data: { timestamp: payload.timestamp, json: payload.json },
    });
}

/* run long polling */
async function run(options: { interval: number }) {
    console.log("Started polling...");
    while (true) {
        /* Получаем данные от провайдера */
        const apiData = await fetchBtcData();
        const apiLastUpdated = new Date(apiData.time.updatedISO);
        /* Обновились ли данные? */
        const isUpdated = apiLastUpdated > new Date(cache.time.updatedISO);
        /* Если обновилось, то создать запись и обновить кэш  */
        if (isUpdated) {
            await prisma.btcUpdate.create({
                data: { timestamp: apiData.time.updatedISO, json: apiData },
            });
            cache = apiData;
        }
        await sleep(options.interval);
    }
}

/* отдых */
async function sleep(ms: number) {
    return new Promise((res) => {
        setTimeout(() => {
            res(null);
        }, ms);
    });
}

/* Запрос к API и возврат JSON'а */
async function fetchBtcData(): Promise<BtcUpdateType> {
    const res = await axios.get(
        "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    return res.data;
}
