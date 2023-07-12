/// <reference types="node" />
import { ServiceMetadata } from "odata-v4-service-metadata";
import { ServiceDocument } from "odata-v4-service-document";
import { Edm as Metadata } from "odata-v4-metadata";
import * as ODataParser from "odata-v4-parser";
import { Token } from "odata-v4-parser/lib/lexer";
import * as express from "express";
import * as http from "http";
import { Transform, TransformOptions } from "stream";
import { ODataResult } from "./result";
import { ODataController } from "./controller";
import * as odata from "./odata";
import { IODataConnector } from "./odata";
import { ODataProcessor, ODataProcessorOptions } from "./processor";
import { ContainerBase } from "./edm";
import { Readable, Writable } from "stream";
/** HTTP context interface when using the server HTTP request handler */
export interface ODataHttpContext {
    url: string;
    method: string;
    protocol: "http" | "https";
    host: string;
    base: string;
    request: express.Request & Readable;
    response: express.Response & Writable;
}
/** ODataServer base class to be extended by concrete OData Server data sources */
export declare class ODataServerBase extends Transform {
    private static _metadataCache;
    static namespace: string;
    static container: ContainerBase;
    static parser: typeof ODataParser;
    static connector: IODataConnector;
    static validator: (odataQuery: string | Token) => null;
    static errorHandler: express.ErrorRequestHandler;
    private serverType;
    static requestHandler(): (req: express.Request, res: express.Response, next: express.NextFunction) => void;
    static execute<T>(url: string, body?: object): Promise<ODataResult<T>>;
    static execute<T>(url: string, method?: string, body?: object): Promise<ODataResult<T>>;
    static execute<T>(context: object, body?: object): Promise<ODataResult<T>>;
    constructor(opts?: TransformOptions);
    _transform(chunk: any, _?: string, done?: Function): any;
    _flush(done?: Function): void;
    static createProcessor(context: any, options?: ODataProcessorOptions): ODataProcessor;
    static $metadata(): ServiceMetadata;
    static $metadata(metadata: Metadata.Edmx | any): any;
    static document(): ServiceDocument;
    static addController(controller: typeof ODataController, isPublic?: boolean): any;
    static addController(controller: typeof ODataController, isPublic?: boolean, elementType?: Function): any;
    static addController(controller: typeof ODataController, entitySetName?: string, elementType?: Function): any;
    static getController(elementType: Function): any;
    static create(): express.Router;
    static create(port: number): http.Server;
    static create(path: string, port: number): http.Server;
    static create(port: number, hostname: string): http.Server;
    static create(path?: string | RegExp | number, port?: number | string, hostname?: string): http.Server;
}
declare const ODataServer_base: odata.IODataBase<ODataServerBase, typeof ODataServerBase> & typeof ODataServerBase;
export declare class ODataServer extends ODataServer_base {
}
/** ?????????? */
/** Create Express middleware for OData error handling */
export declare function ODataErrorHandler(err: any, _: any, res: any, next: any): any;
/** Create Express server for OData Server
 * @param server OData Server instance
 * @return       Express Router object
 */
export declare function createODataServer(server: typeof ODataServer): express.Router;
/** Create Express server for OData Server
 * @param server OData Server instance
 * @param port   port number for Express to listen to
 */
export declare function createODataServer(server: typeof ODataServer, port: number): http.Server;
/** Create Express server for OData Server
 * @param server OData Server instance
 * @param path   routing path for Express
 * @param port   port number for Express to listen to
 */
export declare function createODataServer(server: typeof ODataServer, path: string, port: number): http.Server;
/** Create Express server for OData Server
 * @param server   OData Server instance
 * @param port     port number for Express to listen to
 * @param hostname hostname for Express
 */
export declare function createODataServer(server: typeof ODataServer, port: number, hostname: string): http.Server;
export {};
