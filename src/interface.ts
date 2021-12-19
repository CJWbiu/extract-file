import { MODE } from './enum';

export interface ExtractParams {
    src: string;
    dest: string;
    rules: string;
    mode: MODE
}