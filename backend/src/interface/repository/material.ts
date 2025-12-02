export interface IMaterialRepository{
    delete: (id: string) => Promise<void>
}