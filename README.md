

## Poller

Делает длинные опросы внешего BTC API и кладёт в Postgres только свежие данные

## Migrator

Инициализирует схему при первом запуске

## Workflow всего compose-файла

1. Запускается postgres
2. Migrator ждёт, пока postgres станет healthy
3. Migrator проверяет, первый ли это запуск и если так, то применяет миграцию; иначе - просто отключается
4. Poller - начинет длинные опросы внешнего API.
5. Если появляется обновление, то poller кладёт его в Postgres

## Важные заметки:

-   Для работы **migrator**-сервиса необходимо заперсистить `/usr/migrator`
