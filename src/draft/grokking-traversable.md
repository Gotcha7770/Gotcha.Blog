---
title: "Грокаем Traversable"
icon: 🕵️‍♂️
date: 2022-12-15 10:06:00 +0300
tags: [перевод, dev, F#]
---

Грокнув Traversable, вы удивитесь, как вы вообще раньше жили без него. Попытки понять Traversable просто глядя на сигнатуру типа никогда не доставляли мне особого удовольствия. Поэтому, в этом посте мы используем другой подход и сами придумаем его в процессе решения реальной задачи. Так мы прочувствуем момент осознания, когда наконец поймем, как он работает, и где его можно применять.

## Тестовый сценарий

Представьте, что мы работаем над онлайн магазином, и он устроен по принципу одноразового предложения - если товар закончился на складе, он выходит из продажи. Когда пользователь создает заказ, мы должны проверить количество товара на складе. Если запрошенное количество есть в наличии, мы временно резервируем его, прежде, чем пользователь сможет продолжить оформление заказа.

Наша конкретная задача - написать функцию `createCheckout` которая принимает объект `Basket` и пытается зарезервировать продукты, добавленные пользователем в корзину. Если все продукты были успешно зарезервированы, функция создаст объект `Checkout`, включающий общую сумму заказа и различные метаданные товаров, которые могут понадобиться для оплаты.

Наша модель данных может выглядеть так

```F#
type BasketItem =
    { ItemId: ItemId
      Quantity: float }

type Basket =
    { Id: BasketId;
      Items: BasketItem list }

type ReservedBasketItem =
    { ItemId: ItemId
      Price: float }

type Checkout =
    { Id: CheckoutId
      BasketId: BasketId
      Price: float }
```

Функция `createCheckout` возвращает тип `Checkout option`. Она возвращает значение `Some`, если все товары были зарезервированы и `None`, если некоторые товары зарезервировать не удалось. Серьезное решение должно бы было вернуть тип `Result` и детальное описание ошибки, но мы используем `Option` для простоты.

```F#
let createCheckout (basket: Basket): Checkout option
```

И как всегда нам везет, кто-то уже написал функцию, которая резервирует `BasketItem` на складе

```F#
let reserveBasketItem (item: BasketItem): ReservedBasketItem option
```

## Наша первая реализация

Похоже, все, что нам нужно - вызвать функцию `reserveBasketItem` для каждого элемента в корзине. Если все вызовы завершаться успешно, мы вычисляем общую цену и создаем `Checkout`

```F#
let createCheckout basket =
    let reservedItems =
        basket.Items |> List.map reserveBasketItem

    let totalPrice =
        reservedItems
        |> List.sumBy (fun item -> item.Price)

    { Id = CheckoutId "some-checkout-id"
      BasketId = basket.Id
      Price = totalPrice }
```

Мы просто перебираем элементы в корзине, и, при помощи уже знакомой нам функции `map`, отображаем их в зарезервированные элементы. А затем проходимся по получившейся коллекции, чтобы посчитать сумму корзины. Код выглядит простым и понятным, только вот он не скомпилируется.

Проблема в том, что `reservedItems` имеет тип `list<option<ReservedBasketItem>>`, а нам надо, чтобы тип был `option<list<ReservedBasketItem>>`, где результат имеет значение `None`, когда хотя бы один из элементов не удалось зарезервировать. Мы сможем рассчитать полную стоимость и создать `Checkout` только если все товары доступны. Представим, что мы написали такую функцию `reserveItems`, которая возвращает нам нужный тип.

```F#
let reserveItems (items: BasketItem list): option<list<ReservedBasketItem>>

let createCheckout basket =
    let reservedItems = basket.Items |> reserveItems

    reservedItems
    |> Option.map
        (fun items ->
            { Id = CheckoutId "some-checkout-id"
              BasketId = basket.Id
              Price = items |> List.sumBy (fun x -> x.Price) })
```

Уже лучше! Теперь, если все элементы зарезервированы, функция возвращает `Some` и мы можем получить список `ReservedBasketItem`. Если какой-либо из элементов не может быть зарезервирован, мы получим `None` и функция `Option.map` прервет вычисление, стало быть `createCheckout` тоже вернет `None`.

Мы свели задачу к реализации функции `reserveItems`. Уже понятно, что мы не можем просто использовать `List.map reserveBasketItem`, потому что параметры типа в результате идут не в том порядке - сначала `list` и затем `option`. Нам надо придумать способ инвертировать их!

## Инвертор

Никаких проблем, просто придумываем функцию `invertor`, которая преобразует `list<option<ReservedBasketItem>>` в `option<list<ReservedBasketItem>>`. С этой новой функцией мы легко напишем `reserveItems`

```F#
let invert (reservedItems: list<option<ReservedBasketItem>>) : option<list<ReservedBasketItem>>

let reserveItems (items: BasketItem list) : option<list<ReservedBasketItem>> =
    items
    |> List.map reserveBasketItem
    |> invert
```

Чтобы реализовать нашу функцию, начнем с сопоставления на списке

```F#
let invert (reservedItems: list<option<ReservedBasketItem>>) : option<list<ReservedBasketItem>> =
    match reservedItems with
    | head :: tail -> // делает что-то, если список не пуст
    | [] -> // делает что-то с пустым списком
```

У нас есть два случая:

1. если список пуст, очевидно, что он не содержит ошибок, значит мы просто возвращаем `Some[]`
2. если список содержит хотя бы один элемент, мы получаем первый элемент - `head`, который содержит `ReservedBaskedItem option` и остаток - `tail`, того же типа, что и изначальный список `list<option<ReservedBasketItem>>`

Напрашивается решение рекурсивно вызывать функцию `invert` на `tail`

```F#
let rec invert (reservedItems: list<option<ReservedBasketItem>>) : option<list<ReservedBasketItem>> =
    match reservedItems with
    | head :: tail ->
        let invertedTail = invert tail
        // Здесь нужно заново соединить head и инвертированный tail
    | [] -> Some []
```

Теперь нужно объединить `ReservedBasketItem option`, который лежит в `head` и `option<list<ReservedBasketItem>>`, который лежит в `tail`. Если бы оба значения не были бы обернуты в `option` мы просто воспользовались бы оператором конкатенации `::`. Что ж, мы можем написать функцию конкатенации для `option` значений.

```F#
let consOptions (head: option 'a) (tail: option<list<'a>>): option<list<'a>> =
    match head, tail with
    | Some h, Some t -> Some (h :: t)
    | _ -> None
```

Как видите, тут нет ничего сложного. Мы проверяем оба аргумента, являются ли они значением `Some`, и если да, разворачиваем, объединяем при помощи оператора `::` и заворачиваем обратно в `Some`. Во всех остальных случаях просто возвращаем `None`.

Наконец собрав все что мы написали, мы можем реализовать функцию `invert`

```F#
let rec invert (reservedItems: list<option<'a>>) : option<list<'a>> =
    match reservedItems with
    | head :: tail -> consOptions head (invert tail)
    | [] -> Some []
```

Мы также смогли сделать этот метод обобщенным, поскольку список может содержать любые элементы, а не только `ReservedBasketItem`.

## Причешем код при помощи аппликативного функтора

Если вы знакомы с аппликативным функтором, возможно потому что следите за этой серией и читали пост [Грокаем аппликативные функторы][1], вы могли заметить, что функция `consOptions` выглядит как некая специализированная версия `apply`. Действительно `consOptions` принимает значения обернутые в `option` и применяет их к функции.

Мы можем переписать функцию `invert` при помощи `apply`

```F#
let rec invert list =
    // псевдоним для оператора '::' - так мы сможем передать его как функцию в качестве параметра
    let cons head tail = head :: tail

    match list with
    | head :: tail -> Some cons |> apply head |> apply (invert tail)
    | [] -> Some []
```

По-хорошему, тип, который является аппликативным функтором, также должен иметь функцию `pure`. У `pure` очень простая задача - обернуть значение в тип контейнера. Например, в случае с `option`, `pure` это просто вызов `Some`.

Возьмем `pure` и еще немного улучшим наш код

```F#
let rec invert list =
    let cons head tail = head :: tail

    match list with
    | head :: tail -> pure cons |> apply head |> apply (invert tail)
    | [] -> pure []
```

Казалось бы не большое изменение, но мы убрали все упоминания типа `option`, в теории такой метод может работать с любым аппликативным функтором, таким как `Result` или `Validation`. К сожалению, на практике, F# не позволяет такой уровень абстрагирования и нам придется создавать версию `invert` для каждого аппликативного типа, с которым мы хотим ее использовать.

Вообще есть обходной путь с помощью [статически разрешаемых параметров типа][4] Я бы порекомендовал изучить библиотеку [FSharpPlus][3], если вам нужна эта функциональность, вместо того, чтобы писать все самостоятельно.

## Поздравляю, вы только что открыли `sequence`

Функция `invert` - это одна из функций, которые предоставляет тип `Traversable`, только ее принято называть `sequence`. Как мы убедились, `sequence` принимает коллекцию значений обернутых в специальный тип, наподобие `option` и превращает в коллекцию обернутую в этот тип. Можно сказать, что функция `sequence` меняет местами параметры типа.

`sequence` работает для комбинации многих типов. Например, вы можете взять `list<Result<'a>>` и преобразовать его в `Result<list<'a>>`. На самом деле не обязательно, чтобы один из типов был именно коллекцией, например, также возможно преобразование из
`Result<option<'a>, 'e>` в `option<Result<'a, 'e>>`

## Протестируйте свое понимание `sequence`

Попробуйте самостоятельно реализовать преобразование из `list<Result<_>>` в `Result<list<_>>`

<details>
  <summary>решение</summary>

```F#
module Result =
    let apply a f =
        match f, a with
        | Ok g, Ok x -> g x |> Ok
        | Error e, Ok _ -> e |> Error
        | Ok _, Error e -> e |> Error
        | Error e, Error _ -> e |> Error

    let pure = Ok

let rec sequence list =
    let cons head tail = head :: tail

    match list with
    | head :: tail -> Result.pure cons |> Result.apply head |> Result.apply (sequence tail)
    | [] -> Result.pure []
```

Как видите, реализация очень похожа на реализацию для `list<option<_>>`, мы просто подставили методы `Result.apply` и `Result.pure`. Я включил их определение в модуль `Result`.

</details>

## Кое что еще осталось неоткрытым

Вернемся к нашей первоначальной задаче и посмотрим, как выглядит решение с функцией `sequence`

```F#
let createCheckout basket =
    let reservedItems =
        basket.Items
        |> List.map reserveBasketItem
        |> sequence

    reservedItems
    |> Option.map
        (fun items ->
            { Id = CheckoutId "some-checkout-id"
              BasketId = basket.Id
              Price = items |> Seq.sumBy (fun x -> x.Price) })
```

Выглядит неплохо. Однако, мы дважды проходим по всем элементам корзины: первый раз, когда пытаемся зарезервировать каждый из элементов, и второй, когда используя функцию `sequence` объединяем все результаты резервирования, чтобы понять, завершилась ли успешно операция в целом. Что нам мешает сделать все в один проход?

Мы могли бы передать функцию `reserveBasketItem` в `sequence`, значит теперь у нас будет следующая сигнатура

```F#
let sequence (f: 'a -> 'b option) (list: 'a list): option<list<'b>>
```

Мы получаем список и пытаемся применить функцию `f` к каждому элементу этого списка. При этом, вместо того, чтобы отобразить все элементы списка и получить `list<option<'b>>`, мы сразу же хотим саггрегировать все значения в `option<list<'b>>`.

```F#
let rec sequence f list =
    let cons head tail = head :: tail

    match list with
    | head :: tail -> Some cons |> apply (f head) |> apply (sequence tail f)
    | [] -> Some []
```

Это практически та же функция, что мы написали ранее, единственное, что добавилось - применение `f` к `head` и передача `f` в качестве параметра далее в рекурсивный вызов. Мы объединили и вызов функции на элементе, который возвращает `option` и процесс объединения всех значений.

## Поздравляю, вы только что открыли `traverse`

Такое объединение функции `sequence` и отображения значения принято называть `traverse`. То есть `Traversable` это тип, на котором определены две функции `sequence` и `traverse`. Причем `sequence`, на самом деле, просто частный случай `traverse`, где параметром выступает функция `id` (_это функция, которая принимает аргумент и возвращает его, то есть по сути ничего не делает, x => x, прим. переводчика_). Мы можем определить `sequence` так:

```F#
let sequence = traverse id
```

Теперь, когда у нас есть функция `traverse`, мы, наконец, решили нашу задачу.

```F#
let createCheckout basket =
    basket.Items
    |> traverse reserveBasketItem
    |> Option.map
        (fun items ->
            { Id = CheckoutId "some-checkout-id"
              BasketId = basket.Id
              Price = items |> Seq.sumBy (fun x -> x.Price) })
```

## Протестируйте свое понимание `traverse`

Проверьте, сможете ли вы реализовать функцию `traverse` которая принимает значение `option<'a>` и функцию `'a -> Result<'b, 'c>`, а возвращает `Result<option<'b>, 'c>`

<details>
  <summary>решение</summary>

```F#
module Result =
    let apply a f =
        match f, a with
        | Ok g, Ok x -> g x |> Ok
        | Error e, Ok _ -> e |> Error
        | Ok _, Error e -> e |> Error
        | Error e1, Error _ -> e1 |> Error

    let pure = Ok

let traverse f opt =
    match opt with
    | Some x -> Result.pure Some |> Result.apply (f x)
    | None -> Result.pure None
```

Я еще раз включил определения функций `apply` и `pure`. Надеюсь так будет понятнее, какая часть функции `traverse` работает с внешним типом `option`, а какая с внутренним `Result`.

Реальная задача, где может потребоваться такая трансформация - реализация парсера. Допустим, у нас есть функция с сигнатурой

```F#
string -> Result<int, ParseError>
```

но нам надо применить ее к значению `string option`. Конечно, можно применить pattern matching и вызвать функцию парсера в ветви `Some`, а можно просто написать

```F#
myOptionalValue |> traverse parseInt
```

</details>

Другой интересный случай, если у нас есть функция преобразующая аргумент в строку. Попробуйте написать `traverse`, который будет вызываться вот так `[1; 2; 3] |> traverse stringify` и возвращать `["1"; "2"; "3"]`

<details>
  <summary>решение</summary>

```F#
module Identity =
    let apply a f = f a
    let pure f = f

let rec traverse list f =
    let cons head tail = head :: tail

    match list with
    | head :: tail -> Identity.pure cons |> Identity.apply (f head) |> Identity.apply (traverse tail f)
    | [] -> Identity.pure []

```

Я написал эту функцию таким же образом, как и остальные, при помощи аппликативного функтора `Identity`. `Identity` является вырожденным случаем, потому его `apply` просто вызывает функцию с аргументом, а `pure` просто возвращает функцию без изменений. `Identity` не оборачивает свои аргументы во что-либо, в отличие от остальных аппликативных функторов. Из-за этого функция `traverse` получила сигнатуру

```F#
list<'a> -> ('a -> 'b) -> list<'b>
```

и если вы читали пост [Грокаем функторы][4], то, скорее всего, узнали функцию `map`. Так и есть, `map` можно представить как частный случай `traverse` где внутренний из параметров типа - это `Identity`.

</details>

## `Traversable` в дикой природе

Всякий раз, когда у вас есть набор значений, завернутый во что-то вроде `option` или `Result`, но вам на самом деле нужен `option<list<'a>>` или `Result<list<'a>, 'e>`, `sequence` это то, что может вам помочь. Если при этом необходимо и поменять местами параметры типов и применить к каждому элементу некую функцию, тут уже можно воспользоваться `traverse`.

## Внимание прямо по крусу два типа обработки ошибок!

Когда мы имеем дело с типом `list<option<_>>`, нам надо знать, что хотя бы один элемент имеет значение `None`, чтобы вернуть `None`. Если вы помните, в посте [Грокаем валидацию при помощи аппликативного функтора][5] мы столкнулись с проблемой при обработке типа `list<Result<'a, 'e>>`. Есть два подхода к обработке ошибок: прекращение вычисления после первой и объединение всех ошибок. То же самое справедливо и для типа `Traversable`.

Мы можем поэкспериментировать в интерактивном сеансе F# с использованием уже упомянутой библиотеки `FsharpPlus`

```F#
> [Ok 1; Error "first error"; Error "second error"] |> sequence;;
val it : Result<int list, string> = Error "first error"

[Success 1; Failure ["first error"]; Failure ["second error"]] |> sequence;;
val it : Validation<string list, int list> =
  Failure ["first error"; "second error"]
```

(_Все примеры этой серии довольно простые, и может возникнуть вопрос, зачем мы наворачиваем все эти сложности, для таких элементарных задач, можно просто написать пару `if`, объявить пару переменных и дело с концом. Именно это место, как мне кажется, ярко демонстрирует силу функционального подхода. Когда мы разбирали аппликативный функтор, мы наткнулись на необходимость реализовать разное поведение при обработке ошибок. Мы выделили `эффект` как отдельный тип, чтобы можно было однообразно работать с ним, не зависимо от того, в чем эффект заключается. Когда нам потребовался тот же самый эффект, но в контексте других вычислений, оказалось, что у нас уже есть необходимая реализация и она уже работает ожидаемым образом. прим. переводчика_)

## Чему мы научились?

`Traversable` это более мощная версия `map`, особенно полезная, когда у нас есть операция, которую мы хотим выполнить (или уже выполнили) над списком значений. При этом если хотя бы одна операция завершилась ошибкой, в качестве конечного результата мы хотим также вернуть ошибку. Еще один способ грокнуть `TRaversable` - понять, что он позволяет выворачивать параметры обобщенного типа. Мы используем `traverse`, когда нужно выполнить вычисление, и `sequence`, когда у нас напротив уже есть результат каких-то вычислений.

[1]:
[2]: https://learn.microsoft.com/ru-ru/dotnet/fsharp/language-reference/generics/statically-resolved-type-parameters
[3]: https://fsprojects.github.io/FSharpPlus/
[4]:
[5]:
