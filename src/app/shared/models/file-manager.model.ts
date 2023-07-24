export class Items {
    folders: Item[];
    files: Item[];
    path: any[];
    result?: FileManagerResult;

    constructor(model: any) {
        this.folders =
            model.directories && model.directories.map((dir) => new Item(dir));
        this.files = model.files && model.files.map((file) => new Item(file));
        this.result = model.result;
        this.path = model.path;
    }
}

export class Item {
    id?: string;
    folderId?: string;
    name?: string;
    createdBy?: string;
    createdAt?: string;
    modifiedAt?: string;
    size?: string;
    type?: string;
    contents?: string | null;
    description?: string | null;
    path: string;

    constructor(model: any) {
        this.name = model.name ?? model.basename;
        this.id = model.name ?? model.basename;
        this.folderId = model.directory && model.directory.basename;
        this.createdAt = model.createdAt;
        this.createdBy = model.createdBy;
        this.modifiedAt = model.modifiedAt;
        this.size = model.size;
        this.type = model.type;
        this.contents = model.contents;
        this.description = model.description;
        this.path = model.path;
    }
}

export interface FileManagerFile {
    type: string;
    path: string;
    timestamp: number;
    size: number;
    dirname: string;
    basename: string;
    extension: string;
    filename: string;
}

export interface FileManagerDirectory {
    name?: string;
    type: string;
    path: string;
    timestamp: number;
    dirname: string;
    basename: string;
}

export interface FileManagerResult {
    status: string;
    message: string;
}
export interface FileManagerDoc {
    result: FileManagerResult;
    directories: FileManagerDirectory[];
    files: FileManagerFile[];
}

export interface DocModel {
    docs: FileManagerDoc;
    root: FileManagerDirectory[];
}

export interface DocTree {
    type: string;
    path: string;
    timestamp: number;
    basename: string;
    dirname: string;
    props: {
        hasSubdirectories: boolean;
    };
}
