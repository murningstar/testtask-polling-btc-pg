# Nuxt-bitcoin-microservice
Проект состоит из нескольких сервисов:
- Poller
    Берёт bitcoin-обновления из открытого источника и кладёт в базу данных.
    Стэк: Nodejs, Prisma, Axios
- Migrator
    Применяет prisma-схему при самом первом запуске docker-compose.yaml 
- Postgres
- Nuxt-btc (UI) (https://github.com/murningstar/testtask-nuxt-plot-btc)
    SSR, Api сервер. Отображает данные из базы на графике с помощью vue-chartjs.
    Стэк: Nuxt, Chart.js, NaiveUI, Tailwind, Prisma.

## Краткое описание сервисов

### Poller

Делает длинные опросы API открытого источника btc-обновлений и кладёт в Postgres только свежие данные.

### Migrator

Инициализирует схему при первом запуске compose-стэка.

### Postgres

Здесь ничего необычного.

### Nuxt-btc

Описание в самом репозитории https://github.com/murningstar/testtask-nuxt-plot-btc.

## Workflow всего compose-файла

1. Запускается postgres
2. Migrator ждёт, пока postgres станет healthy
3. Migrator проверяет, первый ли это запуск и если так, то применяет миграцию; иначе - просто отключается
4. Poller - начинет длинные опросы внешнего API. (после успешного выключения Migrator'а)
5. Если появляется обновление, то poller кладёт его в Postgres
6. Nuxt-btc - запускается после выключения Migrator также как и Poller.

## Важные заметки:

-   Для работы **migrator**-сервиса необходимо заперсистить `/usr/migrator`
