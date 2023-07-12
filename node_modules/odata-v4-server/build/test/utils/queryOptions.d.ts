import { Token } from "odata-v4-parser/lib/lexer";
export declare const processQueries: (_query: Token) => Promise<{}>;
export declare const doOrderby: (_response: any[], _options: any) => Promise<{}>;
export declare const doSkip: (_response: any[], _options: any) => Promise<{}>;
export declare const doTop: (_response: any[], _options: any) => Promise<{}>;
export declare const clone: (object: any) => any;
