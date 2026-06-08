### Сравнительная таблица (в README.md)

| Критерий         | Raw SQL | Knex        | Prisma       |
| ---------------- | ------- | ----------- | ------------ |
| Типобезопасность | ❌      | ⚠️ частично | ✅ автоген   |
| Контроль над SQL | ✅      | ✅          | ⚠️ ограничен |
| N+1 из коробки   | ❌      | ❌          | ✅ `include` |
| Миграции         | ручные  | ✅          | ✅           |
| Бойлерплейт      | много   | средне      | мало         |

### Результаты бенчей:

_PRODUCTION_

```bash
➜  e-soft-hw-10 git:(feat/prisma) ✗ NODE_ENV=production node /home/nesk/projects/e-soft/e-soft-hw-10/src/demos/benchmark.js
    [bench]-[ prisma ]: 131.354ms
    [bench]-[ knex ]: 44.637ms
```

_DEVELOPMENT_

```bash
➜  e-soft-hw-10 git:(feat/prisma) ✗ NODE_ENV=development node /home/nesk/projects/e-soft/e-soft-hw-10/src/demos/benchmark.js
    [bench]-[ prisma ]: 144.703ms
    [bench]-[ knex ]: 44.426ms
```

### Ответы на вопросы:

1. Почему сервисы и контроллеры **не изменились** при замене stub → Knex → Prisma? Какой принцип это обеспечивает?

*Ответ:* 
  Потому что мы использовали паттерн `DIP (dependency-injection-principle)` с `factory`, 
  которые вместе позволяют независеть от конкретной реализации внутренного модуля от внешнего и связывать модули лишь интерфейсом.

2. Что такое N+1 проблема? Покажите «плохой» и «хороший» вариант из вашего кода.

*Ответ:* 
  `N+1` проблема - это когда мы делаем запрос на получения какого-то множества, 
  а потом для каждого элемента этого множества выполняем ещё один запрос.
  
_ПЛОХОЙ_ПРИМЕР_
```js
const posts_bad = await prisma.post.findMany();
for (const post of posts_bad) {
  const user = await prisma.user.findUnique({ where: { id: post.user_id } });

  console.log(`"${post.title}" by ${user.name}`);
}
```

_ХОРОШИЙ_ПРИМЕР_
```js
const posts_good = await prisma.post.findMany({
  include: {
    user: {
      select: {
        name: true,
      },
    },
  },
});

for (const post of posts_good) {
  console.log(`"${post.title}" by ${post.user.name}`);
}
```

3. Когда вы выберете Knex, а когда Prisma? (3–4 предложения с примерами)

*Ответ:* 
  Я выбиру Knex, если мне нужно будет выполнять сложные sql-запросы, так как он более гибкий в этом плане и работает напрямую с sql.
  А Prisma'у я выбираю, если мне нужно будет написать что-то не слишком сложное, например, какой-нибудь mvp или crud-продукт и не париться в написании sql.
  Также prisma хороша, в случае если в проекте необходима типобезопасность, а knex больше для высоконагруженных систем, потому что он быстрее prisma.

4. `prisma migrate dev` vs `prisma migrate deploy` — в чём разница?

*Ответ:* 
  `prisma migrate dev` - разработка новых миграций (нельзя использовать в production);
  `prisma migrate deploy` - применение к существующих миграций (применяет миграции к челевой БД);

5. Как Knex защищает от SQL-инъекций?

*Ответ:* 
  1) он использует плейсхолдеры -> `?`, например,
  ```js
    knex.raw('SELECT * FROM users WHERE id = ?', [userId])
  ```
  2) он параметрезирует зн-я в цепочке своих методов, например, 
  ```js
    db("users").where("userId", userId);
  ```
  
  **Подкапотня:**
  - строит ast запроса, а потом
  - knex генерирует параметризованный sql-запрос в формате
  ```SQL
    select * from users where id = $1 and name $2;
    -- где параметры будут выглядеть - [1, "some-name"]
  ``` 
  - ну и отправляет запрос через драйвер
  
### Контрольные точки Части 3

- [x] Сравнительная таблица заполнена
- [x] Бенчмарк выполнен, результаты в README
- [x] 5 ответов на вопросы — своими словами
