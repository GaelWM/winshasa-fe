import { FuseAlertType } from '@fuse/components/alert';

export interface AlertModel {
    title: string;
    type: FuseAlertType;
    message: string;
}
