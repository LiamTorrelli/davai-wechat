# DAVAI-WECHAT

```bash
  davai-wechat release
```

Как происходит релиз в WeChat:

1) Мерджим все, что надо в PRE-PROD (integration branch) => руками с описанием мерджа а-ля:

  > PREPARING RELEASE 0.0.2

__Остальное делается скриптом__
```
- - - - - - - - - - - -
Мы на ветке PRE-PROD
- - - - - - - - - - - -
```
2) Проверяем, что нет текущих изменений в PRE-PROD
3) git fetch --all
-) TODO: Проверить, что больше нет веток PROJECTNAME-#.#.# не вмердженых в мастер
4) git merge origin master
5) Обновляем версию приложения 0.0.1 - 0.0.2 в файлах:
  - VERSION
  - package.json -> "version": "0.0.2",
  - app.settings.js -> APP_SETTINGS_PROD
  - добавляем PRODUCTION.js

6) Делаем коммит в PRE-PROD а-ля:

  > Updated project version to 0.0.2, added PRODUCTION.js file

```
- - - - - - - - - - - -
PROJECTNAME-0.0.2
- - - - - - - - - - - -
```
7) Создаем и переходим на PROJECTNAME-0.0.2
  - разница между 0.0.1 и PROJECTNAME-0.0.2
    - VERSION file
    - package.json
    - app.settings.js
    - PRODUCTION.js

8) Проверяем, что:
  - все PROD версии совпадают
  - есть PRODUCTION.js файл в папке
  - нет изменений на данном этапе в PROJECTNAME-0.0.2
  - Получаем number of commits (difference from master)

9) Делаем релиз в WeChat

10) Удаляем все ненужные файлы (PRODUCTION.js)

11) Создаем и пушим tag v0.0.2

12) Делаем мердж commit PROJECTNAME-0.0.2 в master а-ля:
  > RELEASED 0.0.2 [ date, time ]

  > - Number of commits

  > ... some othe crap
