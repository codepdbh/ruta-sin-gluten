export type AuthUser = {
    sub: string;
    email: string;
    name: string;
    role: string;
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
