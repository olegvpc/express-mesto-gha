[![Tests](https://github.com/olegvpc/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/olegvpc/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/olegvpc/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/olegvpc/express-mesto-gha/actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

[Mesto- серверная часть] https://github.com/olegvpc/express-mesto-gha


## Настройка бейджей статуса тестов
Перед началом работы над проектом рекомендуется исправить бейджи, отражающие статус прохождения тестов.
Для этого замените разметку бейджей на следующий фрагмент, подставив вместо `${имя_пользователя}` и `${имя_репозитория}` соответствующие значения.

```
[![Tests for sprint 13](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml) 

[![Tests for sprint 14](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml)
```


## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

## Полезные инстументы- создание Хардверного пользователя
```typescript
// _id созданного пользователя для автоматического добавления req.user._id во всех middleware ниже
app.use((req, res, next) => {
  req.user = {
    _id: '632dd2b94ceb7519db223be0',
  };
  next();
});
```
