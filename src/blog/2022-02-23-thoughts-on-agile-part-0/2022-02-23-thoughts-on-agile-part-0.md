---
title: "Мысли об Agile. Часть 0"
icon: 💡
date: 2022-02-23 19:19:00 +0300
tags: [dev]
---

Мысли в основном родившиеся после прочтения книги Роберта Мартина "Чистый Agile".

Зачем вообще читать книги об этом? О чем тут размышлять? Дело в том, что у меня много противоречий по этому поводу. С одной стороны мода на [Agile][1] не проходит. Если вы собеседуетесь на разработчика, вам скорее всего скажут, что работают в данной компании по Agile. Некоторые даже преподнесут это как плюс. Это может быть плюсом, но что конкретно они имеют в виду? По количеству толкований Agile может сравниться с [SRP][2]

Я начинал свой путь программиста в компании, где внедрение Agile происходило при мне. Мы проходили обучение, нам рассказывали что есть "плохой" подход - "Waterfall" (так же известный как ["Каскадная модель"][3]), а сейчас "правильно" применять гибкие практики разработки. Объясняли различные инструменты, термины и роли составляющие новый подход. Кто-то воспринимал инициативу с энтузиазмом (в основном молодые), опытные разработчики чаще были настроены скептично. "Что поменялось то?", спрашивали они.

Нам рассказали, что мы делимся на небольшие команды. Каждая команда работает короткими промежутками (почему-то чаще всего выбирают 2 недели) называемыми спринтами. На эти 2 недели набирается определенный объем задач, который разработчики обязуются выполнить. Мы регулярно не успевали выполнить все задачи взятые в спринт. Нам регулярно добавляли задач в середине спринта. Про качество исполнения этих задач я молчу.

В кабинете повесили [Канбан-доску][4] с колонками: "сделать", "в работе", "сделано" (названия и набор могут меняться). На доску крепились листочки с коротким описанием задач, и участники должны были переносить эти листочки из колонки в колонку в соответствии с работой. К Канбану у меня меньше всего вопросов, потому что список задач с наглядным представлением прогресса этих задач действительно удобен.

Каждый день, в фиксированное время, проходила командная активность под названием митинг (иногда стендап, что подразумевает, что люди при этом стоят). Члены команды по очереди рассказывали, чем они занимались с прошлого митинга, столкнулись ли они с какими-то трудностями и что планируют делать дальше. Тут принципиально важно, чтобы команда была небольшая, все высказывались максимально коротко, а посторонние темы не поднимались. Часто эти условия не соблюдаются, и длительность митинга может достигать часа (мои соболезнования тем, кто проводит его стоя).

Каждый спринт заканчивался демо и ретроспективой. Демо - это демонстрация результата работы за прошедший спринт. Возникает вопрос, демонстрация кому? Бывает команда демонстрирует что-то сама себе. Нужно ли это? Считается, что демо проводится для группы людей именуемой стэйкхолдеры, но на практике часто возникает проблема с определением этой группы. Иногда группа определена, но на демо попасть не может (или не хочет). Еще вопрос, что показывать? Я присутствовал на демо, где команда показывала интерфейс с заглушками - это когда вместо расчета и выдачи каких-то данных, мы выдаем данные заранее рассчитанные по тем условиям, которые будем использовать на демо. С другими условиями такая программа ничего рассчитывать не будет. У программистов это называется "захардкодить".

Ретроспектива - это такая командная активность, в ходе которой участники пытаются вместе составить список всего, что помешало в работе за прошедший спринт, и всего, что помогло, а также придумать, как исправить то, что мешает. Иногда это называют "выделить плюсы и минусы спринта" или "что нам удалось, а что мы можем делать лучше". На практике, часто приходится доказывать остальным членам команды, что мы можем делать что-то лучше. А то, что все-таки попадает в этот список, чаще всего в нем и остается, и может кочевать потом из ретроспективы в ретроспективу.

К обычным разработчикам, тестировщикам, техническим писателям и прочим добавились новые роли - Scrum Master и Product Owner (владелец продукта). Я не стану утверждать, что все участники понимали суть этих ролей. По-моему, это было необходимо, чтобы соответствовать формальными требованиям.

Это не определение практик гибкой разработки, не инструкция, как их применять. Это то, что получалось на практике у нашей команды и других команд, где я работал потом.

Выбирала ли команда такой способ работы? Нет, обычно его навязывали сверху. Я не знаю как продавали Agile менеджерам, помогал ли он решать им какие-то задачи управления? Я точно могу сказать, что не все приняли правила игры. За все последующие годы работы, мне редко попадались коллеги, которые лучше понимали принципы, а главное цель применения Agile. Чаще те, кто понимал довольно поверхностно. Были те, кто считал что на Agile вообще не стоит тратить время. Понимал ли я принципы и цель? Вряд ли. Мне не кажется, что все эти активности сильно помогали мне, хотя я чувствовал что-то в самой идее.

Во всех компаниях, куда я приходил после, мне никто не объяснял, чем и почему мы занимаемся именно с точки зрения методологии. Мне говорили, "спринт - 2 недели, доска в Trello (Notion, Azure DevOps, или, прости господи, в Jira), митинг каждый день в 15 (время может разниться), поехали". Митинг нужен был, чтобы менеджер держал руку на пульсе, знал, чем занимается каждый участник команды. На демо мы показывали еле работающее нечто, которое вынуждены были потом допиливать еще пару спринтов. Новый функционал вносить было все сложнее, баги росли как на дрожжах, выпуск каждой новой версии продукта становился все тяжелее и дольше.

Если отвлечься от моего опыта и брать шире - Agile довольно обсуждаемая тема. Есть много сертифицированных курсов, выступлений на наконференциях, книг, статей и роликов на Youtube. Мне кажется, дело не в том, что мы не правильно понимаем Agile. Каждый понимает его по своему. Принято считать, что Agile это общее название для множества методологий, а не какая-то конкретная. То что пытались воплотить в командах, где я работал, больше похоже на Scrum. Человек, читавший про Scrum, мог бы сказать, что мы просто неправильно его применяли. Но я видел множество мнений, что же самое важное в Agile, а что не существенно. Какие элементы должны непременно быть, а какие мы можем варьировать. Видел даже мнения, что этот Scrum вообще не нужен. И черт его знает, вдруг они правы? Вдруг это все хайп, поиск серебрянной пули, способ консультантов заработать на нас деньги?

Я знаю, мы не роботы, мы не должны быть абсолютно во всем согласны. Идея не должна быть залита бетоном, она может развиваться со временем. Возможно наш Agile уже не похож на Agile тех 17 человек, что подписали [манифест][5]. К тому моменту Кент Бек уже придумал свой XP, Кен Швабер и Джефф Сазерленд уже выступили с идеей Scrum, Алистер Кокберн создал нечто под названием Crystal. У остальных участников было много собственных оригинальных идей. Что заставило их собраться в феврале 2001 года на лыжном курорте и начать обсуждение? Что искали они, обладая различными взглядами? Похоже эти люди понимали, что техники могут быть разные, но проблема у них общая - эффективность разработки ПО. Что-то может различаться, но что-то составляет саму суть гибкого подхода, саму суть разработки в команде.

Робер Мартин, один из 17 создателей манифеста, он видел процесс своими глазами, это была его собственная боль. Возможно он не истина в последней инстанции, но, я думаю, про Agile ему известно побольше нашего. Возможно мы можем научиться у него какой-то мудрости? А после осознанно и самостоятельно обдумать то, что он хотел нам сказать.

[1]: https://ru.wikipedia.org/wiki/%D0%93%D0%B8%D0%B1%D0%BA%D0%B0%D1%8F_%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F_%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B8
[2]: http://sergeyteplyakov.blogspot.com/2014/08/single-responsibility-principle.html
[3]: https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D1%81%D0%BA%D0%B0%D0%B4%D0%BD%D0%B0%D1%8F_%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C
[4]: https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D0%BD%D0%B1%D0%B0%D0%BD-%D0%B4%D0%BE%D1%81%D0%BA%D0%B0
[5]: https://agilemanifesto.org/iso/ru/manifesto.html