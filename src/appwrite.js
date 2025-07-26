import {Client, Databases, ID, Query} from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;  
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // use appwrite SDK to check if the search term exist in  the db
    try {                                           //from whcih db //from which collection
        const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm ) // matching what we have our db with what users searching for
        ])
    // if does exist, update the count
        if (result.documents.length > 0) {
            // get the document
            const doc = result.documents[0];

            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: count + 1,
            })
    // if it doesn't exisit, create a new document with with the search term and count as 1
        } else {
            await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getTrendingMovies = async() => {
    try {
        const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5), //only get 5 movies
            Query.orderDesc("count")
        ])

        return result.documents;
    } catch (error) {
        console.log(error);
    }
}