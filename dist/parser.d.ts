type Subtitle = {
    index: number;
    start: string;
    end: string;
    text: string;
};
export declare const toVtt: (subtitles: Subtitle[]) => Blob;
export declare const parseFile: (file: File) => Promise<Subtitle[]>;
export {};
