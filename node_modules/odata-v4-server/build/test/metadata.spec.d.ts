/// <reference types="node" />
import { ODataController, ODataServer, ODataProcessor, Edm, ODataStream, ODataQuery } from "../lib/index";
import { PassThrough } from "stream";
import { ObjectID } from "mongodb";
export declare enum Genre {
    Unknown = 0,
    Pop = 1,
    Rock = 2,
    Metal = 3,
    Classic = 4
}
export declare class Media extends PassThrough {
    Id: number;
    StringId: String;
    Meta: Meta;
}
export declare class CompoundKey {
    bc0: number;
    bc1: number;
    bc2: boolean;
    bc3: number;
    bc4: string;
    bc5: number;
}
export declare class BaseComplex {
    bc0: string;
    Genre: Genre;
}
export declare class SubComplex extends BaseComplex {
    sc0: string;
}
export declare class Complex extends SubComplex {
    c0: string;
}
export declare class SimpleObjectID extends ObjectID {
    static "@odata.type": string;
}
export declare class SimpleEntity {
    MongoId: SimpleObjectID;
}
export declare class MyType {
    static "@odata.type": string;
}
export declare enum Color {
    Red = 0,
    Green = 1,
    Blue = 2,
    "@odata.type"
}
export declare class BaseMeta {
    MongoId: ObjectID;
    b0: string;
    constructor();
}
export declare class Meta extends BaseMeta {
    Id: number;
    MongoId: ObjectID;
    myType: MyType;
    p0: number;
    p1: boolean;
    p2: number;
    p3: Date;
    p4: number;
    p5: number;
    p6: number;
    p7: number;
    p8: string;
    p9: number;
    p10: number;
    p11: number;
    p12: number;
    p13: number;
    p14: ODataStream;
    p15: string;
    p16: number;
    p17: any;
    p18: any;
    p19: any;
    p20: any;
    p21: any;
    p22: any;
    p23: any;
    p24: any;
    p25: any;
    p26: any;
    p27: any;
    p28: any;
    p29: any;
    p30: any;
    p31: any;
    p32: any;
    p33: number[];
    p34: boolean[];
    p35: number[];
    p36: Date[];
    p37: number[];
    p38: number[];
    p39: number[];
    p40: number[];
    p41: string[];
    p42: number[];
    p43: number[];
    p44: number[];
    p45: number[];
    p46: number[];
    p47: ODataStream[];
    p48: string[];
    p49: number[];
    p50: any[];
    p51: any[];
    p52: any[];
    p53: any[];
    p54: any[];
    p55: any[];
    p56: any[];
    p57: any[];
    p58: any[];
    p59: any[];
    p60: any[];
    p61: any[];
    p62: any[];
    p63: any[];
    p64: any[];
    p65: any[];
    p66: ODataStream;
    Complex: Complex;
    ComplexList: Complex[];
    a0(): void;
    f0(): string;
    f2(message: any): any;
    MediaList: Media[];
    Genre: Genre;
    Color: Color;
}
export declare class TestEntity {
    test: number;
    Genre: Genre;
}
export declare class EmptyEntity {
    enumTypeAction(value: Genre, type: any): void;
    enumTypeFunction(value: Genre, type: any): Genre;
}
export declare class EmptyEntity2 {
}
export declare class EmptyEntity3 {
}
export declare class EmptyEntity4 {
}
export declare class EmptyEntity5 {
}
export declare class EmptyEntity6 {
}
export declare class EmptyEntity7 {
}
export declare class HiddenEmptyEntity {
}
export declare class TestContainerBase extends Edm.ContainerBase {
    Test2: typeof TestEntity;
}
export declare enum FuncEnum {
    Default = 42
}
export declare enum FuncEnum2 {
    Default = 13
}
export declare enum FuncEnum3 {
    ActionEnumMemberName = 42
}
export declare enum FuncEnum4 {
    FunctionEnumMemberName = 42
}
export declare class Foobar {
    toString(): string;
}
export declare class TestContainer extends TestContainerBase {
    Genre2: typeof Genre;
    ObjectID2: typeof ObjectID;
    FuncEnum: typeof FuncEnum;
    FuncEnum2: typeof FuncEnum2;
    FuncEnum3: typeof FuncEnum3;
    FuncEnum4: typeof FuncEnum4;
    "Foo.Bar": typeof Foobar;
}
export declare class TypeDefContainer extends Edm.ContainerBase {
    'Object.ID2': typeof ObjectID;
}
export declare class EnumContainer {
    'Server.Genre2': typeof Genre;
}
export declare class MetaController extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): ({
        MongoId: ObjectID;
        b0: string;
        "@odata.type": typeof BaseMeta;
        Id?: undefined;
        p0?: undefined;
        p1?: undefined;
        p9?: undefined;
        p10?: undefined;
    } | {
        Id: number;
        p0: number;
        p1: boolean;
        p9: number;
        p10: number;
        MongoId: ObjectID;
        "@odata.type": typeof Meta;
        b0?: undefined;
    })[];
    findOneByKeys(query: ODataQuery, key1: number, key2: number, key3: number, key4: string): Meta;
    insert(body: Meta): Meta;
    getMedia(result: Meta): Media[];
    getMediaByKey(key1: number, key2: string, result: Meta): Media;
    getMediaRef(link1: number, link2: number, k1: string, k2: number, k3: number, k4: number, result: any): Meta;
    ControllerAction(): void;
    ControllerFunction(str: string): string;
    useOdataType(type: any): any[];
}
export declare class MediaController extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): Media[];
    findOne(key1: number, key2: string): Media;
    ControllerAction(value: number): void;
    ControllerFunction(): string;
}
export declare class CompoundKeyController extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): CompoundKey[];
    findOneByKeys(key1: number, key2: number, key3: boolean, key4: number, key5: string, key6: number): CompoundKey;
}
export declare class BaseTestEntityController extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): TestEntity[];
    insert(body: TestEntity): TestEntity;
}
export declare class TestEntityController extends BaseTestEntityController {
    findAll(__: any, ___: any, ____: ODataProcessor, $filter?: ODataQuery): TestEntity[];
    findOneByKeys(id: number): TestEntity;
}
export declare class EmptyEntityController extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): EmptyEntity[];
    emptyEntityAction(value: Genre, type: any): void;
    emptyEntityFunction(value: Genre, type: any): Genre;
}
export declare class EmptyEntity2Controller extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): any[];
}
export declare class EmptyEntity3Controller extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): string;
}
export declare class EmptyEntity4Controller extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): string;
}
export declare class EmptyEntity5Controller extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): boolean;
}
export declare class EmptyEntity6Controller extends ODataController {
    findAll(__: any, ___: any, ____: ODataProcessor): number;
}
export declare class SimpleEntityController extends ODataController {
    findAll(key: string): SimpleEntity[];
    find(key: string): SimpleEntity;
}
export declare class HiddenEmptyController extends ODataController {
}
export declare class MetaTestServer extends ODataServer {
    ActionImport(): void;
    ActionImportParams(value: number[]): void;
    FunctionImport(message: string, value: number[]): string;
    FunctionImport2(message: string): string;
    FunctionImport3(message: string, value: number[], geo: any): string;
    ObjId(v: ObjectID): string;
    ServerEnumTypeActionImport(value: Genre, type: any): void;
    ServerEnumTypeFunctionImport(value: Genre, type: any): Genre;
}
export declare class TypeDefServer extends ODataServer {
}
export declare class EnumServer extends ODataServer {
}
export declare class Executor {
    action(): string;
    action2(): string;
    func(complex: Complex): string;
    func2(meta: Meta): string;
}
export declare class ActionFunctionController extends ODataController {
    action(): string;
    action2(): string;
    func(complex: Complex): string;
    func2(meta: Meta): string;
}
export declare class FuncComplex {
}
export declare class FuncComplex2 {
}
export declare class FuncEntity {
}
export declare class FuncEntity2 {
}
export declare class ActionFunctionServer extends ODataServer {
    action(): string;
    action2(): string;
    action3(): FuncEnum;
    action4(): FuncComplex;
    action5(): FuncEntity;
    action6(enumValue: FuncEnum3): string;
    func(complex: Complex): string;
    func2(meta: Meta): string;
    func3(): FuncEnum2;
    func4(): FuncComplex2;
    func5(): FuncEntity2;
    func6(enumValue: FuncEnum4): string;
    func7(foobar: Foobar): Foobar;
}
