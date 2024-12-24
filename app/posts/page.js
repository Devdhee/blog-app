import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    <div className="flex flex-col justify-center min-h-screen py-6 bg-gray-100 sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="mb-6 text-2xl font-semibold">Latest Blog Posts</h1>
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="py-4">
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2">{post.content.substring(0, 150)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
