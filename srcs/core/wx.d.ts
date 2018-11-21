





declare namespace wx {

    export interface IData {
		[key: string]: any;
    }
    
    export interface BaseOptions{
        success?: () => void; 
        fail?: () => void;
        complete?: () => void;
    }

    export interface RequestResult{
        data: any;
    }

    export interface RequestOptions extends BaseOptions {
        url: string;
        data?: string | IData;
		header?: IData;
        method?: string;
        dataType? : string;
		success?: (res?: RequestResult) => void;
    }

    export function request(options: RequestOptions): void;
}