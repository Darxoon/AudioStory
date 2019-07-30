export interface DataPackage<T> {[valueName: string]: T}
export interface Database<T> {[dbName: string]: DataPackage<T>}
