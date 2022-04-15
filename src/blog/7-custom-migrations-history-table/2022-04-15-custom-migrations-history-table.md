---
title: "EF Core. Настройка схемы для журнала миграций"
icon: 💽
date: 2022-04-15 10:06:00 +0300
tags: [dev, EF]
---

По умолчанию EF Core использует таблицу `__EFMigrationsHistory`, чтобы вести историю миграций. По различным причинам может потребоваться использовать схему БД отличную от стандартной. Можно задать схемы для `DbContext` в следующем методе:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.HasDefaultSchema("you_schema");
    ...
}
```

Но эта настройка не влияет на журнал миграций, если хочется, чтобы журнал миграций тоже был создан в новой схеме, надо добавить следующую конфигурацию:

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

services.AddDbContext<MyDbContext>(options => options.UseSqlServer(connString,
                        o => o.MigrationsHistoryTable("__EFMigrationsHistory", "you_schema")));
```
