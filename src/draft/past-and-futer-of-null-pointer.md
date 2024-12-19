---
title: "Прошлое и будущее null. Ревизия"
icon: 💡
date: 2022-02-23 19:19:00 +0300
tags: [dev, C#]
---

Наверняка все слышали как [Энтони Хоар][1], которому приписывают (или он сам себе приписывает) изобретение null reference, позднее называл свою идею ошибкой на миллиард долларов. В поиске этой цитаты я наткнулся на его [выступление 2009-го года][2]. Излагает он неторопливо, так что комментаторы иронизируют насчет просмотра на полуторной скрорости. Тем не менее, интересно узнать, какую проблему он решал.

Мне, человеку испорченному ООП и скорее считающему, что тип - это такое средство инкапсуляции, было интересно узнать, что Хоар, на самом деле, при помощи системы типов боролся с целым классом ошибок. Его целью было сделать так, чтобы человек пишущий на высокоуровневом языке был избавлен от необходимости в случае ошибки спускаться на уровень ниже. Он хотел защитить пользователей языка от необходимости знать конкретную архитектуру или разбираться в какой ячейке памяти лежит объект, и куда мы запросили доступ. Пользователь должен был способен находить ошибки глядя лишь на высокоуровневый код. 

Например, в языке Algol 60, создатели добавили проверки выхода за границы во время исполнения, чтобы пользователь не мог получить доступ к какой‑нибудь случайной памяти за пределами предполагаемого диапазона. Однако, эти проверки увеличивали объем кода и потребляли ресурсы, которые на тот момент были сильно ограничены.

Для следующей версии языка Algol Хоар предложил концепцию объекта (он называет это `record handling`), доступ к которому осуществляется через ссылку. Будь-то переменная или свойство, если мы могли присвоить чему-то ссылку, это что-то должно было иметь конкретный тип, определяющий, как этот тип храниться в памяти. Если объект в свою очередь содержал другие ссылки, их тип тоже должен был быть определен. Это позволяло проверять корректность работы со ссылками на этапе компиляции, точно так же, как это делается с другими значениями не являющимися ссылками. Представление данных программы как набора записей определенного типа избавляло от проблемы выхода за границы и позволяло убрать добавленные ранее проверки.


[1]: https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D0%B0%D1%80,_%D0%A7%D0%B0%D1%80%D0%BB%D1%8C%D0%B7_%D0%AD%D0%BD%D1%82%D0%BE%D0%BD%D0%B8_%D0%A0%D0%B8%D1%87%D0%B0%D1%80%D0%B4
[2]: https://www.youtube.com/watch?v=YYkOWzrO3xg&ab_channel=HoigimDang

--

---

История с Хоаром, цель создания, дотсоинства и недостатки

bounds checking https://en.wikipedia.org/wiki/Bounds_checking

- null или ссылка на null object
- NullReferenceTypes
- Option

--

The invention of the null pointer in programming was driven by the need to handle the absence of a valid or meaningful value in a variable. Here are the key reasons why null pointers were introduced:

1. Representation of Absence of Value: In programming, variables often need to represent the absence of a value, i.e., no valid data is assigned to them at a particular point in time. This absence needed a specific representation that could be recognized and handled by the program.

2. Error Handling and Initialization: Null pointers provided a way to signify uninitialized or unassigned pointers or references. This was important for error handling and avoiding unexpected behavior caused by accessing uninitialized memory addresses.

3. -Memory Management: In languages where memory management is explicit (like C and C++), null pointers allow developers to indicate that a pointer doesn’t currently refer to a valid memory location. This is particularly crucial in systems programming where memory allocation and deallocation are managed by the programmer.

4. Avoiding Undefined Behavior: Accessing a null pointer deliberately triggers an error or exception in most modern languages, preventing undefined behavior like accessing random memory addresses. This helps in catching bugs during development and improving program reliability.

5. Language Design and Safety: Null pointers are part of the design choices made in many programming languages to balance between flexibility and safety. They allow for optional values (like in languages with optional types) and can be managed in a way that minimizes runtime 

6. Historical Context: The concept of null pointers has evolved over time with the development of programming languages. It emerged as a solution to handle scenarios where variables might not always have valid values, providing a structured way to deal with such cases.

--

type = location of store
чтобы корректность работы с сылками можно было проверить на этапе компиляции таким же образом, как проверяется корректность работы со значениями, которые не являются ссылками

--

A subscript error in programming, also known as an "index out of range" error or "out of bounds" error, occurs when you attempt to access an element of an array, list, or similar data structure using an index that is not valid for that particular structure. This error is common in languages like C, C++, Python, and others where arrays or lists have a fixed size or defined length.

Array Indexing: In many programming languages, arrays are indexed starting from 0. For example, in C/C++, if you have an array int arr[5], valid indices for this array are 0 through 4. Trying to access arr[5] would be an out of bounds error because it exceeds the valid index range.

Accessing Memory Beyond Bounds: When you attempt to access an element using an index that is greater than or equal to the length or size of the array or list, you are essentially trying to access memory that is not allocated or reserved for that particular data structure.

--

An Axiomatic Basis for Computer Programming

In this paper, he introduced the concept of the null reference as a way to represent the absence of an object or the concept of "no value

--

Хоар обнаружил, что введение типов позвоялет избавится от (out of bounds) // проверка на выход за границы
Ты не можешь создать ссылку, которая ни на что не указывает и при этом уловлетворяет определенному типу.
Это предотвращало целый класс ошибок

null pointer != null reference

--

disjoint union - union between two sets that have no members in common
но это увеличивает размер программы (накладные расходы)

не ссылка, которая указывает вникуда, а ссылка на один уникальный объект, который олицетворяет отсутствие значения