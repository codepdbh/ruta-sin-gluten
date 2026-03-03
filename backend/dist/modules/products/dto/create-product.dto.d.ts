import { GlutenType } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    category: string;
    description?: string;
    price: number;
    stockQty: number;
    stockUnit: string;
    glutenType: GlutenType;
    isActive?: boolean;
    photoUrls?: string[];
}
