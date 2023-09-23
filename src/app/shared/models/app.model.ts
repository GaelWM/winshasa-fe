export type WithWildcards<T> = T & { [key: string]: unknown };
export interface ApiResult<T> {
    data?: T[] | T;
    message?: string;
    success?: boolean;
    links?: ApiResultLink;
    meta?: ApiResultMetaData;
}

export type ApiResultArray<T> = T[];

export interface ApiRowResult<T> {
    data?: T;
    message?: string;
    success?: boolean;
}
export interface ApiResultLink {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
}

export interface ApiResultMetaData {
    current_page?: number;
    from?: number;
    last_page?: number;
    links?: any;
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
}

export interface ApiDataTableResult {
    data?: any;
    first_page_url?: string;
    current_page?: number;
    from?: number;
    last_page?: number;
    last_page_url: string;
    links?: ApiResultLink[];
    next_page_url?: string;
    path?: string;
    per_page?: number;
    prev_page_url?: string;
    to?: number;
    total?: number;
}

export interface ApiResultMeta {
    links?: ApiResultLink;
    meta?: ApiResultMetaData;
}
export interface ConnectionObject {
    id: number;
    name: string;
}

export interface FormError {
    message: string;
    field?: string;
    rule?: string;
}

export const DARK_MODE_MAP_STYLES = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
    },
];
