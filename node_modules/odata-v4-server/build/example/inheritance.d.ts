import { ODataController, ODataServer } from "../lib";
export declare class Category {
    id: number;
    title: string;
    constructor(title: string);
}
export declare class Subcategory extends Category {
    subtitle: string;
    constructor(title: string, subtitle: string);
}
export declare class Subcategory2 extends Category {
    subtitle2: string;
    constructor(title: string, subtitle: string);
}
export declare class SubcategoryDetails extends Subcategory {
    description: string;
    subid: number;
    constructor(title: string, subtitle: string, description: string);
}
export declare class InheritanceController extends ODataController {
    all(): (Category | {
        id: number;
        title: string;
        "@odata.type": typeof Category;
    })[];
    one(_: number, __: number): SubcategoryDetails;
    insert(data: any, type: string): any;
}
export declare class InheritanceServer extends ODataServer {
}
