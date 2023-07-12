import { ObjectID } from "mongodb";
export declare class StreamProduct {
    _id: ObjectID;
    CategoryId: ObjectID;
    StreamCategory: StreamCategory;
    Discontinued: boolean;
    Name: string;
    QuantityPerUnit: string;
    UnitPrice: number;
}
export declare class StreamCategory {
    _id: ObjectID;
    Description: string;
    Name: string;
    StreamProducts: StreamProduct[];
    echo(): string[];
}
