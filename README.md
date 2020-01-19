# svelte-store-persisted
![](https://img.shields.io/npm/v/@alanchenchen/svelte-store-persisted.svg)
![](https://img.shields.io/npm/dt/@alanchenchen/svelte-store-persisted.svg)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

A persisted plugin for svelte store manager
> 基于svelte store manager开发的将state状态持久化的插件

> Author：Alan Chen

> Version: 0.1.1

> Date: 2020/1/19

## features
1. 自动同步state到浏览器本地存储，初始化同步一次，在每次commit都会更新。
2. 本地存储默认是window.localStorage，可选window.sessionStorage。
3. 由于和mutaion绑定，所以只支持同步操作的本地存储，而不支持web IndexDB。
4. 本插件支持store单独调用，也支持全局调用，当全局调用时，store必须提供模块的name。
5. 支持存储指定store的指定数据。

## installation
`npm install --save-dev @alanchenchen/svelte-store-persisted` or `yarn add @alanchenchen/svelte-store-persisted --dev`

## usage
```js
// 全局使用
import { useGlobalPlugins } from "@alanchenchen/svelte-store";
import persisted from "@alanchenchen/svelte-store-persisted";

useGlobalPlugins([
    persisted({
        // 只会存储所有store的name字段，过滤age字段.
        paths: ["name"]
        filter: (storeName) => {
            // moduleA不会应用此插件.
            if (storeName === "A") {
                return false
            } else {
                return true;
            }
        }
    })
]);
```

```js
// 分模块使用
// a.js
import { createStore } from "@alanchenchen/svelte-store";
import persisted from "@alanchenchen/svelte-store-persisted";

const a = createStore({name: "A", age: 21}, "moduleA");
a.use(persisted());
// b.js
import { createStore } from "@alanchenchen/svelte-store";
import persisted from "@alanchenchen/svelte-store-persisted";

const b = createStore({name: "B", age: 22}, "moduleB");
b.use(persisted());
```

## options
persisted的参数是个对象，格式如下：
* key - storage存储的key值，默认svelte-store，当全局使用时，会取store实例的name属性，全局使用必须要补全store实例的name。
* paths - store实例存储在storage里的数据路径，由store实例初始值的key的数组，默认空数组，全部的属性都会存储。
* filter - 过滤某些不需要存储的情况，回调函数，返回值为true的数据才会被存储，参数如下：
    * storeName - 应用此插件的store实例名称，当全局使用时，可以过滤某些store不被存储
    * type - mutation的类型
* storage - storage的类型，默认window.localStorage，可选window.sessionStorage。

## build
1. `git clone https://github.com/alanchenchen/svelte-store-persisted.git`
2. 然后`yarn`安装好依赖
3. 接着使用下面的脚本命令即可，目前入口文件是src/index.ts

## scripts
1. `npm run build`编译ts文件到dist目录.

## license
* Anti 996(996.ICU)
