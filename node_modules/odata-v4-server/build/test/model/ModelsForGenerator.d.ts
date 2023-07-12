import { ObjectID } from "mongodb";
export declare class GeneratorProduct {
    _id: ObjectID;
    CategoryId: ObjectID;
    GeneratorCategory: GeneratorCategory;
    Discontinued: boolean;
    Name: string;
    QuantityPerUnit: string;
    UnitPrice: number;
}
export declare class GeneratorCategory {
    _id: ObjectID;
    Description: string;
    Name: string;
    GeneratorProducts: GeneratorProduct[];
    echo(): string[];
}
