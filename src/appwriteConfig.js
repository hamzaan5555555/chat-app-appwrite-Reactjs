import { Client , Databases , Account } from 'appwrite';

export const PROJECT_ID = '668d0dc2002e44b0b719'
export const DATABASE_ID = '668d100f00206af7c36f'
export const COLLECTION_ID_MESSAGES = '668d102800171dfc42ef'



const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('668d0dc2002e44b0b719');

export const databases = new Databases(client);
export const account = new Account(client);

export default client;