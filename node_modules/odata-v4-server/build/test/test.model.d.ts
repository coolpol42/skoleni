/// <reference types="node" />
import { Token } from "odata-v4-parser/lib/lexer";
import { ODataController, ODataServer, ODataProcessor, ODataResult, ODataHttpContext, ODataStream, ODataEntity } from "../lib/index";
import { Product, Category } from "./model/model";
import { ProductPromise, CategoryPromise } from "./model/ModelsForPromise";
import { GeneratorProduct, GeneratorCategory } from "./model/ModelsForGenerator";
import { Readable, PassThrough, Writable } from "stream";
import { ObjectID } from "mongodb";
import * as streamBuffers from "stream-buffers";
export declare class Foobar {
    id: number;
    a: number;
    foo: string;
    Foo(): void;
    Bar(): string;
    echo(message: any): any;
    echoMany(message: any): any[];
}
export declare class Image {
    Id: number;
    Filename: string;
    Data: ODataStream;
    Data2: ODataStream;
}
export declare class Music extends PassThrough {
    Id: number;
    Artist: string;
    Title: string;
}
export declare class SyncTestController extends ODataController {
    entitySet(): {
        id: number;
        a: number;
    }[];
    entity(key: number): Promise<ODataResult<{}>>;
    insert(body: any): any;
    put(body: any): void;
    patch(key: number, delta: any): any;
    putProperty(body: any, _: Foobar): void;
    patchProperty(body: any, _: Foobar): void;
    deleteProperty(_: Foobar): void;
    remove(): void;
    getFoo(): {
        id: number;
        foo: string;
    };
}
export declare class GeneratorTestController extends ODataController {
    entitySet(): IterableIterator<{
        id: number;
        a: number;
    }[]>;
}
export declare class AsyncTestController extends ODataController {
    entitySet(): Promise<{}>;
    entity(key: number): Promise<ODataResult<{}>>;
    insert(body: any): Promise<{}>;
}
export declare class InlineCountController extends ODataController {
    entitySet(): {
        id: number;
        a: number;
    }[];
}
export declare class BoundOperationController extends ODataController {
    Action(): Promise<{}>;
    Function(value: number): string;
    FunctionMore(message: string, value: number): string;
    entitySet(): {
        id: number;
        a: number;
    }[];
    entity(key: number): {
        id: number;
        a: number;
    };
}
export declare class ImagesController extends ODataController {
    entitySet(_: Token, __: any, ___: any, ____: ODataProcessor): Image[];
    entity(key: number): Image;
    getData(_: number, context: ODataHttpContext): streamBuffers.ReadableStreamBuffer;
    postData(_: number, data: Readable): streamBuffers.WritableStreamBuffer;
    getData2(_: number, stream: Writable, context: ODataHttpContext): Promise<Readable | ODataStream>;
    postData2(_: number, data: Readable): Promise<Writable | ODataStream>;
}
export declare class MusicController extends ODataController {
    findAll(_: ODataHttpContext): Music[];
    findOne(_: number, __: ODataHttpContext): Music;
    mp3(_: number, context: ODataHttpContext): Writable;
    post(_: number, upload: Readable): streamBuffers.WritableStreamBuffer;
}
export declare class ProductsController extends ODataController {
    find(query: Token): any;
    findOne(key: string): Product;
    getName(key: string, result: Product): string;
    setCategory(key: string, link: string): Promise<number>;
    unsetCategoryId(key: string, link: string): Promise<number>;
}
export declare class CategoriesController extends ODataController {
    find(filter: Token): Category[];
    findOne(key: string): Category;
    insertProduct(key: string, link: string, body: Product): Promise<ODataResult<{}>>;
    findProduct(key: string, link: string): Product;
    setCategory(key: string, link: string): IterableIterator<any>;
    unsetCategory(key: string, link: string): Promise<{}>;
}
export declare class CategoryStream extends Category {
}
export declare class CategoriesStreamingController extends ODataController {
    find(filter: Token, stream: Writable): void;
    findOne(key: string): any;
    getProducts(result: Category, stream: Writable, context: ODataHttpContext): void;
}
export declare class Product2 {
    _id: ObjectID;
    CategoryId: ObjectID;
    Category2: Category2;
    Discontinued: boolean;
    Name: string;
    QuantityPerUnit: string;
    UnitPrice: number;
}
export declare class Category2 {
    _id: ObjectID;
    Description: string;
    Name: string;
    Products2: Product2[];
    echo(): string[];
}
export declare class CategoriesGeneratorController extends ODataController {
    find(filter: Token, stream: Writable): IterableIterator<any>;
    findOne(key: string): IterableIterator<any>;
    findProduct(key: string, result: Category2): IterableIterator<any>;
    findProducts(filter: Token, stream: Writable, result: Category2): IterableIterator<Promise<any>>;
}
export declare class ProductsGeneratorController extends ODataController {
    find(filter: Token, stream: Writable): IterableIterator<any>;
    findOne(key: string): IterableIterator<any>;
    findCategories(filter: Token, stream: Writable, result: any): IterableIterator<any>;
}
export declare class ProductsPromiseGeneratorController extends ODataController {
    find(filter: Token): IterableIterator<any>;
    findOne(key: string): IterableIterator<any>;
    findCategories(filter: Token, result: ProductPromise): IterableIterator<any>;
}
export declare class CategoriesPromiseGeneratorController extends ODataController {
    find(filter: Token): IterableIterator<any>;
    findOne(key: string): IterableIterator<any>;
    findProduct(key: string, result: CategoryPromise): IterableIterator<any>;
    findProducts(filter: Token, stream: Writable, result: CategoryPromise): IterableIterator<any>;
}
export declare class ProductsAdvancedGeneratorController extends ODataController {
    find(filter: Token): IterableIterator<any>;
    findOne(key: string): IterableIterator<any>;
    findCategories(filter: Token, result: GeneratorProduct): IterableIterator<any>;
}
export declare class CategoriesAdvancedGeneratorController extends ODataController {
    find(query: Token, filter: Token): IterableIterator<Promise<any> | Category[]>;
    findOne(key: string): IterableIterator<any>;
    filterProducts(query: Token, filter: Token, result: GeneratorCategory): IterableIterator<Promise<any> | GeneratorProduct[]>;
}
export declare class Image2 {
    Id: number;
    Filename: string;
    Data: ODataStream;
    Data2: ODataStream;
}
export declare class Images2Controller extends ODataController {
    entitySet(_: Token): Image2[];
    entity(key: number): Image2;
    getData2(_: number, stream: Writable, context: ODataHttpContext): IterableIterator<any>;
    postData2(_: number, data: Readable): IterableIterator<any>;
}
export declare class Location {
    City: string;
    Address: string;
    constructor(city: any, address: any);
}
export declare class User {
    Id: number;
    Location: Location;
    constructor(id: any, location: any);
}
export declare class UsersController extends ODataController {
    find(): User[];
    findOne(key: number): User;
    logout(): void;
}
export declare class DefTest extends ODataEntity {
}
export declare class DefTestController extends ODataController {
    all(): (DefTest & {
        id: number;
        key: string;
        value: string;
    })[];
    one(key: any): DefTest & {
        id: any;
        key: string;
        value: string;
    };
}
export declare class HeaderTestEntity {
    Id: number;
}
export declare class HeaderTestEntityController extends ODataController {
    findAll(ctx: ODataHttpContext, ___: any, ____: ODataProcessor): any[];
    findOneByKeys(key: number, ctx: ODataHttpContext): {};
}
export declare class UpsertTestEntity {
    Id: number;
    name: string;
    constructor(id?: any, name?: any);
}
export declare class UpsertTestEntityController extends ODataController {
    findAll(ctx: ODataHttpContext, ___: any, ____: ODataProcessor): UpsertTestEntity[];
    findOneByKeys(id: number, ctx: ODataHttpContext): UpsertTestEntity;
    put(body: any): UpsertTestEntity;
}
export declare class DefTestServer extends ODataServer {
}
export declare class HiddenController extends ODataController {
}
export declare class TestServer extends ODataServer {
    ActionImport(): Promise<{}>;
    ActionImportParams(value: number): void;
    FunctionImport(value: number): string;
    FunctionImportMore(message: string, value: number): string;
    SetStatusCode(ctx: ODataHttpContext): string;
    SetStatusCode2(ctx: ODataHttpContext): void;
}
export declare class AuthenticationServer extends ODataServer {
    echo(message: string): string;
}
export declare class ProductServer extends ODataServer {
}
export declare class CategoryServer extends ODataServer {
}
export declare class NoServer extends ODataServer {
}
