import GoogleProvider from 'next-auth/providers/google'; // Importing Google Provider for authentication.
import { db } from '../db/db'; // Importing the database instance.
import { users } from '../db/schema'; // Importing the users table schema.
import { AuthOptions } from 'next-auth'; // Importing AuthOptions type for NextAuth configuration.

// Exporting authOptions to configure authentication for NextAuth
export const authOptions: AuthOptions = {
    providers: [
        // Configuring Google OAuth provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string, // Client ID from Google API Console.
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Client Secret from Google API Console.

            // Overriding the profile function to customize the user profile object.
            async profile(profile, token: any) {

                // Prepare the user data object to store in the database.
                const data = {
                    fname: profile.given_name, // User's first name from Google profile.
                    lname: profile.family_name, // User's last name from Google profile.
                    email: profile.email, // User's email from Google profile.
                    provider: 'GOOGLE', // OAuth provider name (Google).
                    externalId: profile.sub, // Unique identifier from Google profile.
                    image: profile.picture, // User's profile picture URL from Google profile.
                };

                try {
                    // Insert or update user in the database based on the email (onConflict).
                    const user = await db
                        .insert(users) // Insert into the `users` table.
                        .values(data) // Insert the `data` object.
                        .onConflictDoUpdate({ 
                            target: users.email, // If the email already exists in the table...
                            set: data, // Update the existing record with the new `data`.
                        })
                        .returning(); // Return the newly inserted/updated user record.

                    // Returning user data to NextAuth with required fields.
                    return {
                        ...data, // Spread the existing data fields.
                        name: data.fname, // Set the name field for NextAuth sessions.
                        id: String(user[0].id), // Include the user's database ID as a string.
                        role: user[0].role, // Include the user's role from the database.
                    };
                } catch (err) {
                    console.log(err); // Log any errors during database operations.
                    return {
                        id: '', // Return an empty ID if an error occurs.
                    };
                }
            },
        }),
    ],
    callbacks: {
        // Callback to customize the session object.
        session(data: any) {
            return data; // Pass session data unchanged.
        },
        // Callback to customize the JWT token.
        jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                // If a user object is available, add the role and ID to the token.
                token.role = user.role; // Add the user's role to the token.
                token.id = user.id; // Add the user's database ID to the token.
            }
            return token; // Return the updated token.
        },
    },
};
