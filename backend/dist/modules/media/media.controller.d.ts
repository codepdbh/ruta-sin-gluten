export declare class MediaController {
    upload(file?: Express.Multer.File): {
        fileName: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    };
}
