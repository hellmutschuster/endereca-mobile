export interface Address {
    name?: string,
    locationType: string,
    createdBy: string,
    project: string,
    observations?: string,
    plusCode: string,
    location: {
        type: "Point",
        coordinates: [any, any]
    }
}