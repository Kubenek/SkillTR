
export type Connection = {
    From: HTMLDivElement;
    To:   HTMLDivElement;
    SVG:  SVGLineElement;
}

export type ConnectionData = {
    SourceUUID:      string; 
    DestinationUUID: string;
}