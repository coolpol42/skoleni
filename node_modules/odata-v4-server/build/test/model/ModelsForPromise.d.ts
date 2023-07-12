import { ObjectID } from "mongodb";
export declare class ProductPromise {
    _id: ObjectID;
    CategoryId: ObjectID;
    CategoryPromise: CategoryPromise;
    Discontinued: boolean;
    Name: string;
    QuantityPerUnit: string;
    UnitPrice: number;
}
export declare class CategoryPromise {
    _id: ObjectID;
    Description: string;
    Name: string;
    ProductPromises: ProductPromise[];
    echo(): string[];
}
