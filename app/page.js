import Link from "next/link";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

async function getPosts() {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(
    postsCollection,
    orderBy("createdAt", "desc"),
    limit(10)
  );
  const postsSnapshot = await getDocs(postsQuery);
  const posts = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="flex min-h-screen px-4 py-6 bg-gray-100 sm:py-12 md:px-8">
      <div className="container py-3 mx-auto">
        <div>
          <h1 className="mb-6 text-2xl font-semibold text-center lg:mb-12 text-stone-700">
            Blog Posts
          </h1>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full max-w-xs px-4 py-4 bg-white rounded-lg shadow-sm"
            >
              <h2 className="text-lg font-semibold">
                <Link
                  href={`/posts/${post.id}`}
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-stone-500">
                {post.content.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
